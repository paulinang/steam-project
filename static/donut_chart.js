function makeDonutChart(chartDiv, dataset) {
     // chart dimensions
    var width = 960,
        height = 500,
        radius = Math.min(width, height) / 2;

    // color scale
    var color = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    // add svg element to div
    var svg = d3.select(chartDiv).append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // create arc
    var arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(radius - 70);

    // create pie layout
    var pie = d3.layout.pie().value(function(d) { return d[1]; }).sort(null);

    // add path elements to svg
    var path = svg.selectAll('path').data(pie(dataset)).enter().append('path').attr({
        d:arc,
        fill: function (d,i) {
            return color(i);
        },
        // creates a class for playhours to select paths faster
        class: function(d) { return "hours" + d.data[1].toString(); }
    });

    // add text
    var text = svg.selectAll('text').data(pie(dataset)).enter().append("text").attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; }).attr("dy", ".35em").text(function(d) { return d.data[0]; });
}