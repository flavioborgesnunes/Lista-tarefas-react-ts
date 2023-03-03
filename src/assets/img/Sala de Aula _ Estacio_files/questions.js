// Inicializa o menu a partir do html

window.addEventListener('DOMContentLoaded', function() {

    // Questões do Módulo 01
    var question1 = {
        "questions": [{
                "question_title": `
                <h3 class="c-heading">Questão 1</h3>
                  <p class="c-paragraph">Na engenharia de software, definimos o acoplamento como o nível de dependência encontrada entre os diversos elementos de um sistema. Quanto maior for o acoplamento em um sistema, maior será a dificuldade de manutenção. Qualquer plataforma de desenvolvimento atual busca meios para diminuir o acoplamento nos sistemas; no Angular, o baixo acoplamento dos serviços é garantido por meio de uma técnica específica. Qual é o nome da técnica utilizada?</p>
                `,
                "options": [
                    `<p class='c-paragraph'>Modularização.</p>`,
                    `<p class='c-paragraph'>Injeção de dependências.</p>`,
                    `<p class='c-paragraph'>Uso de seletores.</p>`,
                    `<p class='c-paragraph'>Vinculação de dados.</p>`,
                    `<p class='c-paragraph'>Herança de classes.</p>`
                ],
                "correct_anwser": 2,
                "positive_feedback": `
                  <p class='c-paragraph'>No framework Angular, os serviços são utilizados pelos componentes a partir da injeção de dependências no construtor da classe do componente, o que garante um modelo de utilização com baixo acoplamento. Em relação às demais opções, os seletores são os elementos empregados para a utilização dos componentes nos modelos HTML. Já a vinculação de dados (data binding) faz a ligação de valores do modelo com a classe do componente, enquanto a herança se trata de uma característica da orientação a objetos que aumenta o acoplamento. Por fim, a modularização se refere à forma como os componentes e os serviços são agrupados.</p>
                `,
                "negative_feedback_topic": "<span>Conceitos da arquitetura</span>",
                "negative_feedback_link": "#m1q1"
            },
            {
                "question_title": `
                <h3 class="c-heading">Questão 2</h3>
                  <p class="c-paragraph">Atualmente, existem meios para a definição de rotas de acesso aos recursos do sistema em diversas tecnologias de desenvolvimento tanto no front-end quanto no back-end – e isso não seria diferente no caso do Angular. Adotando-se o modelo de rotas, há um maior controle sobre a utilização dos recursos. Isso permite que a autenticação e a autorização sejam efetuadas de forma simples, já que ocorre um modo de acesso centralizado. Na estrutura do Angular, qual elemento é responsável pela exibição do conteúdo roteado?</p>
                `,
                "options": [
                    `<p class='c-paragraph'>routerLink</p>`,
                    `<p class='c-paragraph'>Routes</p>`,
                    `<p class='c-paragraph'>ActivatedRoute</p>`,
                    `<p class='c-paragraph'>Router</p>`,
                    `<p class='c-paragraph'>router-outlet</p>`
                ],
                "correct_anwser": 5,
                "positive_feedback": `
                  <p class='c-paragraph'>No modelo de roteamento do Angular, que é definido no módulo RouterModule, há um objeto que efetua o redirecionamento (instância da classe Router) e configuram-se as rotas disponíveis em uma coleção do tipo Routes. Os links que utilizam o atributo navLink acessam as rotas por meio do roteador e direcionam o conteúdo roteado até a área especificada pelo seletor router-outlet, o qual, por sua vez, é responsável pela exibição. Podemos ainda transmitir valores pela rota, e eles são capturados na classe do componente a partir de ActivateRoute (ou rota ativa), que deve ser injetado no construtor e utilizado no método ngOnInit.</p>
                `,
                "negative_feedback_topic": "<span>Projeto SegundoApp</span>",
                "negative_feedback_link": "#m1q2"
            }
        ]
    }
    const activity1 = document.querySelector('yduqs-questions[question_id="1"]');
    activity1 && (activity1.settings = question1);

    // Questões do Módulo 02
    var question2 = {
        "questions": [{
                "question_title": `
                <h3 class="c-heading">Questão 1</h3>
                  <p class="c-paragraph">Não são raras as situações em que uma página precisa receber parâmetros para sua exibição, como, por exemplo, no uso de parâmetros em uma requisição HTTP ou como parte do endereço de acesso. Em termos da sintaxe HTML, os parâmetros de configuração de um elemento são fornecidos por meio de seus atributos. O Angular permite a mesma abordagem no uso de seletores, mantendo o modelo de construção padrão do HTML. Qual anotação deve ser utilizada em um campo da classe TypeScript para que ele seja alimentado por um atributo do seletor?</p>
                `,
                "options": [
                    `<p class='c-paragraph'>Input</p>`,
                    `<p class='c-paragraph'>Component</p>`,
                    `<p class='c-paragraph'>Output</p>`,
                    `<p class='c-paragraph'> Injectable</p>`,
                    `<p class='c-paragraph'>NgModule</p>`
                ],
                "correct_anwser": 1,
                "positive_feedback": `
                  <p class='c-paragraph'>Adicionando a anotação (decoração) Input a um campo da classe TypeScript, as indicações de erro são eliminadas por não se inicializar a variável, e o valor passa a ser fornecido por meio de um atributo do seletor. O fluxo de dados inverso, ou seja, da classe para o modelo, seria viabilizado pela anotação Output, como no caso dos emissores de eventos. As demais opções são anotações estruturais utilizadas para a definição de módulos (NgModule), componentes do Angular (Component) e serviços (Injectable).</p>
                `,
                "negative_feedback_topic": "<span>Projeto TerceiroApp</span>",
                "negative_feedback_link": "#m2q1"
            },
            {
                "question_title": `
                <h3 class="c-heading">Questão 2</h3>
                  <p class="c-paragraph">Um problema comum nas páginas HTML é a adoção de um modelo estático, o que exige muito esforço para sua modificação e poucas possibilidades em termos de comportamento dinâmico. No entanto, o framework Angular resolve esse problema por meio do uso de diretivas, que oferecem muito controle sobre o gerenciamento e a criação dos elementos HTML, como, por exemplo, a exibição de dados de uma coleção dinâmica cujos elementos podem variar para cada chamada efetuada. Qual será a diretiva correta para exibir os dados de uma coleção dinâmica?</p>
                `,
                "options": [
                    `<p class='c-paragraph'>ngIF</p>`,
                    `<p class='c-paragraph'>ngClass</p>`,
                    `<p class='c-paragraph'>ngStyle</p>`,
                    `<p class='c-paragraph'>ngFor</p>`,
                    `<p class='c-paragraph'>ngSwitch</p>`
                ],
                "correct_anwser": 4,
                "positive_feedback": `
                  <p class='c-paragraph'>A diretiva correta seria a ngFor, que deve receber uma expressão para percorrer a coleção com base na instrução for e no operador of do JavaScript, viabilizando o uso dos dados do iterador no preenchimento do conteúdo de um trecho HTML que se repete. Quanto às demais opções, ngIf condiciona o desenho do elemento HTML ao resultado de uma expressão lógica. Já ngSwitch alterna o elemento exibido com base no valor de uma variável. Por fim, as diretivas ngClass e ngStyle são voltadas para o gerenciamento do CSS aplicado a um elemento.</p>
                `,
                "negative_feedback_topic": "<span>Diretivas e uso de serviços</span>",
                "negative_feedback_link": "#m2q2"
            }
        ]
    }

    const activity2 = document.querySelector('yduqs-questions[question_id="2"]');
    activity2 && (activity2.settings = question2);

    // Questões do Módulo 03
    var question3 = {
        "questions": [{
                "question_title": `
                <h3 class="c-heading">Questão 1</h3>
                  <p class="c-paragraph">Por meio do paradigma da programação reativa, há um modelo simples para o tratamento de elementos assíncronos com base no padrão Observer. Além disso, a biblioteca RxJS é responsável pela viabilização desse modelo de programação para o Angular. Por meio da biblioteca, temos acesso a um conjunto de componentes com papéis bem definidos na implementação de processos que devem ser tratados de forma assíncrona. Nesse contexto, qual componente representa a fonte de informações para o processamento assíncrono, sem haver a possibilidade de assinantes múltiplos?</p>
                `,
                "options": [
                    `<p class='c-paragraph'>Observer</p>`,
                    `<p class='c-paragraph'>Subject</p>`,
                    `<p class='c-paragraph'>Subscription</p>`,
                    `<p class='c-paragraph'>Observable</p>`,
                    `<p class='c-paragraph'>Operator</p>`
                ],
                "correct_anwser": 4,
                "positive_feedback": `
                  <p class='c-paragraph'>Entre os componentes oferecidos na biblioteca RxJS, o Observable funciona como fonte da informação a ser fornecida de forma assíncrona com um tratamento pontual. Se forem necessários múltiplos assinantes, será necessário utilizar Subject. Em ambos os casos, deve ocorrer a assinatura da fonte (Subscription) pelo observador (Observer), ficando o observador responsável pelo tratamento da informação recebida. Já os operadores (Operator) são os elementos fornecidos pela biblioteca para efetuar operações comuns por meio do paradigma funcional.</p>
                `,
                "negative_feedback_topic": "<span>Componentes RxJS</span>",
                "negative_feedback_link": "#m3q1"
            },
            {
                "question_title": `
                <h3 class="c-heading">Questão 2</h3>
                  <p class="c-paragraph">Quando trabalhamos em sistemas web, a responsabilidade sobre a persistência dos dados é da tecnologia servidora utilizada, havendo o fornecimento das informações necessárias por meio do protocolo HTTP e de seus diferentes métodos. Graças à inclusão de HttpClientModule, podemos efetuar a comunicação com o servidor de forma simples a partir do front-end criado em Angular, em que o objeto injetado, que é do tipo HttpClient, oferece os métodos necessários para atender a todos os modos de utilização do HTTP. Qual seria o método usado para solicitar a inclusão de um registro?</p>
                `,
                "options": [
                    `<p class='c-paragraph'> post</p>`,
                    `<p class='c-paragraph'>put</p>`,
                    `<p class='c-paragraph'>delete</p>`,
                    `<p class='c-paragraph'>get</p>`,
                    `<p class='c-paragraph'>head</p>`
                ],
                "correct_anwser": 1,
                "positive_feedback": `
                  <p class='c-paragraph'>Segundo o padrão mais comum a ser utilizado e definido pelos princípios do REST, uma inclusão de dados tem de ser efetuada pelo método post. Em geral, há uma chamada para o endereço via método post e a passagem dos dados no corpo da requisição. Quanto às demais opções, get é utilizado nas consultas; put, para efetuar alterações; delete, para a exclusão do registro; e head, para a obtenção de dados estruturais (metadados) acerca da fonte de informação.</p>
                `,
                "negative_feedback_topic": "<span>Acesso a recursos remotos: projeto TerceiroAppRx</span>",
                "negative_feedback_link": "#m3q2"
            }
        ]
    }

    const activity3 = document.querySelector('yduqs-questions[question_id="3"]');
    activity3 && (activity3.settings = question3);

    // Questões do Módulo 04
    var question4 = {
        "questions": [{
                "question_title": `
                <h3 class="c-heading">Questão 1</h3>
                <p class="c-paragraph">As tecnologias relacionais, que apresentam uma grande preocupação com a manutenção de relacionamentos entre as entidades, nem sempre oferecem resposta em tempo adequado para grandes massas de dados. Com o advento do Big Data, em que a quantidade de dados é expressiva, as opções ao armazenamento relacional passaram a ser utilizadas, popularizando os repositórios classificados como NoSQL, os quais, por terem uma grande heterogeneidade, são classificados em diferentes grupos de acordo com a forma adotada para representar a informação. Uma opção de banco muito utilizada atualmente é o MongoDB, que é classificado como uma base do tipo:</p>
              `,
                "options": [
                    `<p class='c-paragraph'>chave-valor.</p>`,
                    `<p class='c-paragraph'>colunar.</p>`,
                    `<p class='c-paragraph'>documental.</p>`,
                    `<p class='c-paragraph'>baseada em grafos.</p>`,
                    `<p class='c-paragraph'>relacional.</p>`
                ],
                "correct_anwser": 3,
                "positive_feedback": `
                <p class='c-paragraph'>A estrutura de armazenagem do MongoDB segue o modelo documental, em que os registros são documentos no formato JSON, havendo uma individualização a partir de um identificador padronizado, com o nome _id, que pode ser gerado automaticamente pelo banco. Quanto às demais opções, a chave-valor define um modelo em que existem chaves associadas a valores simples. Já a coluna é uma extensão do primeiro modelo, com a adição de versionamento e agrupamento de campos. Os modelos baseados em grafos, por sua vez, expressam ligações entre registros de forma gráfica. Por fim, no modelo relacional, há uma contraposição aos modelos NoSQL, com relacionamentos sendo mantidos de forma consistente e robusta.</p>
              `,
                "negative_feedback_topic": "<span>Inserção de documentos no MongoDB</span>",
                "negative_feedback_link": "#m4q1"
            },
            {
                "question_title": `
                <h3 class="c-heading">Questão 2</h3>
                <p class="c-paragraph">Com o surgimento do Material Design, é possível determinar um padrão para a criação de interfaces envolvendo diferentes plataformas, o que inclui preocupações com responsividade, usabilidade e acessibilidade. São especificados nele os melhores padrões de cores, fontes, dimensões e unidades de medida, além de haver o conceito visual de componentes padronizados, os quais, implementados nas diferentes plataformas, trazem homogeneidade para os sistemas. Para o Angular, seu uso é baseado na importação da biblioteca adequada e na aplicação de atributos nos componentes comuns do HTML, além de ocorrer por meio de um conjunto de seletores próprios. Por exemplo, um botão pode ser configurado para uma exibição elevada ao mesmo tempo que representa a opção negativa para uma pergunta, utilizando a seguinte configuração:</p>
              `,
                "options": [
                    `<p class='c-paragraph'>mat-raised-button color="warn"</p>`,
                    `<p class='c-paragraph'>mat-fab color="accent"</p>`,
                    `<p class='c-paragraph'>mat-button color="warn"</p>`,
                    `<p class='c-paragraph'>mat-raised-button color="primary"</p>`,
                    `<p class='c-paragraph'>mat-button color="accent"</p>`
                ],
                "correct_anwser": 1,
                "positive_feedback": `
                <p class='c-paragraph'>As opções mais comuns para a formatação do botão são: mat-button, em que há o formato comum, sem elevação; mat-raised-button, que inclui a elevação; e mat-fab, para uma apresentação como botão flutuante, normalmente circular, que representa uma ação principal. Já em relação ao esquema de cores, primary é a opção padrão. O accent seria usado para um destaque simples e warn (atenção), para uma opção que represente perigo. Considerando as definições apresentadas, a configuração correta seria mat-raised-button color="warn".</p>
              `,
                "negative_feedback_topic": "<span>Projeto TerceiroAppFinal</span>",
                "negative_feedback_link": "#m4q2"
            }
        ]
    }

    const activity4 = document.querySelector('yduqs-questions[question_id="4"]');
    activity4 && (activity4.settings = question4);

    // Mão na massa 01
    /* var exercises1 = {
        "questions": [{
            "question_title": `
                    <h3 class="c-heading">Questão 1</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 2</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 3</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 4</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 5</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 6</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        }
        ]
    }

    const exercise1 = document.querySelector('yduqs-questions[exercise_id="1"]');
    exercise1 && (exercise1.settings = exercises1); */

    // Mão na massa 02
    /* var exercises2 = {
        "questions": [{
            "question_title": `
                    <h3 class="c-heading">Questão 1</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 2</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 3</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 4</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 5</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 6</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        }
        ]
    }

    const exercise2 = document.querySelector('yduqs-questions[exercise_id="2"]');
    exercise2 && (exercise2.settings = exercises2); */

    // Mão na massa 03
    /* var exercises3 = {
        "questions": [{
            "question_title": `
                    <h3 class="c-heading">Questão 1</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 2</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 3</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 4</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 5</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 6</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        }
        ]
    }

    const exercise3 = document.querySelector('yduqs-questions[exercise_id="3"]');
    exercise3 && (exercise3.settings = exercises3); */

    // Mão na massa 04
    /* var exercises4 = {
        "questions": [{
            "question_title": `
                    <h3 class="c-heading">Questão 1</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 2</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 3</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 4</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 5</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        },
        {
            "question_title": `
                    <h3 class="c-heading">Questão 6</h3>
                  <p class="c-paragraph">LOREM_IPSUM</p>
                `,
            "options": [
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`,
                `<p class='c-paragraph'>LOREM_IPSUM</p>`
            ],
            "correct_anwser": 3,
            "positive_feedback": `
                  <p class='c-paragraph'>LOREM_IPSUM</p>
                `
        }
        ]
    }

    const exercise4 = document.querySelector('yduqs-questions[exercise_id="4"]');
    exercise4 && (exercise4.settings = exercises4); */

});