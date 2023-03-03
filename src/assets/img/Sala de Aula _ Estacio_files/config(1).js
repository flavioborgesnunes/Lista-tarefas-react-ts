const LIBS_PATH = "https://stensineme.blob.core.windows.net/assets";
const CDN_PATH = "https://stensineme.blob.core.windows.net/designsystem/cdn";
const CPN_PATH = "/webcomponents/web-components";
let cont = 0;
const printVersion = location.hash === '#imprimir';

const template_doktor = document.querySelector('body')?.classList.contains('template-doktor');

let htmlTag = document.querySelector('html');
let htmlLanguage = htmlTag.getAttribute('lang');
const printVersionDoktor = htmlTag.getAttribute('print') === 'print-doktor';

let pageReady = false; // Avisa quando o conteudo já foi mostrado

// Customização do MathJax 3.2.1
MathJax = { loader: { load: ["ui/lazy"] }, tex: { inlineMath: [["$$$", "$$$"], ["\\(", "\\)"]] }, svg: { fontCache: "global" }, mml: { parseAs: "xml" }, startup: { ready() { MathJax.startup.extendHandler(t => { const { HTMLAdaptor: a } = MathJax._.adaptors.HTMLAdaptor; return a.prototype.body = function (t) { return t.body || t }, t.documentClass = class extends t.documentClass { constructor(...t) { super(...t), this.lazyObserver = new IntersectionObserver(this.lazyObserve.bind(this), { rootMargin: "720px" }) } }, t }, 100), MathJax.startup.defaultReady() } } };

if (typeof scripts !== 'undefined') {
  importYduqsMathJaxFixBox()
  importYduqsMathJax();
}

/* addLoader(); */

window.addEventListener('load', () => {
  numberPages()
  lazyLoading()
  importPrincipal()
  cleanCode()
  audioPreload()
  // rescanMath()
  /* loadingScreen() */
  YduqsVerificaAltoContraste()
})

//Versão de impressão tema Doktor
if (printVersionDoktor) {
  loadPrintVersion();
}

// Numerador de páginas

function numberPages() {
  let p = $('.auto-pager');
  p.each(function (i) {
    let m = $(this).closest('module').attr('id');
    if (m == 'apresentacao') {
      $(this).attr('data-module', 'introducao')
    } else if (m == 'modulo1') {
      $(this).attr('data-module', '1')
    } else if (m == 'modulo2') {
      $(this).attr('data-module', '2')
    } else if (m == 'modulo3') {
      $(this).attr('data-module', '3')
    } else if (m == 'modulo4') {
      $(this).attr('data-module', '4')
    } else if (m == 'modulo5') {
      $(this).attr('data-module', '5')
    }
    $(this).attr('data-page', i);
    $(this).find("c-cover").length > 0 && ($(this).attr("data-module", "introducao"), $(this).attr("data-page", "0")),
      $(this).find("module#conclusao").length > 0 && $(this).attr("data-module", "conclusao"),
      $(this).find('yduqs-module-video[title_gallery*="Vem que eu te explico"]').length > 0 && $(this).attr("data-label", "teexplico"),
      $(this).find("yduqs-questions").length > 0 && $(this).attr("data-label", "atividade"),
      $(this).closest("header").find("yduqs-cover").length > 0 && ($(this).attr("data-module", "introducao"), $(this).attr("data-page", 1)),
      $(this).closest("footer").length > 0 && $(this).attr("data-page", i - 1),
      $(this).closest("module#apresentacao").length > 0 && $(this).attr("data-module", "apresentacao");
    if ($(this).closest("footer").find("yduqs-footer").length > 0) {
      let t = $(this).closest("yduqs-footer").attr("data-page");
      $(this).attr("data-page", t);
    }
  });
}

// Realiza adição de classe no modal infograficos para auxilio na impressão.
if(template_doktor){
  document.querySelectorAll('#infograficos-modais yduqs-image').forEach( e => {
    console.log(e)
    e.classList.add('infograficos-print')
  })
}

// Lazyloading Bruteforce - Start
let imgs = document.querySelectorAll("img");
let img_count = imgs.length;

imgs.forEach(img => {
  let img_src = img.getAttribute('src')

  has_lazy = img.hasAttribute('loading');

  if (has_lazy == false) {
    img.removeAttribute('src')
    img.setAttribute('data-src', img_src)
  }
})

function lazyLoading() {
  document.querySelectorAll("img").forEach(img => {
    has_data_src = img.hasAttribute('data-src')

    if (has_data_src == true) {
      let img_src = img.getAttribute('data-src')
      img.removeAttribute('data-src')
      img.setAttribute('loading', 'lazy')
      img.setAttribute('src', img_src)
    } else {
      let img_src = img.getAttribute('src')
      img.removeAttribute('src')
      img.setAttribute('data-src', img_src)
      img.setAttribute('loading', 'lazy')
      img.setAttribute('src', img_src)
      img.removeAttribute('data-src')
    }
  })
}
// Lazyloading Bruteforce - End

// Pseudo-lazyloading para audios
function audioPreload() {
  document.querySelectorAll("audio").forEach(audio => {
    audio.setAttribute('preload', 'metadata')
  })
  if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i)) {
    document.querySelectorAll("audio").forEach(audio => {
      audio.removeAttribute('preload')
    })
  }
}

// Loader
function addLoader() {
  let bodyTag = document.querySelector('body')
  var loader = document.createElement("yduqs-loader");
  let indexHeader = document.querySelector('header');
  let indexMain = document.querySelector('main');
  let indexFooter = document.querySelector('footer');

  indexHeader.style.transition = 'opacity 2000ms ease-in-out';
  indexMain.style.transition = 'opacity 2000ms ease-in-out';
  indexFooter.style.transition = 'opacity 2000ms ease-in-out';

  bodyTag.prepend(loader);
}

function loadingScreen() {
  var fadeTarget = document.getElementsByTagName("yduqs-loader");
  var fadeEffect = setInterval(function () {
    if (!fadeTarget.style.opacity) {
      fadeTarget.style.opacity = 1;
    }
    if (fadeTarget.style.opacity > 0) {
      fadeTarget.style.opacity -= 0.1;
    } else {
      clearInterval(fadeEffect);
    }
  }, 200);
  fadeTarget.remove();
}

function showContent() {
  pageReady = true;
  document.body.style.opacity = '1';
}

function cleanCode() {
  document.body.removeAttribute('style');
}

// Load CSS Stylesheet
function loadStyleSheet(src) {
  if (document.createStyleSheet) {
    document.createStyleSheet(src);
  }
  else {
    $("head").append($("<link rel='stylesheet' href='" + src + " />"));
  }
};

//Inicio Config Functions
async function importPrincipal() {
  if (printVersion) {
    await loadPrintVersion();
  } else {
    importOthers();
  }
}

function reduceCont() {
  cont--
}

function importLib(script, path, attrs) {
  let lib

  if (script) {
    lib = document.createElement('script')
    lib.setAttribute('type', 'text/javascript')
    lib.setAttribute('src', path)
  } else {
    lib = document.createElement('link')
    lib.setAttribute('rel', 'stylesheet')
    lib.setAttribute('href', path)
  }

  if (attrs) {
    for (let i in attrs) {
      lib.setAttribute(attrs[i][0], attrs[i][1])
    }
  }

  document.querySelector('head').appendChild(lib)

  return lib
}

function importLibLast(script, path, attrs) {
  let lib

  if (script) {
    lib = document.createElement('script')
    lib.setAttribute('type', 'text/javascript')
    lib.setAttribute('src', path)

  } else {
    lib = document.createElement('link')
    lib.setAttribute('rel', 'stylesheet')
    lib.setAttribute('href', path)
  }

  if (attrs) {
    for (let i in attrs) {
      lib.setAttribute(attrs[i][0], attrs[i][1])
    }
  }

  document.querySelector('body').appendChild(lib)

  return lib
}



function importSecondLib(script, path, attrs) {
  cont++

  importLib(script, path, attrs).onload = reduceCont
}


function importSecondLibLast(script, path, attrs) {
  cont++

  importLibLast(script, path, attrs).onload = reduceCont
}
//Fim Inicio Config Functions


function importOthers() {
  let imports = false

  if (typeof scripts !== 'undefined') {
    // importYduqsMenu()
    importYduqsModal()
    importYduqsProgress()
    importYduqsRating()
    importYduqsBeforeAfter()
    /* importYduqsPlaylistVideo() */
    // importYduqsModuleVideo()
    importYduqsCheckout()
    imports = true

  }

  if (typeof styles !== 'undefined') {
    imports = true
  }

  showContent()
  // importSecondLib(true, `${LIBS_PATH}/js/module.js`)
}


// Ajusta fórmulas fora do caixa fórmula
function importYduqsMathJaxFixBox() {
  if (scripts.yduqs_mathjax_fixbox) {
    importSecondLib(true, `${LIBS_PATH}/js/yduqs_mathjax_fixbox.min.js`)
  }
}

//Inicio Functions Import JS

function importYduqsMenu() {
  importSecondLib(true, `${LIBS_PATH}/js/yduqs_menu.min.js`)
}

async function importYduqsProgress() {
  if (scripts.yduqs_progress) {
    importSecondLib(true, `${LIBS_PATH}/js/yduqs_progress.min.js`)
  }
}

async function importYduqsRating() {
  if (scripts.yduqs_rating) {
    importSecondLibLast(true, `${LIBS_PATH}/js/yduqs_rating.min.js`)
  }
}

function importYduqsCheckout() {
  if (scripts.yduqs_checkout) {
    importLibLast(true, `${LIBS_PATH}/js/yduqs_checkout.min.js`)
  }
}

function importYduqsModal() {
  if (scripts.yduqs_modal) {
    importSecondLib(true, `${LIBS_PATH}/js/yduqs_modal.min.js`)
  }
}

function importYduqsBeforeAfter() {
  if (scripts.yduqs_before_after) {
    importSecondLib(true, `${LIBS_PATH}/js/yduqs_before_after.min.js`)
  }
}

async function importYduqsMathJax(toPrint) {
  if (toPrint) {
    importSecondLib(true, `https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML`)
  } else {

    if (scripts.yduqs_mathjax_svg) {
      checkMathJax('svg', false)
    } else if (scripts.yduqs_mathjax) {
      checkMathJax('html', true)
    } else if (scripts.yduqs_mathjax_html) {
      checkMathJax('html', true)
    } else if (scripts.yduqs_mathjax_mml) {
      checkMathJax('html', false)
    }
  }
}

async function checkMathJax(type, full) {
  if (type === 'svg') {
    /* window['mathJaxUrl'] = 'tex-mml-svg.js'; */
    window['mathJaxUrl'] = 'tex-mml-chtml.js';
  } else if (type === 'html' && full === true) {
    window['mathJaxUrl'] = 'tex-chtml-full.js';
  } else if (type === 'html' && full === false) {
    window['mathJaxUrl'] = 'tex-mml-chtml.js';
  }
  const scriptTag = document.createElement('script');
  scriptTag.id = "MathJax-script";
  scriptTag.src = `${LIBS_PATH}/js/mathjax/es5/${window['mathJaxUrl']}`;
  scriptTag.async = true;
  document.head.appendChild(scriptTag);
}

const mathTimer = setInterval(waitForMath, 250);

function waitForMath(reloadElementMath) {
  try {
    MathJax.typeset(reloadElementMath);
    if (pageReady) {
      clearInterval(mathTimer);
    }
  } catch (e) {
    e;
  }
}


function rescanMath(reloadElementMath) {
  setInterval(waitForMath(reloadElementMath), 250);
}

//Fim Functions Import JS

/* function importYduqsPlaylistVideo() {
    if (scripts.yduqs_playlist_video) {
        importSecondLib(true, `${LIBS_PATH}/js/yduqs_playlist_video.min.js`)
    }
} */

function importYduqsModuleVideo() {
  if (scripts.yduqs_module_video) {
    importSecondLib(true, `${LIBS_PATH}/js/yduqs_module_video.min.js`)
  }
}


function importCheckout() {
  if (scripts.yduqs_checkout) {
    importSecondLibLast(true, `${LIBS_PATH}/js/yduqs_checkout.min.js`)
  }
}



const removePrintWrapper = () => {
  let printWrapper = document.querySelector('div#printWrapper');
  printWrapper.remove();
}

const CriaPDF = () => {
  var _URL = document.URL;
  var _URL_ROOT = _URL.split('#')[0];
  var url = _URL_ROOT + '#imprimir';
  window.open(url, '_blank', 'height=900,width=900', false);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadPrintVersion() {
  await sleep(3000);
  await importOthersPrintVersion();
  await sleep(3000);
  showContent();
  await sleep(3000);
  window.print();
}

function importOthersPrintVersion() {
  YduqsSectionPrint();
  YduqsImgPrint();
  YduqsMenuPrint();
  YduqsCoverPrint();
  YduqsCoverModulePrint();
  YduqsCardModulePrint();
  YduqsAccordionPanePrint();
  YduqsCollapseContentPrint();
  YduqsCarouselPrint();
  YduqsTabsPrint();
  YduqsBeforeAfterPrint();
  YduqsCodeSnipetPrint();
  YduqsModalPrint();
  YduqsVideoPlayerPrint();
  YduqsAudioPlayerPrint();
  YduqsCardHorizontalPrint();
  YduqsQuestionsPrint();
  YduqsCardDestaquePrint();
  YduqsModuleVideoPrint();
  YduqsModuleRating();
  YduqsFooterPDFButton();
  YduqsTitle();
  YduqsCard();
  YduqsAtividadeDiscursivaPrint();
}

function YduqsSectionPrint() {
  document.querySelectorAll('yduqs-section').forEach(element => {
    element.style.margin = "0px";
  });
}

function YduqsImgPrint() {
  document.querySelectorAll('yduqs-image').forEach(element => {
    element.setAttribute('covered', false);
  });

  document.querySelectorAll('img').forEach(element => {
    if(!element.closest(".infograficos-print")){
      element.style.height = "200px";
      element.style.width = "auto";
    }
  });
}

function YduqsMenuPrint() {
  document.querySelector('#menu')?.remove();
}

function YduqsCoverPrint() {
  var cover = document.querySelector('yduqs-cover');
  if (cover != null) {
    var childs = document.querySelector('.theme-definition');
    childs.classList.remove('theme-definition');

    var cover_background = cover.getAttribute("background_img");
    var cover_title = cover.getAttribute("title_cover");
    var cover_teacher = cover.getAttribute("teacher");
    var contributors = cover.getAttribute("contributors")

    var div = document.createElement('div');
    div.classList.add('container');

    var img = document.createElement('img');
    img.setAttribute('src', cover_background);
    img.setAttribute('width', 'auto');
    img.setAttribute('height', '400');

    var h1 = document.createElement('h1');
    h1.innerHTML = cover_title;

    var h3 = document.createElement('h3');
    h3.innerHTML = cover_teacher;

    var h4 = document.createElement('h4');
    h4.innerHTML = contributors;

    div.append(img);
    div.append(h1);
    div.append(h3);
    div.append(h4);
    div.append(childs);

    cover.insertAdjacentHTML('beforebegin', div.outerHTML);

    cover.remove();
  }
}

function YduqsCoverModulePrint() {
  document.querySelectorAll('yduqs-module-cover').forEach(element => {
    var number_module = element.getAttribute("number_module");
    var title_module = element.getAttribute("title_module");
    var objective = element.getAttribute("objective");
    var img_cover = element.getAttribute("img_cover");

    var div = document.createElement('div');
    div.classList.add('container');

    var img = document.createElement('img');
    img.setAttribute('src', img_cover);
    img.setAttribute('width', 'auto');
    img.setAttribute('height', '400');

    var h1 = document.createElement('h1');
    h1.innerHTML = number_module + ' - ' + title_module;

    var h3 = document.createElement('h3');
    h3.innerHTML = objective;

    div.append(img);
    div.append(h1);
    div.append(h3);

    element.insertAdjacentHTML('beforebegin', div.outerHTML);

    element.remove();
  });
}

function YduqsCardModulePrint() {
  document.querySelectorAll('yduqs-card-modulo').forEach(element => {
    element.querySelectorAll('yduqs-card-modulo-footer').forEach(e => {
      e.remove()
    });

    element.querySelectorAll('.c-card-modulo__progress').forEach(f => {
      f.remove()
    });

    var header = element.querySelector('.c-card-modulo__header');
    var body = element.querySelector('.c-card-modulo__body');

    header.classList.remove('c-card-modulo__header');
    body.classList.remove('c-card-modulo__body');

    element.classList.remove('c-card-modulo');

    var pai = element.parentElement;
    pai.style.border = '2px solid var(--colors-default-neutral-20)';
    pai.style.borderRadius = '4px';
    pai.style.padding = '20px';
  });
}

function YduqsAccordionPanePrint() {
  document.querySelectorAll('yduqs-accordion-pane').forEach(element => {
    element.querySelectorAll('.c-accordion__control').forEach(e => {
      e.setAttribute('aria-expanded', 'true')
    });
  });
}

function YduqsCollapseContentPrint() {
  document.querySelectorAll('yduqs-collapse').forEach(element => {

    element.querySelectorAll('.c-collapse').forEach(e => {
      e.classList.add('c-collapse--active');
    });

    element.querySelectorAll('.c-collapse__control').forEach(f => {
      f.setAttribute('aria-expanded', 'true')
    });
  });
}

function YduqsCarouselPrint() {
  document.querySelectorAll('yduqs-carousel').forEach(element => {

    var div = document.createElement('div');
    div.classList.add('container');

    element.querySelectorAll('yduqs-carousel-item').forEach(e => {
      try {
        var yduqs_image = e.querySelector('yduqs-image');
        if (yduqs_image !== null) {
          var image = e.querySelector('img');
          image.remove();
        }
      } catch { }

      div.append(e);
    });

    element.insertAdjacentHTML('beforebegin', div.outerHTML);

    element.classList.add('d-none');

  });
}

function YduqsTabsPrint() {
  document.querySelectorAll('yduqs-tabs').forEach(element => {

    var div = document.createElement('div');
    div.classList.add('container');

    element.querySelectorAll('yduqs-tab').forEach(e => {
      var divTab = document.createElement('div');
      var h3 = document.createElement('h3');
      var title = e.getAttribute('header');
      var contentTab = e.querySelector('.c-tabs__tab');
      contentTab.removeAttribute('hidden');

      try {
        var imgTab = contentTab.querySelector('img');
        imgTab.remove();
      } catch { }

      h3.append(title)
      divTab.append(h3);
      divTab.append(contentTab);
      div.append(divTab);
    });

    element.insertAdjacentHTML('beforebegin', div.outerHTML);
    element.remove();

  });
}

function YduqsBeforeAfterPrint() {
  document.querySelectorAll('yduqs-before-after').forEach(element => {

    var before_img = element.getAttribute('before_img');
    var before_img_alt = element.getAttribute('before_img_alt');
    var before_img_title = element.getAttribute('before_img_title');

    var after_img = element.getAttribute('after_img');
    var after_img_alt = element.getAttribute('after_img_alt');
    var after_img_title = element.getAttribute('after_img_title');

    var caption = element.getAttribute('caption');

    var div = document.createElement('div');
    div.classList.add('container');

    var divBefore = document.createElement('div');
    var imgBefore = document.createElement('img');
    imgBefore.setAttribute('src', before_img);
    imgBefore.setAttribute('width', '400');
    imgBefore.setAttribute('height', 'auto');
    var pBeforeTitle = document.createElement('p');
    pBeforeTitle.innerHTML = before_img_title
    var pBeforeAlt = document.createElement('p');
    pBeforeAlt.innerHTML = before_img_alt;

    divBefore.append(imgBefore);
    divBefore.append(pBeforeTitle);
    divBefore.append(pBeforeAlt);


    var divAfter = document.createElement('div');
    var imgAfter = document.createElement('img');
    imgAfter.setAttribute('src', after_img);
    imgAfter.setAttribute('width', '400');
    imgAfter.setAttribute('height', 'auto')
    var pAfterTitle = document.createElement('p');
    pAfterTitle.innerHTML = after_img_title;
    var pAfterAlt = document.createElement('p');
    pAfterAlt.innerHTML = after_img_alt;

    divAfter.append(imgAfter);
    divAfter.append(pAfterTitle);
    divAfter.append(pAfterAlt);

    var pCaption = document.createElement('p');
    pCaption.innerHTML = caption;

    div.append(divBefore);
    div.append(divAfter);
    div.append(pCaption);

    element.insertAdjacentHTML('beforebegin', div.outerHTML);

    element.remove();
  });

}

function YduqsCodeSnipetPrint() {
  document.querySelectorAll('yduqs-code-snipet').forEach(element => {
    var top = element.querySelector('.codigo-top');
    if (top) {
      top.style.border = "2px solid  var(--color-default)";
    }
    var body = element.querySelector('.codigo-body');
    if (body) {  
      body.style.border = "2px solid  var(--color-default)";
    }
  });
}

function YduqsModalPrint() {
  document.querySelectorAll('yduqs-modal').forEach(element => {
    var modal__wrapper = element.querySelector('.c-modal__wrapper');
    modal__wrapper.classList.add('container');
    modal__wrapper.classList.remove('c-modal__wrapper');

    var modal__overlay = element.querySelector('.c-modal__overlay');
    modal__overlay.classList.remove('c-modal__overlay');

    var modal = element.querySelector('.c-modal');
    modal.classList.add('row', 'align-items-center', 'justify-content-center');
    modal.classList.remove('c-modal');

    var modal__header = element.querySelector('.c-modal__header');
    modal__header.classList.add('col-md-10');
    modal__header.style.display = "none";

    var modal__body = element.querySelector('.c-modal__body');
    modal__body.classList.add('col-md-10');
    modal__body.style.overflow = "hidden";
    modal__body.style.padding = "0px";
  });
}

function YduqsVideoPlayerPrint() {
  document.querySelectorAll('yduqs-video-player').forEach(element => {
    var img = document.createElement('img');
    img.setAttribute('src', 'https://stensineme.blob.core.windows.net/assets/img/video_print_image.png');
    img.setAttribute('width', '400');
    img.setAttribute('height', 'auto');

    element.insertAdjacentHTML('beforebegin', img.outerHTML);

    element.remove();
  });
}

function YduqsAudioPlayerPrint() {
  document.querySelectorAll('yduqs-audio-player').forEach(element => {
    var img = document.createElement('img');
    img.setAttribute('src', 'https://stensineme.blob.core.windows.net/assets/img/audio_print_image.jpg');
    img.setAttribute('width', '400');
    img.setAttribute('height', 'auto');

    element.insertAdjacentHTML('beforebegin', img.outerHTML);

    element.remove();
  });
}

function YduqsCardHorizontalPrint() {
  document.querySelectorAll('yduqs-card-horizontal').forEach(element => {
    var card_header = element.querySelector('.card-header-text');
    card_header.classList.remove('card-header-text');

    element.insertAdjacentHTML('beforebegin', card_header.outerHTML);

    element.remove();
  });
}

function YduqsQuestionsPrint() {
  var letters = ['a', 'b', 'c', 'd', 'e'];

  document.querySelectorAll('yduqs-questions').forEach(element => {
    element.querySelectorAll('.row').forEach(e => {
      e.classList.remove('row');
    })

    element.querySelectorAll('button').forEach(f => {
      f.style.border = 'none';
    })

    element.querySelectorAll('.question-button').forEach(g => {
      g.classList.add('d-none');
    })

    element.querySelectorAll('.question-positive-feedback').forEach(h => {

      var correct_answer = h.parentElement.querySelector('yduqs-card-selecionavel').getAttribute('correct-answer');

      var h2 = document.createElement('h2');
      h2.classList.add('c-heading');
      h2.classList.add('u-large');
      h2.innerHTML = 'Parabéns! A alternativa <span class="text-uppercase">' + letters[correct_answer - 1] + '</span> está correta.';

      h.classList.remove('d-none');
      h.classList.remove('question-positive-feedback');
      h.insertAdjacentHTML('afterbegin', h2.outerHTML);

    })

    element.querySelectorAll('.c-card-selecionavel__item').forEach(i => {
      i.style.margin = '0px';
      i.classList.add('p-2');
    })

    element.querySelectorAll('.c-card-selecionavel__control').forEach(k => {
      var button = k.innerHTML;

      var div = document.createElement('div');
      div.innerHTML = button;
      div.classList.add('c-card-selecionavel__control');
      div.style.border = 'none';

      k.insertAdjacentHTML('beforebegin', div.outerHTML);

      k.remove()
    })
  });
}

function YduqsCardDestaquePrint() {
  document.querySelectorAll('yduqs-card-destaque').forEach(element => {
    element.classList.remove('c-card-destaque', 'c-card-destaque--grade-icon-2');

    var icon = element.querySelector('.c-card-destaque__icon-container');
    icon.style.display = "none";

    var container = element.querySelector('.c-card-destaque__container');
    container.style.border = "none";

    var destaque__header = element.querySelector('.c-card-destaque__header');
    destaque__header.style.padding = "0px";

    var destaque__body = element.querySelector('.c-card-destaque__body');
    destaque__body.style.padding = "0px";
  });
}

function YduqsCard() {
  document.querySelectorAll('yduqs-card').forEach(element => {
    element.classList.remove('c-card', 'card1');
  });
}

function YduqsModuleVideoPrint() {
  document.querySelectorAll('yduqs-module-video').forEach(element => {
    element.remove();
  });
}

function YduqsModuleRating() {
  document.querySelectorAll('yduqs-module-rating', 'yduqs-rating').forEach(element => {
    element.remove();
  });
}

function YduqsFooterPDFButton() {
  document.querySelectorAll('.c-footer-border').forEach(element => {
    element.remove();
  });
}

function YduqsTitle() {
  document.querySelectorAll('yduqs-title .title-bar').forEach(element => {
    element.parentElement.remove('d-none');
  });
}

function YduqsAtividadeDiscursivaPrint() {
  document.querySelectorAll('yduqs-atividade-discursiva .c-textarea .feedbackInvisible > div').forEach(element => {
    element.style.opacity = "1";
    element.style.height = "100%";
    element.style.display = "block";
    element.style.padding = "20px";
  });
}

function YduqsVerificaAltoContraste() {
  const isHighContrast = location.search.indexOf("high-contrast=true") >= 0;

  if (isHighContrast) {
    const link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";

    link.href =`${CDN_PATH}/themes/high-contrast.css`;
    document.head.appendChild(link);

    document.querySelector("body").classList.add("high-contrast");

    /** OVERRIDES **/
    // Card
    const components = document.querySelectorAll(
      "yduqs-card, yduqs-card-destaque, yduqs-card-comparativo, yduqs-code-snipet, yduqs-code-compiler, yduqs-quote"
    );

    components.forEach((component) => {
      if (
        ["YDUQS-CODE-COMPILER", "YDUQS-CODE-SNIPET"].includes(component.tagName)
      ) {
        component.setAttribute("dark", "true");

        setTimeout(() => {
          const buttons = component.querySelectorAll(".c-button--dark");
          buttons.forEach((btn) => {
            btn.classList.remove("c-button--dark");
          });
        }, 1000);
      } else {
        component.setAttribute("dark", "false");

        if (["YDUQS-CARD-DESTAQUE"].includes(component.tagName)) {
          component.setAttribute("grade", "2");
        }
      }
    });

    setTimeout(() => {
      const teorias = document.querySelectorAll(
        "yduqs-collapse-teoria-content"
      );

      teorias.forEach((cp) => {
        cp.removeAttribute("teoria");
      });
    }, 1000);
  }
}