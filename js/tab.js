Tab = function(_parentElement, _fretboard) {
    this.parentElement = _parentElement;
    this.fretboard = _fretboard;
    this.counter = 0;
    this.tab_memory_string = [[], [], [], [], [], []]

    // To get the number of characters a line can hold
    this.max_length = 0;
    this.font_width = 9;

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
    var v = [FretBoard.first.toLowerCase(), FretBoard.second, FretBoard.third, FretBoard.fourth, FretBoard.fifth, FretBoard.sixth]
    for (var i = 0; i < 6; i++) {
        vis.svg.append("text")
            .attr("class", "tab_text" + i.toString())
            .attr("x", vis.margin.left)
            .attr("y", vis.margin.top + i * 17.5)
            .text(v[i] + " |");
    };

    // Creating the placemarker
    // With this font it is 9 pixels to get from space to space
    vis.mark = vis.svg.append("rect")
        .attr("id", "mark")
        .attr("x", 1 + 9 * 3)
        .attr("y", 7)
        .attr('width', 7)
        .attr("height", 6 * 17.5)
        .attr("fill", "goldenrod")
        .attr("opacity", .7);

    vis.max_length = Math.floor((vis.width-vis.font_width*5)/vis.font_width)
};

function splitString (string, size) {
    var re = new RegExp('.{1,' + size + '}', 'g');
    return string.match(re);
}

Tab.prototype.TabAddition = function() {
    var vis = this;

    // Make tab_key
    vis.makeTabKey()

    // Getting array of the joined strings
    for (var i = 0; i < 6; i++) {
        var s = tab_memory[i].slice(1, tab_memory[0].length).join("")
        vis.tab_memory_string[i] = splitString(s, vis.max_length)
    }

    // Adding the spaces and the key signature
    for (var i = 0; i < 6; i++) {
        if (vis.tab_memory_string[i] == null) {
            vis.tab_memory_string[i] = tab_key[i]
        } else {
            for (var j = 0; j < vis.tab_memory_string[0].length; j++) {
                vis.tab_memory_string[i][j] = tab_key[i] + vis.tab_memory_string[i][j]
            }
        }
    }

    // Adding the text
    for (var i = 0; i < 6; i++) {
        var tab_text = vis.svg.selectAll(".tab_text" + i.toString())
            .data(vis.tab_memory_string[i])

        tab_text.enter().append("text")
            .attr("class", "tab_text" + i.toString())
            .attr("x", vis.margin.left)
            .attr("y", function(d, id) {return vis.margin.top + i*17.5 + 17.6*7*id})
            .text(function(d) {return d})

        tab_text.text(function(d) {return d})

        tab_text.exit().remove()
    };

    vis.MarkerMove();
};

Tab.prototype.MarkerMove = function() {
    var vis = this;

    var mark_location = splitString(tab_memory[0].slice(0, vis.counter+1).join(""), vis.max_length)

    // Setting the x value
    vis.mark
        .attr("y", 7 + 17.6*7*(mark_location.length - 1))
        .attr("x", 1 + (2+mark_location[mark_location.length - 1].length)*9)
};

Tab.prototype.clearTab = function() {
    var vis = this;

    // Updating the counter
    vis.counter = 0

    // Filling the tab memory
    tab_memory = [];
    for (var i = 0; i < 6; i++) {
        tab_memory.push(["|"])
    }

    // Filling the tab_memory string list
    vis.makeTabKey()
    // vis.TabAddition();
    vis.MarkerMove();

}

Tab.prototype.makeTabKey = function() {
    var vis = this

    // Finding out if there are any flats or not
    tab_key = []
    var key = [FretBoard.first.toLowerCase(), FretBoard.second, FretBoard.third, FretBoard.fourth, FretBoard.fifth, FretBoard.sixth];


    for (var i =0; i < 6; i++) {
        if (key[i].length > 1) {tab_key.push([key[i] + "|"])}
        else {tab_key.push([key[i] + " |"])}
    }
}