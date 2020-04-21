function downloadasTextFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// Start file download.
document.getElementById("dwn-btn").addEventListener("click", function(){
    if (!help) {

        var export_name = prompt("Name your tab:");
        if (export_name != null) {

            // Generate download of export_name.txt file with some content
            var text = "export_name:\n\n";

            for (var i = 0; i < Tab.tab_memory_string[0].length; i++) {
                for (var j = 0; j < 6; j++) {
                    if (j < 5) {
                        text += Tab.tab_memory_string[j][i] + '\n'
                    } else {
                        text += Tab.tab_memory_string[j][i] + '\n\n'
                    }

                }
            }

            var filename = export_name + ".txt";

            downloadasTextFile(filename, text);
        }
    }
}, false);

