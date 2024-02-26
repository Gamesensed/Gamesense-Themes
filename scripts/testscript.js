(function() {
    let script = GST.registerScript("Test Script", "https://test.link/hello/script.js", "Nexxed", "1.0.0")

    script.addButton("A test button", "A button that's made for testing", "Test", function() {
        console.log("click!")
    })

    script.addTextBox("A test textbox", "A textbox that's made for testing", false, "Test", function(value) {
        console.log("textbox changed", value)
    })

    let options = [ "Option 1", "Option 2" ]
    script.addDropdown("A test dropdown", "A dropdown that's made for testing", 0, options, function(value) {
        console.log("dropdown changed", options[value])
    })
    script.addComboBox("A test combobox", "A combobox that's made for testing", [], options, function(values) {
        console.log("combobox changed", values)
    })

})()