/* main JS file */

makeFredBoard();

// Helpfull functions and lists
var scale_map = {C : 1, Db: 2, D: 3, Eb: 4, E: 5, e: 5, F: 6, Gb: 7, G: 8, Ab: 9, A: 10, Bb: 11, B: 12};
var string_list;
var tab_memory;

// Creating the intervals for major, minor, (can easily add more)
var major = [true, false, true, false, true, true, false, true, false, true, false, true]
var minor = [true, false, true, true, false, true, false, true, true, false, true, false]

// Create variables for keys
var multiple = false;
var hammer_on = false;
var pull_off = false;
var slide_up = false;
var slide_down = false;
var bend = false;
var release = false;
var space = false;

// Create an array to remember saved chords
var saved_chords = [];
var saved_chords_map = [];

document.addEventListener("keydown", keyPressed, false);

// Helper function to toggle everything off
function toggle_off (a) {
    a.attr("fill", "lightgrey").style("opacity", 1);
}

function keyPressed(event) {
    // Save a chord
    if (event['key'] === "s" && multiple) {
        // Add the new chord to saved chords
        if (! saved_chords.includes(FretBoard.current_click.join(""))) {
            Saved.saveChord()
        }
    }

    else if (event['key'] == "c") {
        // Clear the saved chords
        if (confirm("Do you want to clear your saved chords?") == true) {
            Saved.clearChord()
        }
    }

    // Legend key events
    else if (event['key'] === "Shift") {
        multiple =  !multiple;

        toggle_off(Legend.hammer); hammer_on = false;
        toggle_off(Legend.pull); pull_off = false;
        toggle_off(Legend.slide_up); slide_up = false;
        toggle_off(Legend.slide_down); slide_down = false;
        toggle_off(Legend.bend); bend = false;
        toggle_off(Legend.release); release = false;

        if (multiple === false) {
            Legend.shift.attr("fill", "lightgrey").style("opacity", 1);
            if (FretBoard.current_click.join('') !== "------") {
                FretBoard.shiftReleased()}
        } else {Legend.shift.attr("fill", "green").style("opacity", .75);}
    }

    // Move cursor
    else if (event['key'] === 'ArrowLeft') {
        if (Tab.counter > 0) {
            Tab.counter -= 2;
            Tab.MarkerMove()
        }
    }
    else if (event['key'] === 'ArrowRight') {
        if (Tab.counter < tab_memory[0].length) {
            Tab.counter += 2;
            Tab.MarkerMove()
        }
    }

    else if (!multiple) {
        if (event['key'] === "h") {
            hammer_on = !hammer_on;

            toggle_off(Legend.pull); pull_off = false;
            toggle_off(Legend.slide_up); slide_up = false;
            toggle_off(Legend.slide_down); slide_down = false;
            toggle_off(Legend.bend); bend = false;
            toggle_off(Legend.release); release = false;

            if (hammer_on === false) {
                Legend.hammer.attr("fill", "lightgrey").style("opacity", 1);
                FretBoard.current_tone = "-";
            } else {
                FretBoard.current_tone = "h";
                Legend.hammer.attr("fill", "green").style("opacity", .75);
            }
        } else if (event['key'] === "p") {
            pull_off = !pull_off

            toggle_off(Legend.hammer); hammer_on = false;
            toggle_off(Legend.slide_up); slide_up = false;
            toggle_off(Legend.slide_down); slide_down = false;
            toggle_off(Legend.bend); bend = false;
            toggle_off(Legend.release); release = false;

            if (pull_off === false) {
                Legend.pull.attr("fill", "lightgrey").style("opacity", 1);
                FretBoard.current_tone = "-";
            } else {
                Legend.pull.attr("fill", "green").style("opacity", .75);
                FretBoard.current_tone = "p";
            }
        } else if (event['key'] === "/") {
            slide_up = !slide_up

            toggle_off(Legend.hammer); hammer_on = false;
            toggle_off(Legend.pull); pull_off = false;
            toggle_off(Legend.slide_down); slide_down = false;
            toggle_off(Legend.bend); bend = false;
            toggle_off(Legend.release); release = false;

            hammer_on = false;
            pull_off = false;
            slide_down = false;
            bend = false;
            release = false;
            if (slide_up === false) {
                Legend.slide_up.attr("fill", "lightgrey").style("opacity", 1);
                FretBoard.current_tone = "-";
            } else {
                Legend.slide_up.attr("fill", "green").style("opacity", .75);
                FretBoard.current_tone = "/";
            }
        } else if (event['key'] === "\\") {
            slide_down = !slide_down

            toggle_off(Legend.hammer); hammer_on = false;
            toggle_off(Legend.pull); pull_off = false;
            toggle_off(Legend.slide_up); slide_up = false;
            toggle_off(Legend.bend); bend = false;
            toggle_off(Legend.release); release = false;

            if (slide_down === false) {
                Legend.slide_down.attr("fill", "lightgrey").style("opacity", 1);
                FretBoard.current_tone = "-";
            } else {
                Legend.slide_down.attr("fill", "green").style("opacity", .75);
                FretBoard.current_tone = "\\";
            }
        } else if (event['key'] === "b") {
            bend = !bend

            toggle_off(Legend.hammer); hammer_on = false;
            toggle_off(Legend.pull); pull_off = false;
            toggle_off(Legend.slide_up); slide_up = false;
            toggle_off(Legend.slide_down); slide_down = false;
            toggle_off(Legend.release); release = false;

            if (bend === false) {
                Legend.bend.attr("fill", "lightgrey").style("opacity", 1);
                FretBoard.current_tone = "-";
            } else {
                Legend.bend.attr("fill", "green").style("opacity", .75);
                FretBoard.current_tone = "b";
            }
        } else if (event['key'] === "r") {
            release = !release

            toggle_off(Legend.hammer); hammer_on = false;
            toggle_off(Legend.pull); pull_off = false;
            toggle_off(Legend.slide_up); slide_up = false;
            toggle_off(Legend.slide_down); slide_down = false;
            toggle_off(Legend.bend); bend = false;

            if (release === false) {
                Legend.release.attr("fill", "lightgrey").style("opacity", 1);
                FretBoard.current_tone = "-";
            } else {
                Legend.release.attr("fill", "green").style("opacity", .75);
                FretBoard.current_tone = "r";
            }
        }

        // Space and delete
        else if (event['key'] === " ") {
            space = true;
            FretBoard.shiftReleased()
            space = false;
        } else if (event['key'] === "Backspace") {
            if (Tab.counter > 1) {
                for (var i = 0; i < 6; i++) {
                    tab_memory[i].splice(Tab.counter, 1);
                    tab_memory[i].splice(Tab.counter - 1, 1);
                }
                Tab.counter = Tab.counter - 2
                Tab.TabAddition()
            } else if (Tab.counter === 1) {
                for (var i = 0; i < 6; i++) {
                    tab_memory[i].splice(Tab.counter, 1);
                }
                Tab.counter = Tab.counter - 1
                Tab.TabAddition()
            }
        }
    }
}

function makeFredBoard() {
     FretBoard = new FretBoard("fretboard");
     Legend = new Legend("legend")
     Tab = new Tab("tab", FretBoard);
     Saved = new Saved("saved", FretBoard);
}