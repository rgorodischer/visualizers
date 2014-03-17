
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
    .service("ProblemsTracker", function() {
        this.currentProblemId = undefined;
        this.setCurrentProblem = function(problemId) { this.currentProblemId = problemId };
        this.getCurrentProblem = function() { return this.currentProblemId };
    })
    .service("ProblemsLoader", function($http) {
        var problemsData = {
            type : '',
            index : [],
            current : {}
        };
        return {
            problems : problemsData,
            loadProblem : function(problemType, problemId, redirect) {
                problemsData.type = problemType;
                $http.get("data/" + problemType + "/index.json", {cache : true}).success(function(index) {
                    problemsData.index = index;
                    if (!problemId) {
                        redirect(index[0].fileName)
                    } else {
                        $http.get("data/" + problemType + "/" + problemId + ".json", {cache : true}).success(function(problem) {
                            problemsData.current = {
                                id : problemId,
                                definition : problem
                            }
                        })
                    }
                })
            }
        }
    })
    .controller("TspController", function($scope, $routeParams, $location, ProblemsLoader) {
        ProblemsLoader.loadProblem("tsp", $routeParams.problemId, function(problemId) {
            $location.path("/tsp/" + problemId)
        });
        $scope.problems = ProblemsLoader.problems;
    })
    .controller("VrpController", function($scope, $routeParams, $location, ProblemsLoader) {
        ProblemsLoader.loadProblem("vrp", $routeParams.problemId, function(problemId) {
            $location.path("/vrp/" + problemId)
        });
        $scope.problems = ProblemsLoader.problems
    })
    .directive("visualization", function() {
        return {
            restrict: 'EA',
            controller: function($scope, $element, ProblemsTracker) {
                $scope.$watch("problems.current", function(currentProblem) {
                    if (currentProblem.id !== ProblemsTracker.getCurrentProblem()) {
                        ProblemsTracker.setCurrentProblem(currentProblem.id);

                        var visualizer = ($scope.problems.type == "tsp")
                            ? new TspVisualizer($element, $scope.problems.current.definition)
                            : new VrpVisualizer($element, $scope.problems.current.definition);
                        visualizer.defineVisualizationRegion()
                    }
                });

            }
        }
    });

