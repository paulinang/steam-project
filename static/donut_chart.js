function makeDonutChart(chartDiv, dataset) {
    // legend constants
    var legendRectSize = 18;
    var legendSpacing = 4;

     // chart dimensions
    var width = 960,
        height = 500,
        radius = Math.min(width, height) / 2;

    // color scale
    var color = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    // add svg element to div, origin at center of canvas
    var svg = d3.select(chartDiv).append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // create arc
    var arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(radius - 70);

    // create pie layout
    var pie = d3.layout.pie().value(function(d) { return d[1]; }).sort(null);

    // add path elements to svg
    var path = svg.selectAll('path').data(pie(dataset)).enter().append('path').attr({
        d:arc,
        fill: function (d,i) {
            // color is associated with a game title
            return color(d.data[0]);
        },
        // creates a class for playhours to select paths faster
        class: function(d) { return "hours" + d.data[1].toString(); },
    }).each(function(d) { this._current = d; }); // store the initial values;

    // add text
    // var text = svg.selectAll('text').data(pie(dataset)).enter().append("text").attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; }).attr("dy", ".35em").text(function(d) { return d.data[0]; });

    // add legend in center of donut
    var legend = svg.selectAll('.legend').data(color.domain()).enter().append('g').attr('class', 'legend').attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset =  height * color.domain().length / 2;
        var horz = -2 * legendRectSize;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
    });

    legend.append('rect').attr('width', legendRectSize).attr('height', legendRectSize).style('fill', color).style('stroke', color);

    legend.append('text').attr('x', legendRectSize + legendSpacing).attr('y', legendRectSize - legendSpacing).text(function(d) { return d; });
}


// transition arc to new angle
// reference: http://bl.ocks.org/mbostock/5100636
function arcTween(action) {
    return function(d) {
        var interpolate = d3.interpolate(d.endAngle, d.startAngle);
        
        this._current = interpolate(0);
        return function(t) {
            d.endAngle = interpolate(t);

            return arc(interpolate(t));
        };
    };
}

// trying to play around with reducing slices
function reduce(hours) {
    var rect = d3.select(hours);
    var enabled = true;
    var totalEnabled = d3.sum(dataset.map(function(d) {
        return (d.enabled) ? 1 : 0;
    }));

    if (rect.attr('class') === 'disabled') {
        rect.attr('class', '');
    } else {
        if (totalEnabled < 2) return;
        rect.attr('class', 'disabled');
        enabled = false;
    }

    pie.value(function(d) {
    if (d.label === label) d.enabled = enabled;
        return (d.enabled) ? d.count : 0;
    });

    path = path.data(pie(dataset));

    path.transition().duration(750).attrTween('d', function(d) {
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        
        return function(t) {
            return arc(interpolate(t));
      };
    });

}
