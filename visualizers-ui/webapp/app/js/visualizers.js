
function _visualizeTSPSituation(data) {
    var xCoordinates = $.map(data, function(point) {
        return point.x
    });
    var yCoordinates = $.map(data, function(point) {
        return point.y
    });
    var xMin = d3.min(xCoordinates);
    var xMax = d3.max(xCoordinates);
    var xRange = new Range(xMin, xMax);

    var yMin = d3.min(yCoordinates);
    var yMax = d3.max(yCoordinates);
    var yRange = new Range(yMin, yMax);

    var yMaxChars = d3.max([yMin.toString().length, yMax.toString().length]);
    var xLabelsOffset = 50 + (yMaxChars > 3 ? (yMaxChars - 3) * 7 : 0);

    var xMaxChars = xMax.toString().length;
    var xRightPadding = (xMaxChars > 3) ? (xMaxChars - 3) * 5 : 0;

    var visualizer = new Visualizer({"horizontalLinesCount": 6, "xLabelsOffset": xLabelsOffset, "xRightPadding": xRightPadding});
    visualizer.showGrid(xRange, yRange);
    visualizer.visualizeProblem(data);
    visualizer.showSubmitForm();
}


//--------in constructor-------------
//0. clean up                              (done)
//1. calculate necessary height/width      (done)
//2. calculate pretty height/width         (done)
//3. calculate pretty lines number
//4. generate lines
//------in render function-----------
//5. make mapper function
//6. draw lines through the mapper
//7. draw points through the mapper
function BaseVisualizer(container, problem) {
    this.container = container;
    this.problem = problem;
    this.reset();

    this.problemBoundaries = this.calculateProblemBoundaries();
    this.adjustedBoundaries = this._adjustBoundariesToContainerShape(this.problemBoundaries);
}

BaseVisualizer.prototype.reset = function() {
    this.container.find('svg').remove();

    this.canvas = d3.select(this.container[0]).append('svg')
        .attr("class", "visualization")
        .attr("width", this.container.width())
        .attr("height", this.container.height())
};

BaseVisualizer.prototype._adjustBoundaries = function(points, problemBoundaries) {
    angular.forEach(points, function(value) {
        if (problemBoundaries.minX === undefined || problemBoundaries.minX > value.x) {
            problemBoundaries.minX = value.x
        }
        if (problemBoundaries.maxX === undefined || problemBoundaries.maxX < value.x) {
            problemBoundaries.maxX = value.x
        }
        if (problemBoundaries.minY === undefined || problemBoundaries.minY > value.y) {
            problemBoundaries.minY = value.y
        }
        if (problemBoundaries.maxY === undefined || problemBoundaries.maxY < value.y) {
            problemBoundaries.maxY = value.y
        }
    });
    return problemBoundaries;
};

BaseVisualizer.prototype._adjustBoundariesToContainerShape = function(boundaries) {
    var containerSidesRatio = this.container.width() / this.container.height();

    var regionWidth = boundaries.maxX - boundaries.minX;
    var regionHeight = boundaries.maxY - boundaries.minY;
    var regionSidesRatio = regionWidth / regionHeight;

    var adjustedBoundaries = angular.copy(boundaries);
    if (containerSidesRatio > regionSidesRatio) {
        var adjustedWidth = regionHeight * containerSidesRatio;
        var widthAdjustmentComponent = (adjustedWidth - regionWidth) / 2;
        adjustedBoundaries.minX -= widthAdjustmentComponent;
        adjustedBoundaries.maxX += widthAdjustmentComponent;
    } else if (regionSidesRatio > containerSidesRatio) {
        var adjustedHeight = regionWidth / containerSidesRatio;
        var heightAdjustmentComponent = (adjustedHeight - regionHeight) / 2;
        adjustedBoundaries.minY -= heightAdjustmentComponent;
        adjustedBoundaries.maxY += heightAdjustmentComponent;
    }
    return adjustedBoundaries
};

//Ensures visualization has padding.
//Padding is specified as a string parameter.
//There are two acceptable formats of padding:
// - with 'px'-suffix, e.g. ensurePadding('10px')
// - with '%'-suffix, e.g. ensurePadding('5%')
BaseVisualizer.prototype.ensurePadding = function(padding) {
    if (typeof padding !== 'string') {
        throw new TypeError("String value is expected as 'padding' argument.")
    }
    var paddingFormat = /(\d+)(px|%)/;
    var analysedPadding = padding.match(paddingFormat);
    if (analysedPadding) {
        var units = parseInt(analysedPadding[1], 10);
        var unitType = analysedPadding[2];

        var region = this.adjustedBoundaries;

        var horizontalPaddingPx = unitType === 'px'
            ? units
            : Math.ceil((region.maxX - region.minX) * (units / 100.0));

        var verticalPaddingPx = unitType === 'px'
            ? units
            : Math.ceil((region.maxY - region.minY) * (units / 100.0));

        region.minX = Math.min(region.minX, this.problemBoundaries.minX - horizontalPaddingPx);
        region.maxX = Math.max(region.maxX, this.problemBoundaries.maxX + horizontalPaddingPx);

        region.minY = Math.min(region.minY, this.problemBoundaries.minY - verticalPaddingPx);
        region.maxY = Math.max(region.maxY, this.problemBoundaries.maxY + verticalPaddingPx);

        this.adjustedBoundaries = this._adjustBoundariesToContainerShape(region);

    } else {
        throw new Error("Padding argument doesn't match expected format.")
    }
};

function TspVisualizer(container, tspProblem) {
    BaseVisualizer.call(this, container, tspProblem);
}

TspVisualizer.prototype = Object.create(BaseVisualizer.prototype);

TspVisualizer.prototype.calculateProblemBoundaries = function() {
    return this._adjustBoundaries(this.problem, {});
};

function VrpVisualizer(container, vrpProblem) {
    BaseVisualizer.call(this, container, vrpProblem);
}

VrpVisualizer.prototype = Object.create(BaseVisualizer.prototype);

VrpVisualizer.prototype.calculateProblemBoundaries = function() {
    var boundaries = {};
    this._adjustBoundaries(this.problem.customers, boundaries);
    this._adjustBoundaries([this.problem.warehouse], boundaries);
    return boundaries;
};

function Visualizer(config) {

    config = config || {};

    __construct = function(self) {
        $('svg').remove();
        $('div.solution').remove();

        self.width = config.width || 1080;
        self.height = config.height || 590;
        self.horizontalLinesCount = config.horizontalLinesCount || 10;
        self.verticalLinesCount = config.verticalLinesCount || 10;
        self.xLabelsOffset = config.xLabelsOffset || 50;
        self.yLabelsOffset = config.yLabelsOffset || 40;
        self.xRightPadding = config.xRightPadding || 0;
        self.labelsPadding = (self.xLabelsOffset | self.yLabelsOffset) ? 15 : 0;
        self.distanceSectionOffset = 20;

        self.grid = d3.select("div.tab-pane.active div.visualization-container").append("svg")
            .attr("class", "visualizer")
            .attr("width", (self.width + self.xLabelsOffset + self.labelsPadding + self.xRightPadding) + 'px')
            .attr("height", (self.height + self.yLabelsOffset + self.labelsPadding + self.distanceSectionOffset) + 'px');
    }(this);

    this.showGrid = function(xRange, yRange) {
        this.xRange = xRange ? _normalizeRangeForGrid(xRange, this.verticalLinesCount) : new Range(0, 1);
        this.yRange = yRange ? _normalizeRangeForGrid(yRange, this.horizontalLinesCount) : new Range(0, 1);

        var yScale = d3.scale.linear()
            .domain(this.yRange.toArray())
            .range([0, this.height]);

        var xScale = d3.scale.linear()
            .domain(this.xRange.toArray())
            .range([0, this.width]);

        var horizontalLinesContainer = this.grid.append('g')
            .attr('transform', 'translate(' + this.xLabelsOffset + ',' + this.yLabelsOffset + ')');

        var horizontalLinesLabelsContainer = horizontalLinesContainer.append('g')
            .attr('transform', 'translate(-15, 6)');

        horizontalLinesLabelsContainer.selectAll(".gridLabels")
            .data(yScale.ticks(this.horizontalLinesCount))
            .enter().append("text")
                .attr("class", "gridLabels")
                .attr("x", 0)
                .attr("y", yScale)
                .attr("text-anchor", "end")
                .text(String);

        horizontalLinesContainer.selectAll("line")
            .data(yScale.ticks(this.horizontalLinesCount))
            .enter().append("line")
                .attr("x1", 0)
                .attr("x2", this.width)
                .attr("y1", yScale)
                .attr("y2", yScale)
                .style("stroke", "#efefef");

        var verticalLinesContainer = this.grid.append('g')
            .attr('transform', 'translate(' + this.xLabelsOffset + ',' + this.yLabelsOffset + ')');

        var verticalLinesLabelsContainer = verticalLinesContainer.append('g')
            .attr('transform', 'translate(0, -12)');

        verticalLinesLabelsContainer.selectAll(".gridLabels")
            .data(xScale.ticks(this.verticalLinesCount))
            .enter().append("text")
            .attr("class", "gridLabels")
            .attr("x", xScale)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .text(String);

        verticalLinesContainer.selectAll("line")
            .data(xScale.ticks(this.verticalLinesCount))
            .enter().append("line")
                .attr("x1", xScale)
                .attr("x2", xScale)
                .attr("y1", 0)
                .attr("y2", this.height)
                .style("stroke", "#eee");

        return this;
    };

    this.visualizeProblem = function(data) {
        this.problem = data;

        var problemContainer = this.grid.append('g')
            .attr('class', 'problem-visualization')
            .attr('transform', 'translate(' + this.xLabelsOffset + ',' + this.yLabelsOffset + ')');

        var self = this;
        problemContainer.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("class", "point")
            .attr("r", 2)
            .attr("cx", function(d) {
                return ((d.x - self.xRange.min) / self.xRange.capacity) * self.width
            })
            .attr("cy", function(d) {
                return ((d.y - self.yRange.min) / self.yRange.capacity) * self.height
            });
    };

    this.showSubmitForm = function() {
        var self = this;
        _applyTemplate('submit_form', {'problem' : 'tsp'}).insertAfter('#tsp_visualization');
        $('.solution button.btn-primary').click(function() {
            $('.solution div.alert').remove();
            $('svg path').remove();
            $('svg .distance').remove();
            var solution = $("#solution").val();
            var problemSize = self.problem.length;
            var errorHandler = function(msg) {
                $('div.solution').prepend(_applyTemplate('alert', {'msg': msg}));
                return false;
            };
            _validateSolution(solution, problemSize, errorHandler) && _renderSolution(solution, self)
        });
        $('.solution button.btn-info').click(function() { _generateSolution(self.problem.length) })
    };

    function _generateSolution(problemSize) {
        var numbers = [];
        for (var i = 0; i < problemSize; i++) {
            numbers.push(i);
        }
        var sampleSolution = [];
        for (var j = 0; j < problemSize; j++) {
            var index = Math.floor(Math.random() * (numbers.length));
            sampleSolution.push(numbers[index]);
            numbers.splice(index, 1);
        }
        $("#solution").val(sampleSolution.join(' '));
    }

    function _renderSolution(solution, ctx) {
        var self = ctx;

        var solutionSequence = _parseSolutionString(solution);
        solutionSequence.push(solutionSequence[0]);
        var problem = self.problem;

        var lineFunction = d3.svg.line()
            .x(function(d) {
                var p = problem[d];
                return ((p.x - self.xRange.min) / self.xRange.capacity) * self.width
            })
            .y(function(d) {
                var p = problem[d];
                return ((p.y - self.yRange.min) / self.yRange.capacity) * self.height
            })
            .interpolate("linear");

        self.grid.append("path")
            .attr('transform', 'translate(' + self.xLabelsOffset + ',' + self.yLabelsOffset + ')')
            .attr("d", lineFunction(solutionSequence))
            .attr("stroke", "blue")
            .attr("stroke-width", 1)
            .attr("fill", "none");

        var distance = Math.round(_calculateTourDistance(solutionSequence, problem) * 1000) / 1000;
        self.grid.append("text")
            .attr('transform', 'translate(' + self.xLabelsOffset + ',' + self.yLabelsOffset + ')')
            .attr('class', 'distance')
            .attr('x', self.width)
            .attr('y', self.height)
            .attr('dx', -130 - (distance.toString().length * 10))
            .attr('dy', 28)
            .attr('text-anchor', 'start')
            .text('Tour distance: ' + distance);

        return distance;
    }

    function _calculateTourDistance(sequence, problem) {
        var distance = 0.0;
        for (var i = 0; i < sequence.length - 1; i++) {
            var p1 = problem[sequence[i]];
            var p2 = problem[sequence[i + 1]];
            distance += Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
        }
        return distance;
    }

    function _validateSolution(solution, problemSize, error) {
        if (!solution) {
            return error('Solution is not specified.')
        }
        var sequence = _parseSolutionString(solution);

        for (var i in sequence) {
            var v = sequence[i];
            if (!v.match(/^\d+$/)) {
                return error("Vertex " + v + " is not valid.");
            }
        }

        if (sequence.length < problemSize) {
            return error("Provided solution doesn't contain all vertices.")
        }
        if (sequence.length > problemSize) {
            return error("Provided solution contains odd vertices: "
                + sequence.length + " vertices found while " + problemSize + " vertices needed.")
        }
        var vertices = [];
        for (i in sequence) {
            v = sequence[i];
            if (vertices[v]) {
                return error("Vertex " + v + " is visited more than once.")
            }
            if (v < 0 || v >= problemSize) {
                return error("Vertex " + v + " is not valid.")
            }
            vertices[v] = true;
        }
        return "success";
    }

    function _parseSolutionString(solutionString) {
        return $.grep(solutionString.split(/ |\n/), function(entry) {
            return entry && entry.length && entry.trim().length;
        });
    }

    var prettyIntervals = [0.2, 0.5, 1, 2, 3, 5, 10, 20, 50,
                           100, 200, 500, 1000, 2000, 5000, 10000,
                           20000, 25000, 50000, 100000, 200000, 250000, 500000, 1000000];

    function _normalizeRangeForGrid(range, parts) {
        var fullIntRange = new Range(Math.floor(range.min - range.capacity * 0.05), Math.ceil(range.max + range.capacity * 0.05));
        for (var i in prettyIntervals) {
            var interval = prettyIntervals[i];
            if (interval * parts >= fullIntRange.capacity) {
                var start;
                if (interval < 1) {
                    start = fullIntRange.min;
                } else {
                    if (fullIntRange.min < 0) {
                        start = fullIntRange.min - (fullIntRange.min % interval) - interval;
                    } else if (fullIntRange.min > 0) {
                        start = fullIntRange.min - (fullIntRange.min % interval);
                    } else {
                        start = 0;
                    }
                }
                var end = start + interval * parts;
                if (end >= range.max) {
                    return new Range(start, end)
                }
            }
        }
        return fullIntRange;
    }
}

function Range(min, max) {
    this.min = min;
    this.max = max;
    this.capacity = this.max - this.min;

    this.toArray = function() {
        return [this.min, this.max]
    }
}
