Tab = function(_parentElement, _fretboard) {
    this.parentElement = _parentElement;
    this.fretboard = _fretboard;
    this.counter = 0;

    this.initVis();
};

Tab.prototype.initVis = function() {
    var vis = this;

    // Define the svg size
    vis.margin = {left: 0, right: 0, bottom: 0, top: 20}
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

    // Creating the svg
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .attr("class", "tab");

    // Creating 6 textboxes
    for (var i = 0; i < 6; i++) {
        vis.svg.append("text")
            .attr("class", "tab_text")
            .attr("id", "tab_s" + (i+1).toString())
            .attr("x", vis.margin.left)
            .attr("y", vis.margin.top + i * 17.5)
            .text(tab_memory[i].join(""));
    }

    // Creating the placemarker
    // With this font it is 9 pixels to get from space to space
    vis.mark = vis.svg.append("rect")
        .attr("id", "mark")
        .attr("x", 1 + 9 * 2)
        .attr("y", 7)
        .attr('width', 7)
        .attr("height", 6 * 17.5)
        .attr("fill", "green")
        .attr("opacity", .7);

};

Tab.prototype.TabAddition = function() {
    var vis = this;

    for (var i = 0; i < 6; i++) {
        vis.svg.select("#tab_s" + (i + 1).toString())
            .text(tab_memory[i].join(""))
    }

    vis.MarkerMove();
}

Tab.prototype.MarkerMove = function() {
    var vis = this;

    // Setting the x value
    vis.mark.attr("x", 1 + tab_memory[0].slice(0, vis.counter+1).join("").length*9)
}