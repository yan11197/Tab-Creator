ChordSearch = function(_parentElement) {
    this.parentElement = _parentElement
    this.sixth = FretBoard.sixth;
    this.fifth = FretBoard.fifth;
    this.fourth = FretBoard.fourth;
    this.third = FretBoard.third;
    this.second = FretBoard.second;
    this.first = FretBoard.first;

    this.initVis();
};

ChordSearch.prototype.initVis = function() {
    var vis = this;

    // Defining the move to front and move to back functions
    d3.selection.prototype.moveToFront = function() {
        return this.each(function(){
            this.parentNode.appendChild(this);
        });
    };
    d3.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };

    // Define the svg size
    vis.margin = {left: 0, right: 0, bottom: 0, top: 0, box: 105, text: 25, names: 15}
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;
    vis.dim = ["0, 0," + (vis.width + vis.margin.left + vis.margin.right).toString() + ",", vis.height.toString()]

    // Selecting the svg
    vis.svg = d3.select("#saved_svg")

    // Creating the backdrop rectangle
    vis.backdrop = vis.svg.append("rect")
        .attr("class", "search_tools")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height)
        .attr("fill", "steelblue")
        .attr("x", 0)
        .attr("y", 0)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "#E8E8E8");

    // Adding the title
    vis.inner_margin = 5

    vis.search = vis.svg.append("rect")
        .attr("class", "search_tools")
        .attr("x", vis.inner_margin)
        .attr("y", vis.inner_margin)
        .attr('width', vis.width - vis.inner_margin*2)
        .attr("height", vis.margin.text)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "lightgrey");

    vis.search_text = vis.svg.append("text")
        .attr("class", "search_tools")
        .attr("x", vis.width/2)
        .attr("y", vis.inner_margin + vis.margin.text/2)
        .attr("alignment-baseline", "middle")
        .text("Search Results")
        .style("text-anchor", "middle");

    // Move it all to the back
    d3.selectAll(".search_tools").moveToBack();
};

ChordSearch.prototype.updateVis = function () {
    var vis = this;

    // Move it all to the back
    vis.backdrop.moveToFront();
    vis.search.moveToFront();
    vis.search_text.moveToFront();

};