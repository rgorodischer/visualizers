$(document).ready(function() {
    _bindProblemSetSelectEvents();
    _generateProblemsList();
    _bindProblemSelectEvents();
});

function _loadDefaultProblemOnActiveTab() {
    var selectedProblem = $('div.tab-pane.active li.active a').filter(":visible");
    _loadProblemByLink(selectedProblem);
}

function _generateProblemsList() {
    var problemType = _getOpenProblemType();
    var indexPath = _getFullFilePath("index.json", problemType);
    _loadJsonFile(indexPath, function(problemsList) {
        var problemsContainer = $('div.tab-pane.active ul');
        $.each(problemsList, function(index, problem) {
            problemsContainer.append("<li><a href='#" + problem + "'>" + problem + "</a></li>")
        });
        $('li', problemsContainer).first().addClass('active');
        _loadDefaultProblemOnActiveTab();
    })
}

function _bindProblemSetSelectEvents() {
    $('#problemsets').on('shown', function() {
        if (!$('div.tab-pane.active ul li').size()) {
            _generateProblemsList();
        }
    });
}

function _bindProblemSelectEvents() {
    $('#tsp_tab, #vrp_tab, #wlp_tab').on('click', 'a', function() {
        _loadProblemByLink($(this))
    });
}

function _loadProblemByLink(link) {
    var fileName = _jsonFileNameFromLink(link);
    var problemType = _getOpenProblemType();
    var fullPath = _getFullFilePath(fileName, problemType);
    _loadJsonFile(fullPath, _selectVisualizer(fileName));
}

function _getOpenProblemType() {
    var problemTabId = $('div.tab-pane.active').attr('id');
    return problemTabId.startsWith('tsp') ? "tsp"
         : problemTabId.startsWith('vrp') ? "vrp"
         : problemTabId.startsWith('wlp') ? "wlp"
         : undefined;
}

function _jsonFileNameFromLink(link) {
    return link.attr('href').substring(1) + ".json"
}

function _getFullFilePath(fileName, problemType) {
    switch (problemType) {
        case 'tsp': return ("data/tsp/" + fileName);
        case 'vrp': return ("data/vrp/" + fileName);
        case 'wlp': return ("data/wlp/" + fileName);
        default: return undefined
    }
}

