Saved = function(_parentElement, _fretboard) {
    this.parentElement = _parentElement;
    this.fretboard = _fretboard;
    this.dim = ["", 0];

    this.initVis();
};

Saved.prototype.initVis = function() {
    var vis = this;

    // Define the svg size
    vis.margin = {left: 0, right: 0, bottom: 0, top: 0}
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;
    vis.dim = ["0, 0," + (vis.width + vis.margin.left + vis.margin.right).toString() + ",", 400]

    // Creating the svg
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("viewBox", vis.dim[0] + vis.dim[1].toString())

    // Creating the backdrop rectangle
    vis.backdrop = vis.svg.append("rect")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", 400)
        .attr("fill", "steelblue")
        .attr("x", 0)
        .attr("y", 0)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "#E8E8E8");

    // Adding the title
    vis.inner_margin = 5

    vis.shift = vis.svg.append("rect")
        .attr("id", "legend_shift")
        .attr("x", vis.inner_margin)
        .attr("y", vis.inner_margin)
        .attr('width', vis.width - vis.inner_margin*2)
        .attr("height", 25)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "lightgrey");

    vis.svg.append("text")
        .attr("x", vis.width/2)
        .attr("y", vis.inner_margin + 25/2)
        .attr("alignment-baseline", "middle")
        .text("Saved Chords")
        .style("text-anchor", "middle");
};

Saved.prototype.updateVis = function() {
    var vis = this;
    
    vis.svg.attr("viewBox", vis.dim[0] + Math.max(400, 110*saved_chords.length + 25 + vis.inner_margin*2));
    vis.backdrop.attr("height", Math.max(400, 110*saved_chords.length + 25 + vis.inner_margin*2));
}
