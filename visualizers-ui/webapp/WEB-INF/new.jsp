<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<c:set var="productionMode" value='<%=application.getInitParameter("mode").equals("production")%>'/>

<!DOCTYPE html>
<html ng-app="problemSets">
<head>
    <title>Visualizers - Discrete Optimization - Coursera</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <c:if test="${productionMode}">
        <link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
    </c:if>
    <c:if test="${not productionMode}">
        <link href="app/lib/bootstrap/bootstrap.css" rel="stylesheet">
    </c:if>

    <link href="app/css/main.css" rel="stylesheet">
    <link href="app/css/visualization.css" rel="stylesheet">
</head>
<body>

<div class="container">
    <div id="heading" class="row">
        <div class="col-xs-2">
            <a href="https://class.coursera.org/optimization-001/" target="_blank">
                <img id="logo" src="app/img/DiscreteOptimizationLogo.png" alt="">
            </a>
        </div>
        <div id="description" class="col-xs-10">
            <h1>Visualizers</h1>
            <h4>for Discrete Optimization course on Coursera</h4>
            <p>Visualize your solutions and share your results.
            <br>Select a problem, choose a data set and submit your solution.</p>
        </div>
    </div>

    <div id="problem-type-trigger" class="row">
        <div class="btn-group btn-group-lg col-xs-offset-2">
            <button type="button" class="btn btn-default" ng-class="{active:problemType=='tsp'}" ng-click="goTo('/tsp')">Traveling Salesman Problem</button>
            <button type="button" class="btn btn-default" ng-class="{active:problemType=='vrp'}" ng-click="goTo('/vrp')">Vehicle Routing Problem</button>
        </div>
    </div>

    <div id="problem-visualization" class="row">
        <div id="problems-nav" class="col-xs-2">
            <div ng-view></div>
        </div>
    </div>

        <%--<div class="tabbable">--%>
            <%--<div class="tab-content">--%>
                <%--<div class="tab-pane active" id="tsp_tab">--%>
                    <%--<div class="tabbable tabs-left">--%>
                        <%--<ul class="nav nav-tabs"></ul>--%>
                        <%--<div id="tsp_visualization" class="visualization-container"></div>--%>
                    <%--</div>--%>
                <%--</div>--%>
                <%--<div class="tab-pane" id="vrp_tab">--%>
                    <%--<div class="tabbable tabs-left">--%>
                        <%--<ul class="nav nav-tabs"></ul>--%>
                        <%--<div id="vrp_visualization" class="visualization-container"></div>--%>
                    <%--</div>--%>
                <%--</div>--%>
            <%--</div>--%>
        <%--</div>--%>
</div>


<c:if test="${productionMode}">
    <script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.13/angular.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.13/angular-route.min.js>"></script>
    <script src="http://netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min.js"></script>
    <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
</c:if>
<c:if test="${not productionMode}">
    <script src="app/lib/jquery-1.10.2.js"></script>
    <script src="app/lib/angular/angular.js"></script>
    <script src="app/lib/angular/angular-route.js"></script>
    <script src="app/lib/bootstrap/bootstrap.js"></script>
    <script src="app/lib/d3.v3.js" charset="utf-8"></script>
</c:if>

<script src="app/lib/ICanHaz.js"></script>
<script src="app/js/common.js"></script>
<script src="app/js/problems.js"></script>
<script src="app/js/visualizers.js"></script>
</body>
</html>