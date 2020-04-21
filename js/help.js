Help = function(_parentElement, _fretboard) {
    this.parentElement = _parentElement;
    this.font_width = Tab.font_width;
    this.font_height = 17;

    this.initVis();
};

Help.prototype.initVis = function() {
    var vis = this;

    // Define the svg size
    vis.margin = {left: 0, right: 0, bottom: 0, top: 20};
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#tab_svg")

    vis.max_length = Math.floor((vis.width-vis.font_width*5)/vis.font_width);

    vis.createHelp()
};

Help.prototype.createHelp = function () {
    var vis = this;

    // Change the color and opacity
    document.getElementById("help_button").style.background = "green";
    document.getElementById("help_button").style.opacity = "0.75";

    // Create a counter for the text
    vis.counter = 0;

    vis.text =
        [
            "Key Specification: ",
            "- Pick a key from the selectors above to denote on the fretboard which notes are in that key ",
            "- Click the 1, 3, and 5 buttons to highlight the key's root, third, and fifth. ",
            " ",
            "Tab Creation: ",
            "- Press highlighted fret to add it to the tab ",
            "- To navigate throughout your tab use the left and right arrow keys and command to engage and disengage fast scrolling ",
            "- Use delete and space to delete notes and add rests respectively ",
            " ",
            "Toolbox: ",
            "- For hammerons, pulloffs, slides, bends, and releases press h, p, /, , b, and r respectively ",
            "- Once you pick the next note it will be inserted correctly in the tab ",
            "- For chords press the shift key, click all the notes you wish to add, then press again to add the chord to the tab ",
            " ",
            "Saved Chords: ",
            "- While in chord mode press s to save out the chord ",
            "- Insert the chord's name and it will appear on the right ",
            "- Click the label above the chord visualization to insert the chord ",
            "- To clear your saved chords press c ",
            " ",
            "Chord Search: ",
            "- On the top right corner, use the drop downs to specify a chord ",
            "- Once specified press enter to return a list of different chord voicings for that chord ",
            "- Select a chord and continue ",
            "- Warning: only chords inputted for standard interval tuning ",
            " ",
            "Help: ",
            "- To gain access to or remove these helpful instructions, press q or click the help button "
        ];

    vis.bolded = [0, 4, 9, 14, 20, 26];

    // Creating the backround
    vis.backdrop = vis.svg.append("rect")
        .attr("class", "help_text")
        .attr("id", "help_backdrop")
        .attr("x", 0)
        .attr("y", 0)
        .attr('width', vis.width)
        .attr('height', vis.height)
        .attr("fill", "white");

    for (var i = 0; i < vis.text.length; i++) {
        // Splitting the text
        var split_text = splitString(vis.text[i], vis.max_length);

        // Adding the text
        for (var j = 0; j < split_text.length; j++) {
            vis.svg.append("text")
                .attr("class", "help_text")
                .attr("x", function() {
                    if (j == 0) {return 10}
                    else {return 10 + vis.font_width*2}
                })
                .attr("font-weight", function(d) {
                    if (vis.bolded.includes(i)) {return "bold"}
                    else {return "normal"}
                })
                .attr("y", 10 + vis.font_height * vis.counter)
                .text(function() {
                    if (split_text[j].slice(-1) == ' ') {return split_text[j]}
                    else {return split_text[j] + '-'}
                });

            vis.counter += 1
        }
    }

    // Adjusting the heights
    vis.svg.attr("height", function(d) {
        return Math.max(vis.height, (vis.font_height+1) * vis.counter)
    });

    vis.backdrop.attr("height", function(d) {
        return Math.max(vis.height, (vis.font_height+1) * vis.counter)
    })
};

Help.prototype.removeHelp = function () {
    var vis = this;

    // Change the color back
    document.getElementById("help_button").style.background = "#E8E8E8";
    document.getElementById("help_button").style.opacity = "1";

    // Remove everything
    vis.svg.selectAll(".help_text").remove();
    vis.svg.attr("height", vis.height);
};

Help.prototype.swapHelp = function () {
  var vis = this;

  help = !help

  if (help) {vis.createHelp()}
  else {vis.removeHelp()}

};