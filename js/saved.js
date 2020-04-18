Saved = function(_parentElement, _fretboard) {
    this.parentElement = _parentElement;
    this.fretboard = _fretboard;
    this.dim = ["", 0];
    this.fret_data = [];

    this.initVis();
};

Saved.prototype.initVis = function() {
    var vis = this;

    // Define the svg size
    vis.margin = {left: 0, right: 0, bottom: 0, top: 0, box: 105, text: 25, names: 15}
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;
    vis.dim = ["0, 0," + (vis.width + vis.margin.left + vis.margin.right).toString() + ",", vis.height.toString()]

    // Creating the svg
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("viewBox", vis.dim[0] + vis.dim[1].toString())
        .attr("id", "saved_svg")

    // Creating the backdrop rectangle
    vis.backdrop = vis.svg.append("rect")
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

    vis.shift = vis.svg.append("rect")
        .attr("id", "legend_shift")
        .attr("x", vis.inner_margin)
        .attr("y", vis.inner_margin)
        .attr('width', vis.width - vis.inner_margin*2)
        .attr("height", vis.margin.text)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "lightgrey");

    vis.svg.append("text")
        .attr("x", vis.width/2)
        .attr("y", vis.inner_margin + vis.margin.text/2)
        .attr("alignment-baseline", "middle")
        .text("Saved Chords")
        .style("text-anchor", "middle");
};


Saved.prototype.saveChord = function() {
    var vis = this;

    var chord = prompt("Enter chord name:")
    if (chord != null) {

        // Getting the chord number
        var chord_number = saved_chords.length;

        // Adding to the saved_chords
        saved_chords.push(FretBoard.current_click.join(""));

        // Adding to fret_data
        var fret_min = FretBoard.fret_count+1;
        var fret_max = -1;
        for (var i = 0; i < 6; i++) {
            var fret_num = parseInt(FretBoard.current_click[i]);
            if (!isNaN(fret_num)) {
                fret_min = Math.min(fret_min, fret_num)
                fret_max = Math.max(fret_max, fret_num)
            }
        }

        // Getting the number of frets used (minimum 4)
        var number_of_frets = Math.max(4, fret_max-fret_min+1)

        // Adding to saved_chords_map 1. chord name 2. chord as numbers 3. chord as id's 4. min fret 5. number of frets
        saved_chords_map.push([chord, [...FretBoard.current_click], FretBoard.current_highlight, fret_min, number_of_frets])


        // Pushing the (1. Chord Number, 2. Fret Number (0-n), 3. Total number of frets, 4. Minimum value
        for (var j = 0; j < number_of_frets; j++) {
            vis.fret_data.push([chord_number, j, number_of_frets, fret_min])
        }

        vis.updateVis();
    }
};

Saved.prototype.updateVis = function() {
    var vis = this;

    // Remove all the highlighted notes
    vis.svg.selectAll(".chord_highlights").remove();

    // Updating the dimensions of the chord box
    var len = Math.max(vis.height, (vis.margin.box+vis.inner_margin*3 + vis.margin.names + vis.margin.text)*saved_chords.length + vis.inner_margin*4);

    vis.svg.attr("viewBox", vis.dim[0] + len)
    vis.backdrop.attr("height", len)

    // Adding the buttons you click
    var chord_button = vis.svg.selectAll(".chord_button")
        .data(saved_chords_map);

    chord_button.enter().append("rect")
        .attr("class", "chord_button")
        .merge(chord_button)
        .attr("x", vis.inner_margin)
        .attr("y", function (d, id) {
            return vis.margin.names * (id) + vis.margin.text*(id+1) + vis.inner_margin*2 + (vis.margin.box+vis.inner_margin*2)*(id);})
        .attr('width', vis.width - vis.inner_margin*2)
        .attr("height", vis.margin.text)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "lightgrey");

    chord_button.exit().remove();

    vis.svg.selectAll(".chord_button")
        .on("mouseover", function() {
            d3.select(this)
                .attr("fill", "white")
                .style("opacity", .75);
        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("fill", "lightgrey")
                .style("opacity", 1);
        })
        .on("click", function(d) {
            console.log(FretBoard.current_click);
            console.log(FretBoard.current_highlight);

            FretBoard.current_click = d[1];
            FretBoard.current_highlight = d[2];
            FretBoard.shiftReleased()
        });

    // Adding the names for the chords
    var chord_names = vis.svg.selectAll(".chord_names")
        .data(saved_chords_map)

    chord_names.enter().append("text")
        .attr("class", "chord_names")
        .attr("x", vis.width/2)
        .attr("y", function (d, id) {
            return vis.margin.names * (id) + vis.margin.text*(id+1.5) + vis.inner_margin*2 + (vis.margin.box+vis.inner_margin*2)*(id) + vis.inner_margin*.5*id%1;})
        .attr("alignment-baseline", "middle")
        .text(function(d) {return d[0]})
        .style("text-anchor", "middle");

    chord_names.exit().remove();

    // Adding boxes for the chords
    var chord_boxes = vis.svg.selectAll(".chord_boxes")
        .data(saved_chords_map)

    chord_boxes.enter().append("rect")
        .attr("class", "chord_boxes")
        .attr("x", vis.inner_margin)
        .attr("y", function (d, id) {
            return vis.margin.names * (id)+ vis.margin.text*(id+2) + vis.inner_margin*3 + (vis.margin.box+vis.inner_margin*2)*(id);})
        .attr('width', vis.width - vis.inner_margin*2)
        .attr("height", vis.margin.box)
        .attr("fill", "black");

    chord_boxes.exit().remove()

    // Adding the frets
    var fret_bars = vis.svg.selectAll(".fret_bars")
        .data(vis.fret_data)

    fret_bars.enter().append("rect")
        .attr("class", "fret_bars")
        .attr("x", function(d) {return vis.inner_margin + ((vis.width-vis.inner_margin*2)/d[2]) * d[1]})
        .attr("y", function (d) {
            return vis.margin.names * (d[0]) + vis.margin.text*(d[0]+2) + vis.inner_margin*3 + (vis.margin.box+vis.inner_margin*2)*(d[0]);})
        .attr("width", function(d) {return 3*5/d[2]})
        .attr("height", vis.margin.box)
        .attr("fill", "silver")
        .style("opacity", .75);

    fret_bars.exit().remove();

    // Adding the strings
    var strings = [1, 2, 3, 4, 5, 6]
    for (var i = 0; i < strings.length; i++) {
        var chord_string = vis.svg.selectAll(".chord_string" + strings[i].toString())
            .data(saved_chords_map)

        chord_string.enter().append("rect")
            .attr("class", "chord_string" + strings[i].toString())
            .attr("x", vis.inner_margin)
            .attr("y", function (d, id) {
                return vis.margin.names * (id) + (strings[i]*2 - 1) * (vis.margin.box/12) + vis.margin.text*(id+2) + vis.inner_margin*3 + (vis.margin.box+vis.inner_margin*2)*(id);})
            .attr('width', vis.width - vis.inner_margin*2)
            .attr("height", strings[i]*.5)
            .attr("fill", function() {
                if (i < 2) {return "silver"}
                else {return "goldenrod"}
            });

        chord_string.exit().remove()
    }

    // Add the inlays (not 12)
    var inlays = [3, 5, 7, 9, 15, 17, 19, 21];

    var fret_inlays = vis.svg.selectAll(".chord_inlays")
        .data(vis.fret_data);

    fret_inlays.enter().append("circle")
        .attr("class", "chord_inlays")
        .attr("cy", function (d) {
            return (vis.margin.box * .5) + vis.margin.names * (d[0]) + vis.margin.text*(d[0]+2) + vis.inner_margin*3 + (vis.margin.box+vis.inner_margin*2)*(d[0]);})
        .attr("cx", function(d) {return vis.inner_margin + ((vis.width-vis.inner_margin*2)/d[2]) * (d[1]+.5) + 1})
        .attr("r", function(d) {return 6.5* 4/d[2]})
        .attr("fill", "white")
        .style("opacity", function(d) {
           if (inlays.includes(d[3] + d[1])) {return .9}
           else {return 0}
        });

    fret_inlays.exit().remove()

    // Add the inlays (12)
    for (var i = 1; i < 3; i++) {
        var fret_inlays_12 = vis.svg.selectAll(".chord_inlays" + i.toString())
            .data(vis.fret_data)

        fret_inlays_12.enter().append("circle")
            .attr("class", "chord_inlays" + i.toString())
            .attr("cy", function (d) {
                return (vis.margin.box/3* i) + vis.margin.names * (d[0]) + vis.margin.text*(d[0]+2) + vis.inner_margin*3 + (vis.margin.box+vis.inner_margin*2)*(d[0]);})
            .attr("cx", function(d) {return vis.inner_margin + ((vis.width-vis.inner_margin*2)/d[2]) * (d[1]+.5) + 1})
            .attr("r", function(d) {return 6.5* 4/d[2]})
            .attr("fill", "white")
            .style("opacity", function(d) {
                if (d[3] + d[1] == 12) {return .9}
                else {return 0}
            });

        fret_inlays.exit().remove()
    }

    // Add the text
    var fret_text = vis.svg.selectAll(".fret_text")
        .data(vis.fret_data)

    fret_text.enter().append("text")
        .attr("class", "fret_text")
        .attr("x", function(d) {return vis.inner_margin + ((vis.width-vis.inner_margin*2)/d[2]) * (d[1]+.5)})
        .attr("y", function (d) {
            return vis.margin.box + vis.inner_margin*1.5 + vis.margin.names * (d[0]) + vis.margin.text*(d[0]+2) + vis.inner_margin*3 + (vis.margin.box+vis.inner_margin*2)*(d[0]);})
        .text(function(d) {
            var val = d[1] + d[3];
            if (val < d[2] + d[3]) {return val.toString()}
        })
        .attr("font-size", 10)
        .attr("alignment-baseline", "middle")
        .style("text-anchor", "middle");

    fret_text.exit().remove()

    // Add the highlighted notes

    // Iterate through all the chords
    for (var i = 0; i < saved_chords_map.length; i++) {
        // Getting the specific chord map
        var chord_map = saved_chords_map[i];

        // Making the chord info with a unique class
        var chord_highlights = vis.svg.selectAll(".chord_highlights" + i.toString())
            .data(saved_chords_map[i][1]);

        chord_highlights.enter().append("rect")
            .merge(chord_highlights)
            .attr("class", ".chord_highlights" + i.toString() + " chord_highlights")
            .attr("x", function(d) {
                var fret_val = parseInt(d);
                if (!isNaN(fret_val)) {
                    return vis.inner_margin + (vis.width - vis.inner_margin * 2) / (chord_map[4]) * (fret_val - chord_map[3]) + 3 * 5 / chord_map[4] + 2
                } else {
                    return -50
                }
            })
            .attr("y", function (d, id) {
                return vis.margin.names * (i) + ((id+1)*2 - 1.5) * (vis.margin.box/12) + vis.margin.text*(i+2) + vis.inner_margin*2.5 + (vis.margin.box+vis.inner_margin*2)*(i);
            })
            .attr('width', (vis.width - vis.inner_margin*2)/(chord_map[4]) - 3*5/chord_map[4] - 4)
            .attr("height", vis.margin.box/6 - 4)
            .attr("rx", 2)
            .attr("ry", 2)
            .attr("fill", "white")
            .style("opacity", .85);

        chord_highlights.exit().remove()
    }
};

Saved.prototype.clearChord = function () {
    var vis = this;

    vis.dim = ["0, 0," + (vis.width + vis.margin.left + vis.margin.right).toString() + ",", vis.height.toString()];
    vis.fret_data = [];
    saved_chords = [];
    saved_chords_map = [];

    // Remove all the highlighted notes
    vis.svg.selectAll(".chord_highlights").remove();

    vis.updateVis()
};
