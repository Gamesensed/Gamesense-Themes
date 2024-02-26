# Custom Gamesense Settings
A GreaseMonkey userscript for managing themes and scripts on https://gamesense.pub/

# Scripting API
## Documentation
The new scripting API introduces an API style similar to immediate-mode libraries.
It allows you to create dynamic UI elements with callbacks for when the user interacts with them.

Below is a list of functions that are accessible after registering your script, and the arguments they take. (See the below example on creating a script).
```js
// Adding a button
script.addButton(
    name,           // The setting/option name
    description,    // The description text (optional with falsey value)
    label,          // The text to display on the button
    callback        // The function that is called when the user clicks the button
)

// Adding a textbox
script.addTextBox(
    name,           // The setting/option name
    description,    // The description text (optional with falsey value)
    placeholder,    // The placeholder text for the input (optional with falsey value)
    value,          // The default value (can be used in combination with localStorage for persistence)
    callback        // The function that is called when the user changes the input, with an argument for the new value
)

// Adding a dropdown (single-select)
script.addDropdown(
    name,           // The setting/option name
    description,    // The description text (optional with falsey value)
    value,          // An array of options (strings) for the dropdown
    options,        // The default value (can be used in combination with localStorage for persistence)
    callback        // The function that is called when the user changes the input, with an argument for the new selected option indexes
)
```

## Example
Here's an example script with the new scripting API.
```js
/**
 * WARNING:
 *   All scripts that are added and loaded through the userscript are loaded asynchronously by the browser.
 *   This means that your script may or may not be loaded before the page is rendered, so keep that in mind.
 *
 *   All UI elements can be found under the dedicated script tab.
**/

(function() {

    // The `GST` object is available under the `window` scope
    // `registerScript` returns a class for dynamically adding buttons and text boxes (as seen below)
    //
    // The link *has* to match the one that users enter to use it, and must have the right Content-Type and CORS headers
    // You can use a service like RawGit.org for providing links to users (custom domains may get restricted in the future, if abused)
    let script = GST.registerScript("Test Script", "https://test.link/hello/script.js", "Nexxed", "1.0.0")

    // Dynamically add a button with a callback that gets called when the user clicks the button
    script.addButton("A test button", "A button that's made for testing", "Test", function() {
        console.log("click!")
    })

    // And the same for text box - except this time, the callback contains the new value (if changed by the user)
    script.addTextBox("A test textbox", "A textbox that's made for testing", "My default text", "Test", function(value) {
        console.log("textbox changed", value)
    })

    // Save our options here for usage in the dropdown and combobox elements below
    let options = [ "Option 1", "Option 2" ]

    // Here we add a dropdown with its default option index set to 0 - just like the textbox, the callback is called with the new value (index)
    script.addDropdown("A test dropdown", "A dropdown that's made for testing", 0, options, function(value) {
        console.log("dropdown changed", options[value])
    })

    // Similar thing here, except the default option index is an array of selected options (the same goes for the callback value)
    script.addComboBox("A test combobox", "A combobox that's made for testing", [], options, function(values) {
        console.log("combobox changed", values)
    })

    // TODO: colour pickers and toggles?

})()
```