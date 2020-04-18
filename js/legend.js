Legend = function(_parentElement) {
    this.parentElement = _parentElement;

    this.initVis();
};

Legend.prototype.initVis = function() {
    var vis = this;

    // Define the svg size
    vis.margin = {left: 0, right: 0, bottom: 0, top: 0}
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = FretBoard.height;

    // Creating the svg
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height)
        .attr("class", "legend");

    // Creating the backdrop rectangle
    vis.backdrop = vis.svg.append("rect")
        .attr("id", "legend_backdrop")
        .attr("x", vis.margin.left)
        .attr("y", vis.margin.top)
        .attr('width', vis.width)
        .attr("height", vis.height)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "#E8E8E8");

    // Adding the rectangles for each of the different features
    vis.inner_margin = 5

    vis.shift = vis.svg.append("rect")
        .attr("id", "legend_shift")
        .attr("x", vis.inner_margin)
        .attr("y", vis.inner_margin)
        .attr('width', vis.width - vis.inner_margin*2)
        .attr("height", vis.height/4 - vis.inner_margin)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "lightgrey");

    vis.svg.append("text")
        .attr("x", vis.width/2)
        .attr("y", vis.inner_margin + (vis.height/4 - vis.inner_margin)/2)
        .attr("alignment-baseline", "middle")
        .text("Chord (shift)")
        .style("text-anchor", "middle");

    vis.hammer = vis.svg.append("rect")
        .attr("id", "legend_h")
        .attr("x", vis.inner_margin)
        .attr("y", vis.inner_margin*2 + (vis.height-vis.inner_margin*5)/4)
        .attr('width', vis.width/2 - vis.inner_margin*1.5)
        .attr("height", (vis.height-vis.inner_margin)/4 - vis.inner_margin)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "lightgrey");

    vis.svg.append("text")
        .attr("x", vis.inner_margin + (vis.width/2 - vis.inner_margin*1.5)/2)
        .attr("y", vis.inner_margin*2 + (vis.height-vis.inner_margin*5)/4 + (vis.height/4 - vis.inner_margin)/2)
        .attr("alignment-baseline", "middle")
        .text("h")
        .style("text-anchor", "middle");

    vis.pull = vis.svg.append("rect")
        .attr("id", "legend_p")
        .attr("x", vis.width/2 + vis.inner_margin*.5)
        .attr("y", vis.inner_margin*2 + (vis.height-vis.inner_margin*5)/4)
        .attr('width', vis.width/2 - vis.inner_margin*1.5)
        .attr("height", (vis.height-vis.inner_margin)/4 - vis.inner_margin)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "lightgrey");

    vis.svg.append("text")
        .attr("x", vis.width/2 + vis.inner_margin*.5 + (vis.width/2 - vis.inner_margin*1.5) *.5)
        .attr("y", vis.inner_margin*2 + (vis.height-vis.inner_margin*5)/4 + (vis.height/4 - vis.inner_margin)/2)
        .attr("alignment-baseline", "middle")
        .text("p")
        .style("text-anchor", "middle");

    vis.slide_up = vis.svg.append("rect")
        .attr("id", "legend_su")
        .attr("x", vis.inner_margin)
        .attr("y", vis.inner_margin*3 + 2*(vis.height-vis.inner_margin*5)/4)
        .attr('width', vis.width/2 - vis.inner_margin*1.5)
        .attr("height", (vis.height-vis.inner_margin)/4 - vis.inner_margin)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "lightgrey");

    vis.svg.append("text")
        .attr("x", vis.inner_margin + (vis.width/2 - vis.inner_margin*1.5)/2)
        .attr("y", vis.inner_margin*3 + 2*(vis.height-vis.inner_margin*5)/4 +
                   ((vis.height-vis.inner_margin)/4 - vis.inner_margin)/2)
        .attr("alignment-baseline", "middle")
        .text("/")
        .style("text-anchor", "middle");

    vis.slide_down = vis.svg.append("rect")
        .attr("id", "legend_sd")
        .attr("x", vis.width/2 + vis.inner_margin*.5)
        .attr("y", vis.inner_margin*3 + 2*(vis.height-vis.inner_margin*5)/4)
        .attr('width', vis.width/2 - vis.inner_margin*1.5)
        .attr("height", (vis.height-vis.inner_margin)/4 - vis.inner_margin)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "lightgrey");

    vis.svg.append("text")
        .attr("x", vis.width/2 + vis.inner_margin*.5 + (vis.width/2 - vis.inner_margin*1.5) *.5)
        .attr("y", vis.inner_margin*3 + 2*(vis.height-vis.inner_margin*5)/4 +
            ((vis.height-vis.inner_margin)/4 - vis.inner_margin)/2)
        .attr("alignment-baseline", "middle")
        .text("\\")
        .style("text-anchor", "middle");

    vis.bend = vis.svg.append("rect")
        .attr("id", "legend_b")
        .attr("x", vis.inner_margin)
        .attr("y", vis.inner_margin*4 + 3*(vis.height-vis.inner_margin*5)/4)
        .attr('width', vis.width/2 - vis.inner_margin*1.5)
        .attr("height", (vis.height-vis.inner_margin)/4 - vis.inner_margin)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "lightgrey");

    vis.svg.append("text")
        .attr("x", vis.inner_margin + (vis.width/2 - vis.inner_margin*1.5)/2)
        .attr("y", vis.inner_margin*4 + 3*(vis.height-vis.inner_margin*5)/4 +
            ((vis.height-vis.inner_margin)/4 - vis.inner_margin)/2)
        .attr("alignment-baseline", "middle")
        .text("b")
        .style("text-anchor", "middle");

    vis.release = vis.svg.append("rect")
        .attr("id", "legend_r")
        .attr("x", vis.width/2 + vis.inner_margin*.5)
        .attr("y", vis.inner_margin*4 + 3*(vis.height-vis.inner_margin*5)/4)
        .attr('width', vis.width/2 - vis.inner_margin*1.5)
        .attr("height", (vis.height-vis.inner_margin)/4 - vis.inner_margin)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "lightgrey");

    vis.svg.append("text")
        .attr("x", vis.width/2 + vis.inner_margin*.5 + (vis.width/2 - vis.inner_margin*1.5) *.5)
        .attr("y", vis.inner_margin*4 + 3*(vis.height-vis.inner_margin*5)/4 +
            ((vis.height-vis.inner_margin)/4 - vis.inner_margin)/2)
        .attr("alignment-baseline", "middle")
        .text("r")
        .style("text-anchor", "middle");

    vis.UpdateVis()
};

Legend.prototype.UpdateVis = function() {
    var vis = this;

    vis.shift.on("click", function() {
        multiple =  !multiple;

        toggle_off(vis.hammer); hammer_on = false;
        toggle_off(vis.pull); pull_off = false;
        toggle_off(vis.slide_up); slide_up = false;
        toggle_off(vis.slide_down); slide_down = false;
        toggle_off(vis.bend); bend = false;
        toggle_off(vis.release); release = false;

        if (multiple === false) {
            vis.shift.attr("fill", "lightgrey").style("opacity", 1);
            if (FretBoard.current_click.join('') !== "------") {
                FretBoard.shiftReleased()}
        } else {vis.shift.attr("fill", "green").style("opacity", .75);}
    })

    vis.hammer.on("click", function() {
        if (!multiple) {
            hammer_on = !hammer_on;

            toggle_off(vis.pull); pull_off = false;
            toggle_off(vis.slide_up); slide_up = false;
            toggle_off(vis.slide_down); slide_down = false;
            toggle_off(vis.bend); bend = false;
            toggle_off(vis.release); release = false;

            if (hammer_on === false) {
                vis.hammer.attr("fill", "lightgrey").style("opacity", 1);
                FretBoard.current_tone = "-";
            } else {
                FretBoard.current_tone = "h";
                vis.hammer.attr("fill", "green").style("opacity", .75);
            }
        }
    });

    vis.pull.on("click", function() {
        if (!multiple) {
            pull_off = !pull_off;

            toggle_off(vis.hammer); hammer_on = false;
            toggle_off(vis.slide_up); slide_up = false;
            toggle_off(vis.slide_down); slide_down = false;
            toggle_off(vis.bend); bend = false;
            toggle_off(vis.release); release = false;

            if (pull_off === false) {
                vis.pull.attr("fill", "lightgrey").style("opacity", 1);
                FretBoard.current_tone = "-";
            } else {
                FretBoard.current_tone = "h";
                vis.pull.attr("fill", "green").style("opacity", .75);
            }
        }
    });

    vis.slide_up.on("click", function() {
        if (!multiple) {
            slide_up = !slide_up;

            toggle_off(vis.hammer); hammer_on = false;
            toggle_off(vis.pull); pull_off = false;
            toggle_off(vis.slide_down); slide_down = false;
            toggle_off(vis.bend); bend = false;
            toggle_off(vis.release); release = false;

            if (slide_up === false) {
                vis.slide_up.attr("fill", "lightgrey").style("opacity", 1);
                FretBoard.current_tone = "-";
            } else {
                vis.slide_up.attr("fill", "green").style("opacity", .75);
                FretBoard.current_tone = "/";
            }
        }
    });

    vis.slide_down.on("click", function() {
        if (!multiple) {
            slide_down = !slide_down;

            toggle_off(vis.hammer); hammer_on = false;
            toggle_off(vis.pull); pull_off = false;
            toggle_off(vis.slide_up); slide_up = false;
            toggle_off(vis.bend); bend = false;
            toggle_off(vis.release); release = false;

            if (slide_down === false) {
                vis.slide_down.attr("fill", "lightgrey").style("opacity", 1);
                FretBoard.current_tone = "-";
            } else {
                vis.slide_down.attr("fill", "green").style("opacity", .75);
                FretBoard.current_tone = "\\";
            }
        }
    });

    vis.bend.on("click", function() {
        if (!multiple) {
            bend = !bend;

            toggle_off(vis.hammer); hammer_on = false;
            toggle_off(vis.pull); pull_off = false;
            toggle_off(vis.slide_up); slide_up = false;
            toggle_off(vis.slide_down); slide_down = false;
            toggle_off(vis.release); release = false;

            if (bend === false) {
                vis.bend.attr("fill", "lightgrey").style("opacity", 1);
                FretBoard.current_tone = "-";
            } else {
                vis.bend.attr("fill", "green").style("opacity", .75);
                FretBoard.current_tone = "b";
            }
        }
    });

    vis.release.on("click", function() {
        if (!multiple) {
            release = !release;

            toggle_off(vis.hammer); hammer_on = false;
            toggle_off(vis.pull); pull_off = false;
            toggle_off(vis.slide_up); slide_up = false;
            toggle_off(vis.bend); bend = false;
            toggle_off(vis.slide_down); slide_down = false;

            if (release === false) {
                vis.release.attr("fill", "lightgrey").style("opacity", 1);
                FretBoard.current_tone = "-";
            } else {
                vis.release.attr("fill", "green").style("opacity", .75);
                FretBoard.current_tone = "r";
            }
        }
    });
};