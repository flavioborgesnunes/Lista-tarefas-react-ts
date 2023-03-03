/*              The MIT License (MIT)

Copyright (c) 2015 Microsoft Corporation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.                       */

(function (mediaPlayer) {
    "use strict";

    amp.plugin("preview", function (options) {

        //retrieve input parameters
        var previewType    = !!options && !!options.previewType    ? options.previewType    : "image";         //image or video
        var previewWidth   = !!options && !!options.previewWidth   ? options.previewWidth   : 200;             //width of preview
        var previewQuality = !!options && !!options.previewQuality ? options.previewQuality : 0;               //bitrate/quality layer index of profile - 0 the lowest
        var test_mode      = !!options && !!options.testMode       ? options.testMode       : false;           //test_mode toggle
        var previewLength = 1;                                                                                 //# of segments if previewType = "video", currently always 1
        //hovering div style depends on input
        var hover_vertical_offset = parseInt(previewWidth) / 2 + 15;   //90 default;

        //AMP variables
        var player = this;
        var progressControl = player.controlBar.progressControl;      

        //MPD parameters
        var completeMimeType;                  //to be determined by parsing MPD
        var initialization, media, timescale;  //exactly as MPD attributes
        var bandwidth;                         //$Bandwidth$
        var segmentBaseUrl;                    //base portion of segment URL before QualityLevels($Bandwidth$)/Fragments(video=$Time$,format=mpd-time-csf)
        var initializationSegment;             //initialization segment
        var initializationSegmentUrl;          //initialization segment URL
        var kfvSegments;                        //keyframe or video segment
        var kfvSegmentUrl;                     //keyframe or video segment URL
        var segments;                          //array holding time segments {start: m, end: n}, in timescale

        //video preview
        var hover;                             //<div> element containing videoElement and other UI elements
        var videoElement;                      //<video> element for displaying preview segment: either keyframe or video segment
        var status;                            //for testing only, when test_mode=true
        
        //image preview
        var thumbnailObject;                   //new Image();
        var thumbnailImage;                    //image element

        var dictionaryKeyframeImage;           //dictionary: key = kfvSegmentUrl, value = image.src


        //******************** ELEMENTS & POSITIONS  ************************//
        var getComputedStyle = function (el, pseudo) {
            return function (prop) {
                if (window.getComputedStyle) {
                    return window.getComputedStyle(el, pseudo)[prop];
                } else {
                    return el.currentStyle[prop];
                }
            };
        };

        var offsetParent = function (el) {
            if (el.nodeName !== 'HTML' && getComputedStyle(el)('position') === 'static') {
                return offsetParent(el.offsetParent);
            }
            return el;
        };

        var getScrollOffset = function () {
            if (window.pageXOffset) {
                return {
                    x: window.pageXOffset,
                    y: window.pageYOffset
                };
            }
            return {
                x: document.documentElement.scrollLeft,
                y: document.documentElement.scrollTop
            };
        };

        //add the div hosting thumbnail
        hover = document.createElement("div");
        hover.id = "hover";
        hover.style.top = -1 * (player.controlBar.el().offsetHeight + hover_vertical_offset) + "px";
        hover.style.visibility = "hidden";
        hover.style.display = "block";
        hover.style.width = previewWidth + "px";
        hover.style.position = "absolute";
        hover.style.fontSize = "x-small";

        //create a video element
        videoElement = document.createElement("video");
        videoElement.id = "thumbnailvideo";
        videoElement.style.width = previewWidth + "px";
        hover.appendChild(videoElement);

        //create an image element
        if (previewType === "image") {
            thumbnailImage = document.createElement("img");
            thumbnailImage.id = "thumbnailImage";
            thumbnailImage.style.width = previewWidth + "px";
            hover.appendChild(thumbnailImage);
        }

        //status display (test mode)
        if (test_mode === true) {
            status = document.createElement("div");
            status.id = "status";
            hover.appendChild(status);
        }

        //player.controlBar.el().appendChild(hover);
        player.controlBar.progressControl.seekBar.el().appendChild(hover);


        /******************** EVENTS **********************/
        progressControl.on("mousemove", mousemove);
        //progressControl.on("mousemove", debounce_mousemove);
        //progressControl.on("mousemove", throttle(mousemove, 50));

        //determine which segment mouseTime falls within (and subsequent segments for viewo preview), for the purpose of determining $Time$
        function getSelectedSegments(mouseTime) {
            //var start = performance.now();
            var selectedSegments = [];
            if (!!segments && segments.length > 0) {
                for (var i = 0; i < segments.length; i++) {
                    if (mouseTime >= segments[i].start && mouseTime < segments[i].end) {
                        selectedSegments.push(segments[i]);
                        break;
                    }
                }

                if (selectedSegments.length === 0) {
                    selectedSegments.push(segments[0]);
                }
            } else {
                selectedSegments.push({
                    start: 0,
                    end: 20000000
                });
            }

            // console.log(reti);
            // console.log(selectedSegments[0].start);
            //var end = performance.now();
            //console.log("Compute time in determining mouse segment: " + (end - start) + "ms");

            return selectedSegments;
        }

        function throttle(callback, limit) {
            var wait = false;
            return function () {
                if (!wait) {

                    callback.apply(null, arguments);
                    wait = true;
                    setTimeout(function () {
                        wait = false;
                    }, limit);
                }
            };
        }

        // Credit David Walsh (https://davidwalsh.name/javascript-debounce-function)

        // Returns a function, that, as long as it continues to be invoked, will not
        // be triggered. The function will be called after it stops being called for
        // N milliseconds. If `immediate` is passed, trigger the function on the
        // leading edge, instead of the trailing.
        function debounce(func, wait, immediate) {
            var timeout;

            // This is the function that is actually executed when
            // the DOM event is triggered.
            return function executedFunction() {
                // Store the context of this and any
                // parameters passed to executedFunction
                var context = this;
                var args = arguments;

                // The function to be called after 
                // the debounce time has elapsed
                var later = function () {
                    // null timeout to indicate the debounce ended
                    timeout = null;

                    // Call function now if you did not on the leading end
                    if (!immediate) func.apply(context, args);
                };

                // Determine if you should call the function
                // on the leading or trail end
                var callNow = immediate && !timeout;

                // This will reset the waiting every function execution.
                // This is the step that prevents the function from
                // being executed because it will never reach the 
                // inside of the previous setTimeout  
                clearTimeout(timeout);

                // Restart the debounce waiting period.
                // setTimeout returns a truthy value (it differs in web vs node)
                timeout = setTimeout(later, wait);

                // Call immediately if you're dong a leading
                // end execution
                if (callNow) func.apply(context, args);
            };
        };

        var debounce_mousemove = debounce(function(event) {
            mousemove(event);
        }, 250);

        function mousemove(event) {
            //determine mousetime
            
            var pageX = event.pageX;
            var clientX = event.clientX;
            var pageXOffset = getScrollOffset().x;
            var clientRect = offsetParent(progressControl.el()).getBoundingClientRect();
            var duration = player.duration();
            // find the page offset of the mouse
            var left = event.pageX || (event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft);
            // subtract the page offset of the positioned offset parent
            left -= clientRect.left + pageXOffset;
            var tempoSalto = 0;
            // if (duration>30){
            //     tempoSalto=25; 
            // }
            var mouseTime = ((left - progressControl.el().offsetLeft) / progressControl.width() * duration)+tempoSalto;
            // console.log(progressControl.width());
            // console.log(mouseTime);

            //get $Time$ in media
            var selectedSegments = getSelectedSegments(mouseTime * timescale);
            var time = selectedSegments[0].start;
            var segmentVirtualUrl = media.replace("$Bandwidth$", bandwidth).replace("$Time$", time);
            kfvSegmentUrl = segmentBaseUrl + segmentVirtualUrl;
            if (previewType !== "video") {
                kfvSegmentUrl = kfvSegmentUrl.replace("/Fragments(", "/Keyframes(");
            }

            if (test_mode === true) {
                displayStatus("<span style='color:red'>Starting keyframe download ......</span>");
                ////console.log("Starting to download DASH segment from: " + kfvSegmentUrl);
            }

            BrowserUtils.xhrRequest(kfvSegmentUrl, "GET", "arraybuffer", "", "", function (data) {
                if (!!data) {

                    videoElement = document.getElementById("thumbnailvideo");

                    if (videoElement.currentTime === 0) {
                        kfvSegments = [];
                        kfvSegments.push(data);
                        setupPreview(0);  
                    }

                    if (test_mode === true) {
                        displayStatus("Download complete. Segment size: " + data.byteLength + ".");
                        //// console.log("DOWNLOAD COMPLETED: $Bandwidth$=" + bandwidth + " | $Time$=" + time + " | downloaded DASH keyframe size = " + data.byteLength);
                        //// console.log("initializationSegment.byteLength: " + initializationSegment.byteLength);
                        //// console.log("Attempt to display preview");
                    }
                }
            });


            //hover positioning
            hover.style.display = "block";
            hover.style.visibility = "visible";

            if (left < hover.offsetWidth / 2) {
                hover.style.left = 0;
            } else if (left + hover.offsetWidth / 2 < progressControl.width() && left > hover.offsetWidth / 2) {
                hover.style.left = left - progressControl.el().offsetLeft - hover.offsetWidth / 2 + "px";
            } else {
                hover.style.left = progressControl.width() - hover.offsetWidth + "px";
            }
        }

        //hide when mouseout
        player.controlBar.progressControl.el().addEventListener("mouseout", function () {
            
            //hover.style.left = "-1000px";
            hover.style.display = "none";
            //hover.style.visibility = "hidden";

            //reset videoElement
            videoElement = document.getElementById("thumbnailvideo");
            videoElement.pause();
            videoElement.currentTime = 0;
            videoElement.removeAttribute("src"); // empty source
            videoElement.load();
            //sourceBuffer = null;
        });

        player.ready(function () {  //main function
            registerPreviewEvents();
        });

        //register events to handle 
        function registerPreviewEvents() {
            var events = [
                amp.eventName.ended,
                amp.eventName.canplaythrough,
            ];

            for (var i = 0; i < events.length; i++) {
                player.addEventListener(events[i], previewEventHandler);
            }
        }

        function previewEventHandler(evt) {
            switch (evt.type) {
                case amp.eventName.canplaythrough:
                    var url = getDashUrl();
                    getMPD(url);
                    break;
                case amp.eventName.ended:
                    //player.poster("Content/images/HoloLens.jpg");
                    player.currentTime(0);
                    player.exitFullscreen();
                    break;
                default:
                    break;
            }
        }



        //****************************************
        // BROWSER UTILS
        //****************************************

        function BrowserUtils() { }

        //Utility function for making XMLHttpRequest
        //httpMethod: GET, or POST
        //responseType: arraybuffer, "" (default: text), blob, stream
        //msCaching: auto, enabled, disabled
        BrowserUtils.xhrRequest = function (url, httpMethod, responseType, msCaching, context, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open(httpMethod, url);
            xhr.responseType = responseType;
            xhr.msCaching = msCaching;
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        if (context === "useResponseXML") {        //MPD request
                            callback(xhr.responseXML, context);
                        }
                        else {                                    //fragment/LA request
                            callback(xhr.response, context);
                        }
                    } else {
                        //// console.log("XHR: failed. URL = " + url + ". Status = " + xhr.status + ". " + xhr.statusText);
                        callback(null, context);
                    }
                }
            };
            xhr.send();
            //console.log("XHR: method=" + httpMethod + ", ResponseType=" + responseType + ", URL=" + url);

            return xhr;
        };

        function getVideoTrackArray(amPlayer) {
            var videoTrackArray = [];

            if (amPlayer.currentVideoStreamList() !== undefined) {
                var videoStreamList = amPlayer.currentVideoStreamList();
                var videoTracks;

                for (var i = 0; i < videoStreamList.streams.length; i++) {
                    videoTracks = videoStreamList.streams[i].tracks;
                    if (videoTracks !== undefined) {
                        for (var j = 0; j < videoTracks.length; j++)
                            videoTrackArray.push({
                                bitrate: videoTracks[j].bitrate,
                                width: videoTracks[j].width,
                                height: videoTracks[j].height,
                                selectable: videoTracks[j].selectable
                            });
                    }
                }
            }

            return videoTrackArray;
        }


        //index = 0 for lowest bitrate and incrementing
        function getSelectedBitrate(player, index) {
            var selectedBitrate;

            var videoTrackArray = getVideoTrackArray(player);
            var bitrates = [];
            for (var i = 0; i < videoTrackArray.length; i++) {
                bitrates.push(videoTrackArray[i].bitrate);
            }

            //var uint32Array = bitrates.sort((a, b) => a - b);   //ES2015
            var uint32Array = new Uint32Array(bitrates);   //this is much faster than the above way
            uint32Array = uint32Array.sort();
            if (index < 0) {
                selectedBitrate = uint32Array[0];
            } else if (index >= uint32Array.length) {
                selectedBitrate = uint32Array[uint32Array.length - 1];
            }
            else {
                selectedBitrate = uint32Array[index];
            }

            return selectedBitrate;
        }

        //get smooth URL
        function getSmoothUrl() {
            var url = player.currentSrc();
            url = url.substr(0, url.toLowerCase().indexOf("/manifest") + 9);
            return url;
        }

        function getDashUrl() {
            var url = getSmoothUrl() + "(format=mpd-time-csf)";
            return url;
        }

        //*********************MPD Parser *********************
        /* global variables used:
         * initialization
         * timescale
         * media
         * bandwidth
         * completeMimeType
         * segments
         * segmentBaseUrl
         */

        function getMPD(url) {

            //*****use DashParser to get DASH manifest parameters
            var dashManifestRequest = new XMLHttpRequest();
            dashManifestRequest.open("GET", url, true);
            dashManifestRequest.responseType = "text";
            dashManifestRequest.onerror = function (error) {
                console.error("There was an error downloading the manifest from " + url, error);
                //player.trigger(mediaPlayer.eventName.framerateerror);
            };
            dashManifestRequest.onload = function () {

                var dashParser = Dash.dependencies.DashParser();
                dashParser.debug = new DebugLog;
                dashParser.errHandler = new ErrorLog;
                var manifest = dashParser.parse(dashManifestRequest.response, url);
                
                var videoAdaptationSet = manifest.Period.AdaptationSet.filter(function (adaptationSet) {
                    return (!!adaptationSet.contentType && adaptationSet.contentType.toLowerCase() === 'video') ||
                           (!!adaptationSet.mimeType && adaptationSet.mimeType.toLowerCase() === 'video/mp4');
                })[0];
                // var videoAdaptationSetAudio = manifest.Period.AdaptationSet[0];
                // var videoAdaptationSet = manifest.Period.AdaptationSet[1];
                

                completeMimeType = getCompleteMimeType(videoAdaptationSet);

                var videoSegmentTemplate = videoAdaptationSet.SegmentTemplate;
                //timescale
                timescale = videoSegmentTemplate.timescale;              //10000000
                //// console.log("timescale: " + timescale);
                //media
                media = videoSegmentTemplate.media;                      //QualityLevels($Bandwidth$)/Fragments(video=$Time$,format=mpd-time-csf)
                ////console.log("media: " + media);
                //initialization
                initialization = videoSegmentTemplate.initialization;    //QualityLevels($Bandwidth$)/Fragments(video=i,format=mpd-time-csf)
                ////console.log("initialization: " + initialization);

                var segmentTimeline = videoSegmentTemplate.SegmentTimeline;

                //collect all video segments info (start, end)
                segments = getSegments(segmentTimeline);

                //get the specified $Bandwidth$ (both $Bandwidth$ and initialization are required to build the URL for requesting video initialization
                //bandwidth = getLowestBitrate(player);
                bandwidth = getSelectedBitrate(player, previewQuality);
                ////console.log("Selected bitrate/bandwidth: " + bandwidth);

                //get segmentBaseUrl
                segmentBaseUrl = getSmoothUrl().replace("Manifest", "").replace("manifest", "");

                //get URL for video initialization
                if (!!initialization && !!bandwidth) {
                    initializationSegmentUrl = segmentBaseUrl + initialization.replace("$Bandwidth$", bandwidth);

                    //request initializationSegment
                    BrowserUtils.xhrRequest(initializationSegmentUrl, "GET", "arraybuffer", "", "", function (data) {
                        if (!!data) {
                            initializationSegment = data;
                            if (test_mode === true) {
                                ////console.log("initializationSegmentUrl: " + initializationSegmentUrl);
                                ////console.log("initializationSegment.byteLength from initial download: " + initializationSegment.byteLength);
                            }
                        }
                    });
                }

                //build dictionary
                buildDictionary();
            };
            dashManifestRequest.send();


            //BrowserUtils.xhrRequest(url, "GET", "", "", "useResponseXML", function (xml) {
            //    if (!!xml) {
            //        //get initialization, media, timescale paramters
            //        var segmentTemplates = xml.getElementsByTagName("SegmentTemplate");
            //        if (!!segmentTemplates && segmentTemplates.length > 0) {
            //            for (var j = 0; j < segmentTemplates.length; j++) {
            //                initialization = segmentTemplates[j].getAttribute("initialization");
            //                if (initialization == "QualityLevels($Bandwidth$)/Fragments(video=i,format=mpd-time-csf)") {
            //                    media = segmentTemplates[j].getAttribute("media");
            //                    timescale = segmentTemplates[j].getAttribute("timescale");
            //                    break;
            //                }
            //            }
            //        }

            //        //get d for video representations. This is not the best way. We should use DashParser
            //        var segmentTimelines = xml.getElementsByTagName("SegmentTimeline");
            //        if (!!segmentTimelines && segmentTimelines.length > 0) {
            //            for (var i = 0; i < segmentTimelines.length; i++) {
            //                if (segmentTimelines[i].parentNode.getAttribute("initialization") == "QualityLevels($Bandwidth$)/Fragments(video=i,format=mpd-time-csf)") {
            //                    d = segmentTimelines[i].firstChild.getAttribute("d");
            //                    //more detailed processing required here. What if it includes non-repeating segments
            //                    break;
            //                }
            //            }
            //        }


            //        //get $Bandwidth$ - the lowest bitrate (both $Bandwidth$ and initialization are required to build the URL for requesting video initialization
            //        bandwidth = getLowestBitrate();

            //        //get segmentBaseUrl
            //        segmentBaseUrl = getSmoothUrl().replace("Manifest", "").replace("manifest", "");

            //        //get URL for video initialization
            //        if (!!initialization && !!bandwidth) {
            //            var initializationSegmentUrl = segmentBaseUrl + initialization.replace("$Bandwidth$", bandwidth);
            //            console.log(initializationSegmentUrl);

            //            //request initializationSegment
            //            BrowserUtils.xhrRequest(initializationSegmentUrl, "GET", "arraybuffer", "", "", function (data) {
            //                if (!!data) {
            //                    initializationSegment = data;
            //                    console.log(initializationSegment);
            //                }
            //            });
            //        }


            //}  //if (!!xml)
            //}

        }  //getMPD

        //get the completeMimeType ('video/mp4; codecs="avc1.4D4020"') which is required by all Chromium-based browsers.
        function getCompleteMimeType(videoAdaptationSet) { 
            var completeMimeType;

            var mimeType = videoAdaptationSet.mimeType;
            var codecs = videoAdaptationSet.codecs;
            if (mimeType.indexOf("codecs") === -1) {
                completeMimeType = mimeType + "; codecs=\"" + codecs + "\"";
            } else {
                completeMimeType = mimeType;
            }

            return completeMimeType;
        }

        function getSegments(segmentTimeline) {
            var segment;
            var segmentStart = 0;
            var repeat;
            segments = [];
            if (!!segmentTimeline.S_asArray && segmentTimeline.S_asArray.length > 0) {
                ////console.log("segmentTimeline.S_asArray.length = " + segmentTimeline.S_asArray.length);

                for (var i = 0; i < segmentTimeline.S_asArray.length; i++) {
                    repeat = segmentTimeline.S_asArray[i].r;
                    //console.log("repeat = " + repeat);
                    if (!!repeat && repeat > 1) {
                        segmentStart = segmentTimeline.S_asArray[i].t || segmentStart;
                        for (var j = 0; j < repeat; j++) {
                            segment = {
                                start: segmentStart,
                                end: segmentStart + segmentTimeline.S_asArray[i].d
                            };
                            segments.push(segment);
                            segmentStart += segmentTimeline.S_asArray[i].d;
                        }

                    } else {
                        segmentStart = segmentTimeline.S_asArray[i].t || segmentStart;
                        segment = {
                            start: segmentStart,
                            end: segmentStart + segmentTimeline.S_asArray[i].d
                        };
                        segments.push(segment);
                        segmentStart += segmentTimeline.S_asArray[i].d;
                        
                    }
                }
            }

            //print segments array
            if (test_mode === true) {
                for (var k = 0; k < segments.length; k++) {
                    ////console.log("segment_" + k + ": [" + segments[k].start + ", " + segments[k].end + "]");
                }
            }

            return segments;
        }
        function getSegmentsNew(segmentTimeline, segmentTimelineAudio) {
            var segment;
            var segmentStart = 0;
            var repeat;
            segments = [];
            if (!!segmentTimeline.S_asArray && segmentTimeline.S_asArray.length > 0) {
                ////console.log("segmentTimeline.S_asArray.length = " + segmentTimeline.S_asArray.length);

                for (var i = 0; i < segmentTimeline.S_asArray.length; i++) {
                    segmentStart = segmentTimeline.S_asArray[i].t || segmentStart;
                    segment = {
                        start: segmentStart,
                        end: segmentStart + segmentTimeline.S_asArray[i].d
                    };
                    segments.push(segment);
                    segmentStart += segmentTimeline.S_asArray[i].d;
                   
                }
            }

            //print segments array
            if (test_mode === true) {
                for (var k = 0; k < segments.length; k++) {
                    ////console.log("segment_" + k + ": [" + segments[k].start + ", " + segments[k].end + "]");
                }
            }

            return segments;
        }

        var DebugLog = (function () {
            function DebugLog() {
                this.log = function (message) {
                    ////console.log(message);
                };
            }
            return DebugLog;
        })();

        var ErrorLog = (function () {
            function ErrorLog() {
                this.manifestError = function (message, id, manifest) {
                    ////console.error(message);
                };
            }
            return ErrorLog;
        })();

        function displayStatus(msg) {
            status.innerHTML = msg;
        }

        

        function buildDictionary() {
            dictionaryKeyframeImage = {};
            //var time;
            //var segmentVirtualUrl;
            //for (var i = 0; i < segments.length; i++) {
            //    time = segments[i].start;
            //    segmentVirtualUrl = media.replace("$Bandwidth$", bandwidth).replace("$Time$", time);
            //    kfvSegmentUrl = segmentBaseUrl + segmentVirtualUrl;
            //    kfvSegmentUrl = kfvSegmentUrl.replace("/Fragments(", "/Keyframes(");

            //    BrowserUtils.xhrRequest(kfvSegmentUrl, "GET", "arraybuffer", "", "", function (data) {
            //        if (!!data) {

            //            videoElement = document.getElementById("thumbnailvideo");

            //            if (videoElement.currentTime === 0) {
            //                kfvSegments = [];
            //                kfvSegments.push(data);
            //                setupPreview(0);                           
            //            }
            //        }
            //    });          
            //}

            //for (var key in dictionaryKeyframeImage) {
            //    console.log(dictionaryKeyframeImage[key]);
            //}
        }

        //************************* MSE code 
        /*global variables involved: 
         * videoElement, 
         * initializationSegment, 
         * initializationSegmentUrl, 
         * kfvSegments, 
         * completeMimeType
         */
        
        function setupPreview(index) {

            // Create MSE object (the following 2 variables were moved into function scope from global)
            var vidSourceBuffer; 
            //var mediaSource = null;  
            var mediaSource = new MediaSource();

            // Register sourceopen event handler in order to add source buffers to MSE after it has been attached to the video element.
            mediaSource.addEventListener("sourceopen", function () {
                // Register timeupdate event handler to monitor buffer level
                //videoElement.addEventListener("timeupdate", saveThumbnail, false);
                videoElement.addEventListener("ended", saveThumbnail, false);
                if (mediaSource.sourceBuffers.length === 0) {
                    // Add video source buffers 
                    vidSourceBuffer = createSourceBuffer(mediaSource, completeMimeType, index);

                    // add segments
                    appendInitSegment(vidSourceBuffer);  //moved here from line 648
                    updateSourceBuffers(mediaSource, vidSourceBuffer, index);
                }
            }, false);

            //mediaSource.addEventListener("sourceclose", function () {
            //    videoElement.removeEventListener("timeupdate", updateSourceBuffers, false);
            //}, false);

            //setSourceTime = performance.now();

            // Attach the MSE object to the video element
            var playPromise;
            videoElement.src = URL.createObjectURL(mediaSource, { oneTimeOnly: true });
            if (previewType === "video") {
                playPromise = videoElement.play();  
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        // Automatic playback started!
                        // Show playing UI.
                        // We can now safely pause video...
                        //video.pause();
                    })
                        .catch(error => {
                            // Auto-play was prevented
                            ////console.log("Promise for video.play() is rejected.");
                        });
                }
            } else {
                //if use <video> to display keyframe
                //videoElement.load();  //https://developers.google.com/web/updates/2017/06/play-request-was-interrupted

                //if use <img> to display image obtained from keyframe
                playPromise = videoElement.play();
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        //keyframe => image => show in <img>
                        showThumbnail();
                    })
                        .catch(error => {
                            // Auto-play was prevented
                            ////console.log("Promise for video.play() is rejected.");
                        });
                }
            }
        }

        // helper to add a source buffer and initialize some state
        function createSourceBuffer(mediaSource, mimeType, index) {

            if (mediaSource.readyState !== "open") { return; }   //if mediaSource.readyState !== "open", mediaSource.addSourceBuffer will fail

            var sourceBuffer = mediaSource.addSourceBuffer(mimeType);

            // Store additional state as custom properties on the source buffers
            sourceBuffer.needsInitSegment = true;
            sourceBuffer.lastInitSegmentUrl = "";
            sourceBuffer.nextSegment = 0;
            sourceBuffer.eos = false;
            sourceBuffer.isVideo = true;
            sourceBuffer.appendingData = false;

            // Register updateend event handler to know when the append or remove operation has completed
            sourceBuffer.addEventListener("updateend", function () {
                sourceBuffer.appendingData = false;
                updateSourceBuffers(mediaSource, sourceBuffer, index);
            });

            return sourceBuffer;
        }

        // function called periodically to update the source buffers by appending more segments
        function updateSourceBuffers(mediaSource, vidSourceBuffer, index) {

            //appendInitSegment(vidSourceBuffer);
            //appendNextMediaSegment(vidSourceBuffer, index);   //moved below


            // Call mediaSource.endOfStream() once all segments have been appended
            //if (vidSourceBuffer && vidSourceBuffer.eos && mediaSource.readyState !== "ended") {
            //    mediaSource.endOfStream();
            //    getBufferLevel(vidSourceBuffer);
            //}

            //to avoid the error: Uncaught DOMException: Failed to execute 'endOfStream' on 'MediaSource': The 'updating' attribute is true on one or more of this MediaSource's SourceBuffers.
            //https://developer.mozilla.org/en-US/docs/Web/API/MediaSource/endOfStream
            if (!!vidSourceBuffer) {
                vidSourceBuffer.addEventListener("updateend", function () {
                    appendNextMediaSegment(vidSourceBuffer, index);   //this line was moved from above into here
                    if (!vidSourceBuffer.updating && mediaSource.readyState === "open") {
                        mediaSource.endOfStream();
                        getBufferLevel(vidSourceBuffer);
                    }
                });
            }
        }

        // appends an INIT segment if necessary
        function appendInitSegment(sourceBuffer) {
            // no-op if already appended an INIT segment or
            // if we are still processing an append operation
            if (!sourceBuffer || !sourceBuffer.needsInitSegment || sourceBuffer.appendingData) {
                return;
            }

            // Download and append segment
            sourceBuffer.appendingData = true;


            /*
              downloadSegment(0, 0, url, function(data) {
                if (data) {
                  sourceBuffer.appendBuffer(data);
                  sourceBuffer.needsInitSegment = false;
                  sourceBuffer.lastInitSegmentUrl = url;
                  //sourceBuffer.eos = true;
                } else {
                  sourceBuffer.appendingData = false;
                }
              });
              */

            sourceBuffer.appendBuffer(initializationSegment);
            sourceBuffer.needsInitSegment = false;
            sourceBuffer.lastInitSegmentUrl = initializationSegmentUrl;
        }

        // appends the next MEDIA segment if necessary
        function appendNextMediaSegment(sourceBuffer, index) {
            // no-op if we are still processing an append operation
            // or if we have more than 4 seconds of data already buffered up
            if (!sourceBuffer || sourceBuffer.appendingData) {
                return;
            }

            // Check if there are no more segments to download
            if (sourceBuffer.eos === true) {
                return;
            }

            sourceBuffer.appendingData = true;

            /*
            downloadSegment(0, 0, keyFrameUrl, function(data) {
              if (data) {
                if (!timerStarted) {
                  firstAppendTime = performance.now();
                  timerStarted = true;
                  timingTTFF = true;
                }
                //sourceBuffer.timestampOffset = -390;
                sourceBuffer.appendBuffer(data);
                sourceBuffer.eos = true;
              } else {
                sourceBuffer.appendingData = false;
              }
            });
            */
            if (kfvSegments){
                sourceBuffer.appendBuffer(kfvSegments[0]);
            }
            sourceBuffer.eos = true;
        }

        // returns the amount of time buffered also set the video position to buffer start time
        function getBufferLevel(sourceBuffer) {
            var frameStart; //moved to function scope
            var end;
            var bufferLevel = 0;

            for (var i = 0; i < sourceBuffer.buffered.length; i++) {
                frameStart = sourceBuffer.buffered.start(i);
                end        = sourceBuffer.buffered.end(i);

                videoElement.currentTime = frameStart;

                bufferLevel = end - frameStart;
            }

            return bufferLevel;
        }

        //**********************************


        //**********************************IMAGE

        //convert keyframe to image via canvas 
        function keyframeToImage() {
            var tmpCanvas = document.createElement("canvas");
            tmpCanvas.width = previewWidth;
            tmpCanvas.height = 150;
            tmpCanvas.getContext("2d").drawImage(videoElement, 0, 0, previewWidth, 90);

            thumbnailObject = new Image();
            thumbnailObject.src = tmpCanvas.toDataURL();
            return thumbnailObject.src;
        }

        function showThumbnail() {

            if (!!!dictionaryKeyframeImage[kfvSegmentUrl]) {
                thumbnailImage.src = keyframeToImage();

                dictionaryKeyframeImage[kfvSegmentUrl] = thumbnailImage.src;
            } else {
                thumbnailImage.src = dictionaryKeyframeImage[kfvSegmentUrl];
                ////console.log("using cached keyframe thumbnail");
            }

            thumbnailImage.style.visibility = "visible";
            videoElement.style.display = "none";
        }

        function saveThumbnail() {
            //playbackEnd = performance.now();
            //document.getElementById("result").events_textarea.value += "PlaybackTime:" + (playbackEnd - playbackStart) + "\n";



            //convert to image via canvas and put into image element
            //var tmpCanvas = document.createElement("canvas");
            //tmpCanvas.width = 200;
            //tmpCanvas.height = 150;
            //tmpCanvas.getContext("2d").drawImage(videoElement, 0, 0, 200, 90);

            ////m_frameTime[currentIndex] = frameStart;
            //thumbnailObject = new Image();
            //thumbnailObject.src = tmpCanvas.toDataURL();
            //thumbnailImage.src = thumbnailObject.src;
            //thumbnailImage.style.visibility = "visible";







            //canvasDownloaded[currentIndex] = true;
            //document.getElementById("result").events_textarea.value += "save canvas: " + currentIndex + " frame time: " + frameStart + "\n";
            /* display each frame thumbnail
            var container = document.getElementById ("container");
            container.appendChild (m_images[currentIndex]);
            */
            //if ((fDraw) && (currentIndex == thumbnailRequest)) {
            //    //thumbnail.drawImage(m_canvas[currentIndex], 0, 0, 400, 300);
            //    //thumbnailImg.src = m_images[currentIndex].src;
            //    //m_canvas[currentIndex].style.display = true;
            //    fDraw = false;
            //    displayThumbnail(currentIndex);
            //}
            //if (!fFinished) {
            //    checkAndDownloadThumbnails();
            //}
        }

        //***************************************

    });
})();