<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!DOCTYPE html>
<html>
<head>
    <title>Visualizers - Discrete Optimization - Coursera</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <c:set var="productionMode" value='<%=application.getInitParameter("mode").equals("production")%>'/>

    <c:if test="${productionMode}">
        <link href="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css" rel="stylesheet">
    </c:if>
    <c:if test="${not productionMode}">
        <link href="css/bootstrap.css" rel="stylesheet">
        <link href="css/bootstrap-responsive.css" rel="stylesheet">
    </c:if>

    <link href="css/main.css" rel="stylesheet">
    <link href="css/visualization.css" rel="stylesheet">
</head>
<body>
<div class="navbar navbar-inverse navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container">
            <ul class="nav">
                <li><a class="selected" href="#visualizers">Visualizers</a></li>
                <li><a href="#examples">Examples</a></li>
                <li><a href="#contacts">Contacts</a></li>
            </ul>
        </div>
    </div>
</div>

<div class="container">
    <div class="row">
        <div class="span2">
            <a href="https://class.coursera.org/optimization-001/">
                <img src="img/DiscreteOptimizationLogo.png" alt="" class="logo">
            </a>
        </div>
        <div class="span10">
            <h1>Visualizers</h1>
            <h3>for Discrete Optimization course on Coursera</h3>
            <p>Visualize your solutions and share your results.
            <br>All you need is to select a problem, choose a data set and submit your solution.</p>
        </div>
    </div>
</div>

<div id="visualizers" class="container visualizers">
<div class="tabbable">
<ul id="problemsets" class="nav nav-tabs">
    <li class="active"><a href="#tsp_tab" data-toggle="tab">Traveling Salesman Problem</a></li>
    <li><a href="#vrp_tab" data-toggle="tab">Vehicle Routing Problem</a></li>
    <li class="disabled"><a href="#wlp_tab" data-toggle="tab">Warehouse Location Problem</a></li>
</ul>
<div class="tab-content">
<div class="tab-pane active" id="tsp_tab">
    <div class="tabbable tabs-left">
        <ul class="nav nav-tabs"></ul>
        <div id="tsp_visualization" class="visualization-container"></div>
    </div>
</div>
<div class="tab-pane" id="vrp_tab">
    <div class="tabbable tabs-left">
        <ul class="nav nav-tabs"></ul>
        <div id="vrp_visualization" class="visualization-container"></div>
    </div>
</div>
<div class="tab-pane" id="wlp_tab">
    <div class="tabbable tabs-left">
        <ul class="nav nav-tabs"></ul>
        <div id="wlp_visualization" class="visualization-container"></div>
    </div>
</div>
</div>
</div>
</div>

<c:if test="${productionMode}">
    <script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
    <script src="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/js/bootstrap.min.js"></script>
    <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
</c:if>
<c:if test="${not productionMode}">
    <script src="js/jquery-1.10.2.js"></script>
    <script src="js/bootstrap.js"></script>
    <script src="js/d3.v3.js" charset="utf-8"></script>
</c:if>

<script src="js/ICanHaz.js"></script>
<script src="js/common.js"></script>
<script src="js/problems.js"></script>
<script src="js/visualizers.js"></script>
</body>
</html>