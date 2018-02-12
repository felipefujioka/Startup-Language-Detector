"use-strict";

var sl_words = [
    "objetivo",
    "fomentar",
    "engaja",
    "cresc",
    "disruptivo",
    "canalizar",
    "oportunidade",
    "mitigar",
    "compartilhar",
    "processo",
    "procedimento",
    "machine learning",
    "aprendizado de máquina",
    "goal",
    "startar",
    "stopar",
    "bootstrap",
    "gamefication",
    "investi",
    "alavanca",
    "match",
    "fit ",
    "market",
    "posiciona",
    "mobile",
    "place",
    "empodera",
    "build",
    "global",
    "drive",
    "risco",
    "carreira",
    "meritocra",
    "cultura",
    "integra",
    "inquiet",
    "rápid",
    "melhor",
    "líder",
    "lidera",
    "móve",
    "app",
    "web",
    "frontend",
    "backend",
    "fullstack",
    "sonho",
    "grande",
    "motiva",
    "descontra",
    "flexí",
    "dinâmi",
    "lean",
    "foco",
    "resulta",
    "todos os dias",
    "diariamente",
    "milhõ",
    "milhã",
    "bilhõ",
    "bilhã",
    "milhar",
    "centena",
    "meta",
    "produto",
    "escalável",
    "escalabilidade",
    "processo",
    "monetizar",
    "monetização",
    "desenvolver",
    "desenvolvimento",
    "usuários",
    "cliente",
    "serviço",
    "infraestrutura",
    "cloud",
    "sistema distribuído",
    "recomenda",
    "avalia",
    "aprendizado",
    "parceria",
    "aumento",
    "aumentar",
    "feature",
    "prazo",
    "rede social",
    "redes sociais",
    "ferramenta",
    "retem",
    "reter",
    "reten",
    "priorizar",
    "prioriza",
    "iniciativa",
    "eficiência",
    "performance",
    "performar",
    "business",
    "negócio",
    "validação",
    "hipótese",
    "inov",
    "capacitação",
    "profissiona",
    "gestão",
    "gerenciamento",
    "conhecimento",
    "empresa",
    "documentação",
    "projeto",
    "planeja",
    "organização",
    "técnico",
    "design",
    "sinergia",
    "vivência",
    "experiên",
    "colaborador",
    "pivota",
    "time",
    "timing",
    "talento",
    "",
    "alinha",
    "monitora",
    "indica",
    "proativ",
    "teste A/B",
    "branding",
    "produtiv",
    "bottom up",
    "top down",
    "freemium",
    "premium",
    "influenc",
    "mercado",
    "enxut",
    "missão",
    "visão",
    "valor",
    "UX"
];

ruleExistenceDict = {};
var sheet = (function() {
    var style = document.createElement("style");
    style.appendChild(document.createTextNode(""));	// WebKit hack @@
    document.head.appendChild(style);
    return style.sheet;
})();

console.log("Ran sl_detector_content.js 4");

var bgColorCode = "fff84e";

highlightRange = function(range, color) {
    // create wrapping i
    var iNode = document.createElement("i");
    var selectorName = iNode.className = "sl-detector-highlight-".concat(bgColorCode);
    iNode.classList.add("sl-detector-highlight");

    // add highlight class style in CSS
    if (!ruleExistenceDict[bgColorCode]) {
        sheet.insertRule([".", selectorName, " { background: #", bgColorCode, " !important; }"].join(""), 0);
        ruleExistenceDict[bgColorCode] = true;
        // console.log(sheet);
    }

    // range.surroundContents(iNode) will throw exception if word across multi tag
    iNode.appendChild(range.extractContents());
    range.insertNode(iNode);
}

var highlightWordInTextNodeOnly = function (word) {

    // skip empty word
    if (word == null || word.length === 0) return;

    // DOM tree walker
    var wordRegex = new RegExp(word, "gi");
    var treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
            var result = NodeFilter.FILTER_SKIP;
            if (wordRegex.test(node.nodeValue)) result = NodeFilter.FILTER_ACCEPT;
            return result;
        }
    }, false);

    // get textnode
    var skipTagName = {
        "NOSCRIPT": true,
        "SCRIPT": true,
        "STYLE": true
    };
    var nodeList = [];
    while(treeWalker.nextNode()) {
        if (!skipTagName[treeWalker.currentNode.parentNode.tagName]) {
            nodeList.push(treeWalker.currentNode);
        }
    }

    // highlight all filtered textnode
    nodeList.forEach(function (n) {
        var rangeList = [];

        // find sub-string ranges
        var startingIndex = 0;
        do {
            // console.log(word, startingIndex, n.parentNode, n.textContent);
            startingIndex = n.textContent.indexOf(word, startingIndex + 1);
            if (startingIndex !== -1) {
                var wordRange = document.createRange();
                wordRange.setStart(n, startingIndex);
                wordRange.setEnd(n, startingIndex + word.length);
                rangeList.push(wordRange);
            }
        } while (startingIndex !== -1);

        // highlight all ranges
        rangeList.forEach(function (r) {
            highlightRange(r, bgColorCode);
        });
    });
};

// TODO: find works in unnexpected ways in different browsers and it can lead to unpredicted results
var highlightNodes = function(word) {
    var rangeList = [];
    if (window.find(word, false, false, true, false, true, false)) {
        do {
            rangeList.push(window.getSelection().getRangeAt(0));
            console.log("found: " + word)
            // don't modify the range here, cursor in find() will be corrupted
        } while (window.find(word, false, false, false, false, true, false));
        // reset scroll position, window.find() will select the last word...
        window.scrollTo(0, 0);
    } 

    rangeList.forEach(function (r) {
        highlightRange(r, bgColorCode);
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("received message from button");
        window.getSelection().removeAllRanges();

        sl_words.forEach(word => {
            console.log("searching for: " + word);
            highlightWordInTextNodeOnly(word);
        });
        
    }
);