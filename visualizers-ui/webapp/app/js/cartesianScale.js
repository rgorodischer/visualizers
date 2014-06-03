// var xyScale = d3.scale.cartesian()
//    .ticksRound([0.1, 0.2, 0.3, 0.5, 1])
//    .x.domain([x1, x2]).range([rx1, rx2]).padding(30)
//    .y.domain([y1, y2]).range([ry1, ry2]).padding('5%')
//
// var p = { x: v1, y: v2 }
// xyScale.x(p.x) === val
// xyScale.y(p.y) === val
// xyScale(p) === { x: val1, y: val2 }
//
// var ticks = xyScale.ticks(8)  will return ticks of the same interval on both x and y scales
// ticks.x
// ticks.y

// var xTicks = xyScale.x.ticks(8)  will return ticks on x scale only;
//                                 count (8 in this example) is just a desirable number of ticks on the largest scale.

// var ticks = xyScale.ticks([50])  will return ticks of the interval equal to 50 on both x and y scales
// ticks.x
// ticks.y

// var yTicks = xyScale.y.ticks([100]) will return ticks with the interval equal to 100 on y scale

d3.scale.cartesian = function() {
    return d3_cartesian_scale(
        { domain : [0, 1], range : [0, 1], padding : function() { return 0 } },
        { domain : [0, 1], range : [0, 1], padding : function() { return 0 } },
        [0.1, 0.25, 0.5, 1]
    )
};

function d3_cartesian_scale(xSpaces, ySpaces, ticksRound) {

    function interval(i) { return i[1] - i[0] }

    function rescale() {

        var rangesRatio = interval(xSpaces.range) / interval(ySpaces.range);

        function scaleUp(limit, newInterval) {
            var adjustmentComponent = (newInterval - interval(limit)) / 2;
            limit[0] -= adjustmentComponent;
            limit[1] += adjustmentComponent;
        }

        function computeCorrectedDomain(xDomain, yDomain) {
            var domainWidth = interval(xDomain);
            var domainHeight = interval(yDomain);
            var domainsRatio = domainWidth / domainHeight;

            xSpaces.correctedDomain = xDomain.slice(0);
            ySpaces.correctedDomain = yDomain.slice(0);

            if (rangesRatio > domainsRatio) {
                var correctedDomainWidth = domainHeight * rangesRatio;
                scaleUp(xSpaces.correctedDomain, correctedDomainWidth);
            } else if (domainsRatio > rangesRatio) {
                var correctedDomainHeight = domainWidth / rangesRatio;
                scaleUp(ySpaces.correctedDomain, correctedDomainHeight);
            }
        }

        function addPadding(spaces) {
            var requiredPadding = ((spaces.padding() / interval(spaces.range)) * interval(spaces.correctedDomain)) * 2;
            var currentPadding = interval(spaces.correctedDomain) - interval(spaces.domain);
            if (requiredPadding > currentPadding) {
                scaleUp(spaces.correctedDomain, interval(spaces.correctedDomain) + (requiredPadding - currentPadding));
                computeCorrectedDomain(xSpaces.correctedDomain, ySpaces.correctedDomain);
            }
        }

        computeCorrectedDomain(xSpaces.domain, ySpaces.domain);
        addPadding(xSpaces);
        addPadding(ySpaces);
    }

    function mapper(spaces) {
        return function(val) {
            return ((val - spaces.correctedDomain[0]) / interval(spaces.correctedDomain)) * interval(spaces.range) + spaces.range[0]
        }
    }

    function inverter(spaces) {
        return function(val) {
            return ((val - spaces.range[0]) / interval(spaces.range)) * interval(spaces.correctedDomain) + spaces.correctedDomain[0]
        }
    }

    function domain(spaces) {
        var domain = function(d) {
            if (!domain.validator.call(undefined, d)) {
                return spaces.domain.slice(0)
            }
            spaces.domain = d.slice(0);
            rescale();
            return this;
        };
        domain.validator = function(d) { return d && d.length == 2 };
        return domain;
    }

    function correctedDomain(spaces) {
        return function() {
            return spaces.correctedDomain.slice(0)
        }
    }

    function range(spaces) {
        var range = function(r) {
            if (!range.validator.call(undefined, r)) {
                return spaces.range.slice(0)
            }
            spaces.range = r.slice(0);
            rescale();
            return this;
        };
        range.validator = function(r) { return r && r.length == 2 };
        return range;
    }

    function padding(spaces) {
        var padding = function(paddingParam) {
            if (!padding.validator.call(undefined, paddingParam)) {
                return spaces.padding()
            }
            if (typeof paddingParam == 'string') {
                var parsedPadding = paddingParam.match(/^(\d+)%$/);
                if (!parsedPadding) {
                    throw new TypeError("String value of format 'n%' is expected.")
                }
                var paddingPercents = parseInt(parsedPadding[1], 10);
                spaces.padding = function() { return interval(spaces.range) * (paddingPercents / 100.0); };
            } else if (typeof paddingParam == 'number') {
                spaces.padding = function() { return paddingParam; };
            }
            rescale();
            return this;
        };
        padding.validator = function(param) { return typeof param == 'string' || typeof param == 'number' };
        return padding;
    }

    function tickFormat(spaces) {
        return function(count, format) {
            return d3.scale.linear().domain(spaces.domain.slice(0)).tickFormat(count, format)
        }
    }

    function ticks(primarySpaces, secondarySpaces) {
        return function(ticksSpec) {
            ticksSpec = ticksSpec || 10;

            function findExtremumTicks(ticksInterval, endPoints) {
                return [
                        endPoints[0] + (ticksInterval - endPoints[0] % ticksInterval) % ticksInterval,
                        endPoints[1] - (ticksInterval + endPoints[1] % ticksInterval) % ticksInterval
                ]
            }

            function findNearestRoundNumber(number) {
                var pow_of_10 = 1;
                while (number / pow_of_10 > 1) {
                    pow_of_10 *= 10
                }

                var nearestRoundNumber = undefined;
                var minDistance = undefined;

                for (var i = 0; i < ticksRound.length; i++) {
                    var roundNumber = ticksRound[i] * pow_of_10;
                    var distance = Math.abs(roundNumber - number);
                    if (nearestRoundNumber === undefined || distance < minDistance) {
                        nearestRoundNumber = roundNumber;
                        minDistance = distance;
                    }
                }
                return nearestRoundNumber || number
            }

            function computeTicksInterval(ticksNumber, domain) {
                var exactInterval = interval(domain) / ticksNumber;
                return findNearestRoundNumber(exactInterval);
            }

            function generateTicks(ticksInterval, endPoints) {
                var ticks = [];
                for (var tick = endPoints[0]; tick <= endPoints[1]; tick += ticksInterval) {
                    ticks.push(tick);
                }
                return ticks;
            }

            var ticksInterval = ticksSpec.length ? ticksSpec[0] : computeTicksInterval(ticksSpec, primarySpaces.correctedDomain);
            if (primarySpaces && secondarySpaces) {
                var xyTicks = [
                    generateTicks(ticksInterval, findExtremumTicks(ticksInterval, primarySpaces.correctedDomain)),
                    generateTicks(ticksInterval, findExtremumTicks(ticksInterval, secondarySpaces.correctedDomain))
                ];
                xyTicks.x = xyTicks[0];
                xyTicks.y = xyTicks[1];
                return xyTicks;
            } else {
                return generateTicks(ticksInterval, findExtremumTicks(ticksInterval, primarySpaces.correctedDomain));
            }
        }
    }

    function combineXY(fx, fy, cx, cy) {
        return function(param) {
            if (fx.validator.call(undefined, param) && fy.validator.call(undefined, param)) {
                fx.apply(cx, arguments);
                fy.apply(cy, arguments);
                return this;
            } else {
                return {
                    x : fx.apply(cx, []),
                    y : fy.apply(cy, [])
                }
            }
        }
    }

    var xScale = mapper(xSpaces);
    var yScale = mapper(ySpaces);

    var xyScale = function(point) {
        return {
            x : xyScale.x(point.x),
            y : xyScale.y(point.y)
        }
    };

    xScale.y = yScale;
    xScale.domain = domain(xSpaces);
    xScale.range = range(xSpaces);
    xScale.correctedDomain = correctedDomain(xSpaces);
    xScale.invert = inverter(xSpaces);
    xScale.padding = padding(xSpaces);
    xScale.tickFormat = tickFormat(xSpaces);
    xScale.ticks = ticks(xSpaces);

    yScale.x = xScale;
    yScale.domain = domain(ySpaces);
    yScale.range = range(ySpaces);
    yScale.correctedDomain = correctedDomain(ySpaces);
    yScale.invert = inverter(ySpaces);
    yScale.padding = padding(ySpaces);
    yScale.tickFormat = tickFormat(ySpaces);
    yScale.ticks = ticks(ySpaces);

    xyScale.x = xScale;
    xyScale.y = yScale;
    xyScale.domain = combineXY(xScale.domain, yScale.domain);
    xyScale.range = combineXY(xScale.range, yScale.range);
    xyScale.padding = combineXY(xScale.padding, yScale.padding);
    xyScale.invert = function(point) {
        return {
            x : xyScale.x.invert(point.x),
            y : xyScale.y.invert(point.y)
        }
    };
    xyScale.ticksRound = function(values) {
        if (!arguments.length || !values.length) {
            return ticksRound.slice(0)
        }
        ticksRound = values.slice(0);
        return this;
    };
    xyScale.ticks = ticks(xSpaces, ySpaces);
    xyScale.copy = function() {
        return d3_cartesian_scale(
            { domain : xSpaces.domain.slice(0), range : xSpaces.range.slice(0), ticksRound : xSpaces.ticksRound.slice(0) },
            { domain : ySpaces.domain.slice(0), range : ySpaces.range.slice(0), ticksRound : ySpaces.ticksRound.slice(0) }
        )
    };

    rescale();
    return xyScale
}