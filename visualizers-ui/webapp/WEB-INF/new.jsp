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
    <div id="heading" class="row jumbotron">
        <div class="col-xs-3">
            <a href="https://class.coursera.org/optimization-001/" target="_blank">
                <img id="logo" src="app/img/logo-darkblue.png" alt="">
            </a>
        </div>
        <div id="description" class="col-xs-9">
            <h1>Visualizers</h1>
            <p>for Discrete Optimization course on Coursera</p>
        </div>
    </div>

    <div ng-view></div>

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

<script src="app/js/common.js"></script>
<script src="app/js/problems.js"></script>
<script src="app/js/visualizers.js"></script>
</body>
</html>