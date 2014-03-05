$(document).ready(function() {
//    _bindProblemSetSelectEvents();
    _generateProblemsList();
//    _bindProblemSelectEvents();
});

//function _loadDefaultProblemOnActiveTab() {
//    var selectedProblem = $('div.tab-pane.active li.active a').filter(":visible");
//    _loadProblemByLink(selectedProblem);
//}

function _generateProblemsList() {
    var problemType = "tsp";//_getOpenProblemType();
    var indexPath = _getFullFilePath("index.json", problemType);
    _loadJsonFile(indexPath, function(problemsList) {
        var problemsContainer = $('#problems_set ul');
        $.each(problemsList, function(index, problem) {
            problemsContainer.append("<li><a href='#" + problem + "'>" + problem + "</a></li>")
        });
        $('li', problemsContainer).first().addClass('active');
//        _loadDefaultProblemOnActiveTab();
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


angular.module("problemSets", ["ngRoute"])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/tsp/:problemId?', {
                templateUrl: 'app/partials/problems-list.html',
                controller: 'TspController'
            }).
            when('/vrp/:problemId?', {
                templateUrl: 'app/partials/problems-list.html',
                controller: 'VrpController'
            }).
            otherwise({
                redirectTo: '/tsp'
            });


    }])
    .run(function($rootScope, $location) {
        $rootScope.goTo = function(url) {
            $location.path(url);
        };
    })
    .controller("TspController", function($scope, $rootScope, $http, $routeParams) {
        $http.get("data/tsp/index.json").success(function(data) {
            $scope.problems = data;
            $rootScope.problemType = "tsp";
        });
    })
    .controller("VrpController", function($scope, $rootScope, $http, $routeParams) {
        $http.get("data/vrp/index.json").success(function(data) {
            $scope.problems = data;
            $rootScope.problemType = "vrp";
        });
    });

