ChordSearch = function(_parentElement) {
    this.parentElement = _parentElement
    this.string_cal = [FretBoard.first,
                       FretBoard.second,
                       FretBoard.third,
                       FretBoard.fourth,
                       FretBoard.fifth,
                       FretBoard.sixth]

    // To denote if you are currently searching
    this.search_mode = false;

    // chord_shapes[chord_triad][chord_embellish] = [ ... [[chord shape], index of root note], ... ]
    this.chord_shapes = {}

    // stationary_chord_shapes[chord_note + chord_triad + chord_embellish] = [[chord shape], index of root note]
    this.stationary_chord_shapes = {}

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

    // // Selecting the svg
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
    vis.inner_margin = 5;

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

    // Insert the moveable chord shapes
    vis.chord_shapes['Major'] = {
        '-' : [
            [[0, 0, 1, 2, 2, 0], 5],
            [[0, 2, 2, 2, 0, '-'], 4],
            [['-', -2, -3, -1, 0, '-'], 4],
            [[2, 3, 2, 0, '-', '-'], 3]
        ],
        '7' : [
            [[0, 0, 1, 1, 2, 0], 5],
            [[0, '-', 1, 1, 0, '-'], 5],
            [[0, 2, 1, 2, 0, '-'], 4],
            [[-3, -2, -1, 0, '-', '-'], 3],
            [[2, 2, 2, 0, '-', '-'], 3]
        ]
    }

    // Insert the stationary chord shapes
};

ChordSearch.prototype.updateEmbellish = function (value) {
    var vis = this;

    // Major, Minor, Dom_7, Sus, Diminished, Augmented
    var chord_embellish_map = {
        "Major" : ['-', '7'],
        "Minor" : ['-', '7'],
        "Dom_7": ['-'],
        'Sus': ['-', '2', '4'],
        'Diminished' : ['-', '7'],
        'Augmented' : ['-', '7']
    }

    if (value === '-') {document.getElementById("chord_embellish").innerHTML = "<option>-</option>";}
    else  {
        var options = "";
        for (var i = 0; i < chord_embellish_map[value].length; i++) {
            options += "<option>" + chord_embellish_map[value][i] + "</option>";}
        document.getElementById("chord_embellish").innerHTML = options;
    }
};

ChordSearch.prototype.updateVis = function () {
    var vis = this;

    // Move it all to the front
    vis.backdrop.moveToFront();
    vis.search.moveToFront();
    vis.search_text.moveToFront();

    // Updating the list of values
    vis.string_cal = [FretBoard.first,
                      FretBoard.second,
                      FretBoard.third,
                      FretBoard.fourth,
                      FretBoard.fifth,
                      FretBoard.sixth]

    // Function to see if the intervals between two strings equals integer i
    function interval (s1, s2, i) {return (scale_map[s2]+12-scale_map[s1])%12 === i}

    // If in standard tuning intervals
    if (interval(vis.string_cal[5], vis.string_cal[4], 5) && interval(vis.string_cal[4], vis.string_cal[3], 5) &&
        interval(vis.string_cal[3], vis.string_cal[2], 5) && interval(vis.string_cal[2], vis.string_cal[1], 4) &&
        interval(vis.string_cal[1], vis.string_cal[0], 5)) {

        vis.search_mode = true;

        var note = document.getElementById("chord_note").value;
        var triad = document.getElementById("chord_triad").value;
        var embellish = document.getElementById("chord_embellish").value;

        vis.showResults(note, triad, embellish)

    } else {
        // Move it all to the front
        vis.backdrop.moveToBack();
        vis.search.moveToBack();
        vis.search_text.moveToBack();

        // Update search_mode
        vis.search_mode = false
    }
};

ChordSearch.prototype.showResults = function(note, triad, embellish) {
    var vis = this;

    // Get the point in the scale
    var scale_map_note = scale_map[note];

    // Adding the stationary shapes
    if (vis.stationary_chord_shapes[note + triad + embellish] !== undefined) {
        shapes.push(vis.stationary_chord_shapes[note + triad + embellish])};

    // Getting the shapes in the form [..., [fret1, fret2, fret3, fret4, fret5, fret6], ...]
    var shapes_ = vis.chord_shapes[triad][embellish];
    var shapes = []
    for (var i = 0; i < shapes_.length; i++) {
        // For the shape, find out what to add to each number

        var s_v = scale_map[vis.string_cal[shapes_[i][1]]];

        if (scale_map_note >= s_v) {s_v = scale_map_note - s_v}
        else {s_v = 12 - s_v + scale_map_note}

        // Making the new shape form with the root at the correct fret
        var shape = [];
        for (var j = 0; j < 6; j++) {
            if (shapes_[i][0][j] !== '-') {
                shape.push(shapes_[i][0][j] + s_v)
            }
            else {shape.push('-')}
        }

        // Add the shape to shapes
        shapes.push(shape);
    }

    vis.buildResults(shapes, note, triad, embellish)
};

ChordSearch.prototype.clearResults = function() {
    var vis = this;

    // Turning search mode off
    vis.search_mode = false

    // Putting the search results below the saved terms
    vis.backdrop.moveToBack();
    vis.search.moveToBack();
    vis.search_text.moveToBack();

    // Removing the terms that won't be used again for sure
    vis.svg.selectAll(".chord_names_s").remove();
    vis.svg.selectAll(".chord_button_s").remove();
    vis.svg.selectAll(".chord_boxes_s").remove();
    vis.svg.selectAll(".chord_highlights_s").remove()
    for (var f = 0; f < 6; f++) {
        vis.svg.selectAll(".fret_bars_s" + f).remove();
        vis.svg.selectAll(".chord_string_s" + (f+1)).remove();
        vis.svg.selectAll(".chord_inlays_s" + f).remove();
        vis.svg.selectAll(".chord_inlays_s1" + f).remove();
        vis.svg.selectAll(".chord_inlays_s2" + f).remove();
        vis.svg.selectAll(".fret_text_s" + f).remove()
    }
};

ChordSearch.prototype.buildResults = function(shapes, note, triad, embellish) {
    var vis = this;

    // Updating the dimensions of the chord box
    var len = Math.max(vis.height, (vis.margin.box+vis.inner_margin*3 + vis.margin.names + vis.margin.text)*shapes.length + vis.inner_margin*4);

    vis.svg.attr("viewBox", vis.dim[0] + len);
    vis.backdrop.attr("height", len)

    // Adding the buttons you click
    var chord_button_s = vis.svg.selectAll(".chord_button_s")
        .data(shapes);

    chord_button_s.enter().append("rect")
        .attr("class", "chord_button_s")
        .merge(chord_button_s)
        .attr("x", vis.inner_margin)
        .attr("y", function (d, id) {
            return vis.margin.names * (id) + vis.margin.text*(id+1) + vis.inner_margin*2 + (vis.margin.box+vis.inner_margin*2)*(id);})
        .attr('width', vis.width - vis.inner_margin*2)
        .attr("height", vis.margin.text)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "lightgrey");

    chord_button_s.exit().remove();

    vis.svg.selectAll(".chord_button_s")
        .on("mouseover", function() {
            d3.select(this)
                .attr("fill", "green")
                .style("opacity", .75);
        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("fill", "lightgrey")
                .style("opacity", 1);
        })
        .on("click", function(d) {
            var c_c = d.map(String)
            var c_h = []
            for (var i = 0; i < 6; i++) {
                if (d[i] == '-') {c_h.push('-')}
                else {c_h.push("fb_f" + d[i] + "s" + (i+1))}
            }

            // Adding the value to the tab
            FretBoard.current_click = c_c;
            FretBoard.current_highlight = c_h;
            FretBoard.shiftReleased()

            // Clear the results
            vis.clearResults();

            // Getting the saved terms back
            Saved.updateVis()
        });

    // Adding the names for the chords
    var chord_names_s = vis.svg.selectAll(".chord_names_s")
        .data(shapes)

    chord_names_s.enter().append("text")
        .attr("class", "chord_names")
        .attr("x", vis.width/2)
        .attr("y", function (d, id) {
            return vis.margin.names * (id) + vis.margin.text*(id+1.5) + vis.inner_margin*2 + (vis.margin.box+vis.inner_margin*2)*(id) + vis.inner_margin*.5*id%1;})
        .attr("alignment-baseline", "middle")
        .text(function(d) {
            var triad_map = {
                "Major" : 'maj', "Minor" : 'min', "Dom_7" : "7", "Diminished": "dim", "Augmented": 'aug'
            }

            if (embellish == '-') {return note + triad_map[triad]}
            else {return note + triad_map[triad] + embellish}
        })
        .style("text-anchor", "middle");

    chord_names_s.exit().remove();

    // Adding boxes for the chords
    var chord_boxes_s = vis.svg.selectAll(".chord_boxes_s")
        .data(shapes)

    chord_boxes_s.enter().append("rect")
        .attr("class", "chord_boxes_s")
        .attr("x", vis.inner_margin)
        .attr("y", function (d, id) {
            return vis.margin.names * (id)+ vis.margin.text*(id+2) + vis.inner_margin*3 + (vis.margin.box+vis.inner_margin*2)*(id);})
        .attr('width', vis.width - vis.inner_margin*2)
        .attr("height", vis.margin.box)
        .attr("fill", "black");

    chord_boxes_s.exit().remove()

    for (var f = 0; f < 5; f++) {
        // Adding the frets
        var fret_bars_s = vis.svg.selectAll(".fret_bars_s" + f)
            .data(shapes)

        fret_bars_s.enter().append("rect")
            .attr("class", "fret_bars_s" + f)
            .attr("x", function(d) {return vis.inner_margin + ((vis.width-vis.inner_margin*2)/5) * f})
            .attr("y", function (d, id) {
                return vis.margin.names * (id) + vis.margin.text*(id+2) + vis.inner_margin*3 + (vis.margin.box+vis.inner_margin*2)*(id);})
            .attr("width", 3)
            .attr("height", vis.margin.box)
            .attr("fill", "silver")
            .style("opacity", .75);

        fret_bars_s.exit().remove()
    }

    // Adding the strings
    var strings = [1, 2, 3, 4, 5, 6]
    for (var i = 0; i < strings.length; i++) {
        var chord_string_s = vis.svg.selectAll(".chord_string_s" + strings[i].toString())
            .data(shapes)

        chord_string_s.enter().append("rect")
            .attr("class", "chord_string_s" + strings[i].toString())
            .attr("x", vis.inner_margin)
            .attr("y", function (d, id) {
                return vis.margin.names * (id) + (strings[i]*2 - 1) * (vis.margin.box/12) + vis.margin.text*(id+2) + vis.inner_margin*3 + (vis.margin.box+vis.inner_margin*2)*(id);})
            .attr('width', vis.width - vis.inner_margin*2)
            .attr("height", strings[i]*.5)
            .attr("fill", function() {
                if (i < 2) {return "silver"}
                else {return "goldenrod"}
            });

        chord_string_s.exit().remove()
    }

    // Add the inlays (not 12)
    var inlays = [3, 5, 7, 9, 15, 17, 19, 21];

    for (var i = 0; i < 5; i++) {
        var fret_inlays_s = vis.svg.selectAll(".chord_inlays_s" + i)
            .data(shapes);

        fret_inlays_s.enter().append("circle")
            .attr("class", "chord_inlays_s" + i)
            .attr("cy", function (d, id) {
                return (vis.margin.box * .5) + vis.margin.names * (id) + vis.margin.text*(id+2) + vis.inner_margin*3 + (vis.margin.box+vis.inner_margin*2)*(id);})
            .attr("cx", function(d) {return vis.inner_margin + ((vis.width-vis.inner_margin*2)/5) * (i+.5) + 1})
            .attr("r", function(d) {return 6.5* 4/5})
            .attr("fill", "white")
            .style("opacity", function(d) {
                var min = FretBoard.fret_count + 1
                for (var j = 0; j < 6; j++) {
                    if (d[j] !== '-') {min = Math.min(d[j], min)}
                }

                if (inlays.includes(min + i)) {return .9}
                else {return 0}
            });

        fret_inlays_s.exit().remove()

        var fret_inlays_s1 = vis.svg.selectAll(".chord_inlays_s1" + i)
            .data(shapes);

        fret_inlays_s1.enter().append("circle")
            .attr("class", "chord_inlays_s1" + i)
            .attr("cy", function (d, id) {
                return (vis.margin.box/3 * 1) + vis.margin.names * (id) + vis.margin.text*(id+2) + vis.inner_margin*3 + (vis.margin.box+vis.inner_margin*2)*(id);})
            .attr("cx", function(d) {return vis.inner_margin + ((vis.width-vis.inner_margin*2)/5) * (i+.5) + 1})
            .attr("r", function(d) {return 6.5* 4/5})
            .attr("fill", "white")
            .style("opacity", function(d) {
                var min = FretBoard.fret_count + 1
                for (var j = 0; j < 6; j++) {
                    if (d[j] !== '-') {min = Math.min(d[j], min)}
                }

                if (min + i == 12) {return .9}
                else {return 0}
            });

        fret_inlays_s1.exit().remove()

        var fret_inlays_s2 = vis.svg.selectAll(".chord_inlays_s2" + i)
            .data(shapes);

        fret_inlays_s1.enter().append("circle")
            .attr("class", "chord_inlays_s2" + i)
            .attr("cy", function (d, id) {
                return (vis.margin.box/3 * 2) + vis.margin.names * (id) + vis.margin.text*(id+2) + vis.inner_margin*3 + (vis.margin.box+vis.inner_margin*2)*(id);})
            .attr("cx", function(d) {return vis.inner_margin + ((vis.width-vis.inner_margin*2)/5) * (i+.5) + 1})
            .attr("r", function(d) {return 6.5* 4/5})
            .attr("fill", "white")
            .style("opacity", function(d) {
                var min = FretBoard.fret_count + 1
                for (var j = 0; j < 6; j++) {
                    if (d[j] !== '-') {min = Math.min(d[j], min)}
                }

                if (min + i == 12) {return .9}
                else {return 0}
            });

        fret_inlays_s2.exit().remove()
    }

    for (var i = 0; i < 5; i++) {
        // Add the text
        var fret_text_s = vis.svg.selectAll(".fret_text_s" + i)
            .data(shapes)

        fret_text_s.enter().append("text")
            .attr("class", "fret_text_s" + i)
            .attr("x", function(d) {return vis.inner_margin + ((vis.width-vis.inner_margin*2)/5) * (i+.5)})
            .attr("y", function (d, id) {
                return vis.margin.box + vis.inner_margin*1.5 + vis.margin.names * (id) + vis.margin.text*(id+2) + vis.inner_margin*3 + (vis.margin.box+vis.inner_margin*2)*(id);})
            .text(function(d) {
                var min = FretBoard.fret_count + 1
                for (var j = 0; j < 6; j++) {
                    if (d[j] !== '-') {min = Math.min(d[j], min)}
                }

                return min + i
            })
            .attr("font-size", 10)
            .attr("alignment-baseline", "middle")
            .style("text-anchor", "middle");

        fret_text_s.exit().remove()
    }

    for (var i = 0; i < shapes.length; i++) {
        // Getting the specific chord map
        var chord_map = shapes[i];

        var min = FretBoard.fret_count + 1
        for (var j = 0; j < 6; j++) {
            if (chord_map[j] !== '-') {min = Math.min(chord_map[j], min)}
        }

        // Making the chord info with a unique class
        var chord_highlights_s = vis.svg.selectAll(".chord_highlights_s" + i.toString())
            .data(shapes[i]);

        chord_highlights_s.enter().append("rect")
            .merge(chord_highlights_s)
            .attr("class", ".chord_highlights_s" + i.toString() + " chord_highlights_s")
            .attr("x", function(d) {
                if (d == '-') {return -50}
                else {
                    var x = d - min
                    return vis.inner_margin + (vis.width - vis.inner_margin * 2) / (5) * (x) + 3 * 5 / 5 + 2

                }
            })
            .attr("y", function (d, id) {
                return vis.margin.names * (i) + ((id+1)*2 - 1.5) * (vis.margin.box/12) + vis.margin.text*(i+2) + vis.inner_margin*2.5 + (vis.margin.box+vis.inner_margin*2)*(i);
            })
            .attr('width', (vis.width - vis.inner_margin*2)/(5) - 3*5/5 - 4)
            .attr("height", vis.margin.box/6 - 4)
            .attr("rx", 2)
            .attr("ry", 2)
            .attr("fill", "white")
            .style("opacity", .85);

        chord_highlights_s.exit().remove()
    }

};