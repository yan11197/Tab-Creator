// Start import
document.getElementById("imp-btn").addEventListener("click", function(){
    if (!help) {

        var user_tab = prompt("Paste your tab here:");
        if (user_tab != null) {

            // Clearing the current tab
            Tab.clearTab();
            Tab.TabAddition()

            // Cleaning the tab from the user input
            var raw_tab = user_tab.split("\n");
            var clean_tab = [];
            for (var i = 0; i < raw_tab.length; i++) {
                if(raw_tab[i].length >= 3 && raw_tab[i][2] == '|') {
                    clean_tab.push(raw_tab[i].slice(2).split(""));
                }
            }

            // Updating the tab memory and the marker
            tab_memory = clean_tab;
            Tab.counter = clean_tab[0].length - 1;
            Tab.MarkerMove()
            Tab.TabAddition()
        }
    }
}, false);