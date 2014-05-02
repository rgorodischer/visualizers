// var xyScale = d3.scale.cartesian()
//    .x.domain([x1, x2]).range([rx1, rx2])
//    .y.domain([y1, y2]).range([ry1, ry2])
//
// var p = { x: v1, y: v2 }
// xyScale.x(p.x) === val
// xyScale.y(p.y) === val
// xyScale(p) === { x: val1, y: val2 }


//todo:
//ticksRound(values)
//ticks(count)
//tickFormat(format)
//copy()
d3.scale.cartesian = function() {
    return d3_cartesian_scale(
        { domain : [0, 1], range : [0, 1] },
        { domain : [0, 1], range : [0, 1] }
    )
};

function d3_cartesian_scale(xSpaces, ySpaces) {

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
        };
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

    rescale();
    return xyScale
}

