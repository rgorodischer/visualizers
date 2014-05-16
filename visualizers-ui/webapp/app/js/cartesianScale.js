// var xyScale = d3.scale.cartesian()
//    .ticksRound([0.1, 0.2, 0.3, 0.5, 1])
//    .x.domain([x1, x2]).range([rx1, rx2]).minPadding('30px')
//    .y.domain([y1, y2]).range([ry1, ry2]).minPadding('5%')
//
// var p = { x: v1, y: v2 }
// xyScale.x(p.x) === val
// xyScale.y(p.y) === val
// xyScale(p) === { x: val1, y: val2 }
//
// var ticks = xyScale.ticks(8)  will return ticks of the same interval on both x and y scales
// ticks.x
// ticks.y

// var ticks = xyScale.ticks([8, 10]) will return independent ticks i.e. ticks on x and on y scales may have different intervals
// ticks.x
// ticks.y


//todo:
//minPadding(px|%)
//ticksFormat(format)
d3.scale.cartesian = function() {
    return d3_cartesian_scale(
        { domain : [0, 1], range : [0, 1] },
        { domain : [0, 1], range : [0, 1] },
        [0.1, 0.25, 0.5, 1]
    )
};

function d3_cartesian_scale(xSpaces, ySpaces, ticksRound) {

    function interval(i) { return i[1] - i[0] }

    function rescale() {
        var rangesRatio = interval(xSpaces.range) / interval(ySpaces.range);

        var domainWidth = interval(xSpaces.domain);
        var domainHeight = interval(ySpaces.domain);
        var domainsRatio = domainWidth / domainHeight;

        xSpaces.correctedDomain = xSpaces.domain.slice(0);
        ySpaces.correctedDomain = ySpaces.domain.slice(0);

        if (rangesRatio > domainsRatio) {
            var recalculatedDomainWidth = domainHeight * rangesRatio;
            var widthAdjustmentComponent = (recalculatedDomainWidth - domainWidth) / 2;
            xSpaces.correctedDomain[0] -= widthAdjustmentComponent;
            xSpaces.correctedDomain[1] += widthAdjustmentComponent;
        } else if (domainsRatio > rangesRatio) {
            var recalculatedDomainHeight = domainWidth / rangesRatio;
            var heightAdjustmentComponent = (recalculatedDomainHeight - domainHeight) / 2;
            ySpaces.correctedDomain[0] -= heightAdjustmentComponent;
            ySpaces.correctedDomain[1] += heightAdjustmentComponent;
        }
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
        return function(d) {
            if (!arguments.length || d.length !== 2) {
                return spaces.domain.slice(0)
            }
            spaces.domain = d.slice(0);
            rescale();
            return this;
        }
    }

    function correctedDomain(spaces) {
        return function() {
            return spaces.correctedDomain.slice(0)
        }
    }

    function range(spaces) {
        return function(r) {
            if (!arguments.length || r.length !== 2) {
                return spaces.range.slice(0)
            }
            spaces.range = r.slice(0);
            rescale();
            return this;
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

    yScale.x = xScale;
    yScale.domain = domain(ySpaces);
    yScale.range = range(ySpaces);
    yScale.correctedDomain = correctedDomain(ySpaces);
    yScale.invert = inverter(ySpaces);

    xyScale.x = xScale;
    xyScale.y = yScale;
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
    xyScale.ticks = function() {
        var ticksNumber =  arguments.length && arguments[0] || 10;

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

        if (ticksNumber.length) {
            var xInterval = computeTicksInterval(ticksNumber[0], xSpaces.correctedDomain);
            var yInterval = computeTicksInterval(ticksNumber[1], ySpaces.correctedDomain);
            return {
                x : generateTicks(xInterval, findExtremumTicks(xInterval, xSpaces.correctedDomain)),
                y : generateTicks(yInterval, findExtremumTicks(yInterval, ySpaces.correctedDomain))
            }
        } else {
            var xyInterval = computeTicksInterval(ticksNumber, xSpaces.correctedDomain);
            return {
                x : generateTicks(xyInterval, findExtremumTicks(xyInterval, xSpaces.correctedDomain)),
                y : generateTicks(xyInterval, findExtremumTicks(xyInterval, ySpaces.correctedDomain))
            }
        }
    };
    xyScale.copy = function() {
        return d3_cartesian_scale(
            { domain : xSpaces.domain.slice(0), range : xSpaces.range.slice(0), ticksRound : xSpaces.ticksRound.slice(0) },
            { domain : ySpaces.domain.slice(0), range : ySpaces.range.slice(0), ticksRound : ySpaces.ticksRound.slice(0) }
        )
    };

    rescale();
    return xyScale
}

