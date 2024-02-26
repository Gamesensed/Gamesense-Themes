var GST = unsafeWindow.GST = {};

(function(window) {
    function log(type, ...args) {
        console.log(`[CGS >> ${type}]`, ...args)
    }

    let app = new Vue({

        // this is the data that can be accessed from within the app's scope
        data: {
            open: false,

            // init data
            feed: [],

            // pages
            activePage: "home",
            activeScriptPage: "manager",

            // themes
            activeThemes: GM_getValue("activeThemes") ? JSON.parse(GM_getValue("activeThemes")) : [],
            savedThemes: GM_getValue("savedThemes") ? JSON.parse(GM_getValue("savedThemes")) : [],

            // scripts
            activeScripts: GM_getValue("activeScripts") ? JSON.parse(GM_getValue("activeScripts")) : [],
            savedScripts: GM_getValue("savedScripts") ? JSON.parse(GM_getValue("savedScripts")) : [],
            loadedScripts: [],

            // inputs
            inputTheme: "",
            inputScript: ""
        },

        // when the app is mounted to an element ("#punindex" in this case) this function is called
        mounted() {
            log("UI", "Mounted successfully")
        },

        // these are pre-computed data variables
        // the functions are only called when data gets updated and are accessed like a regular data variable
        //
        // example: getPageName() would just be {{ getPageName }} (as it's pre-computed)
        computed: {

            // used for converting unfriendly page names (e.g "settings") to friendly page names (e.g "Settings")
            getPageName() {
                return this.activePage.charAt(0).toUpperCase() + this.activePage.slice(1);
            },

            getScriptPageName() {
                return this.activeScriptPage.charAt(0).toUpperCase() + this.activeScriptPage.slice(1);
            },

            // used for returning a sorted theme list in the themes page
            sortedSavedThemes() {
                return this.savedThemes.sort((a, b) => {
                    if(this.isThemeActive(a.link) || a.name < b.name) return -1
                    else if(a.name > b.name) return 1

                    return 0
                })
            },

            // used for returning a sorted script list in the scripts page
            sortedSavedScripts() {
                return this.savedScripts.sort((a, b) => {
                    if(this.isScriptActive(a.link) || a.name < b.name) return -1
                    else if(a.name > b.name) return 1

                    return 0
                })
            }
        },

        // whenever a data variable gets changed, the function for it below is called (if defined)
        watch: {

            // here we watch for current theme changes
            // this is updated whenever the user changes themes from within the interface
            //
            // we use this so we can remove the current (if exists) and add the new (if possible) - convenient!
            activeThemes(themes) {
                GM_setValue("activeThemes", JSON.stringify(themes))
                log("Themes", "Updated active theme storage", themes)

                // remove any inactive themes
                jq("link[id=gsti-activeTheme]").each(function() {
                    let elem = jq(this)
                    let link = elem.attr("href")

                    if(themes.indexOf(link) === -1) {
                        elem.remove()
                        log("Themes", "Unloaded active theme:", link)
                    }
                })

                // get an array of loaded themes
                let loaded = []
                jq("link[id=gsti-activeTheme]").each(function() {
                    loaded.push(jq(this).attr("href"))
                })

                // load any active themes
                themes.forEach((link) => {

                    // if this theme isn't loaded
                    if(loaded.indexOf(link) === -1) {

                        // load it
                        let element = document.createElement("link")
                        element.id = "gsti-activeTheme"
                        element.rel = "stylesheet"
                        element.type = "text/css"
                        element.href = link

                        if(jq("head").append(element).length > 0) {
                            console.log("Injected theme:", link)
                        } else {
                            console.log("Failed to inject theme:", link)
                        }
                    }
                })
            },

            // same thing for this, but whenever a new theme is added (or deleted) then this gets called
            // we use it to synchronize changes to local storage (through GM_* functions)
            savedThemes(value) {
                GM_setValue("savedThemes", JSON.stringify(value.filter(v => !v.default)))
                log("Themes", "Updated saved theme storage", value)
            },

            activeScripts(scripts) {
                GM_setValue("activeScripts", JSON.stringify(scripts))
                log("Scripts", "Updated active script storage", scripts)

                // check for any inactive scripts
                jq("script[id=gsti-activeScript]").each(function() {
                    let elem = jq(this)
                    let link = elem.attr("href")

                    if(scripts.indexOf(link) === -1) {
                        window.location.reload()
                    }
                })

                // get an array of loaded scripts
                let loaded = []
                jq("script[id=gsti-activeScript]").each(function() {
                    loaded.push(jq(this).attr("href"))
                })

                // store head
                let head = document.getElementsByTagName("head")[0]

                // load any active scripts
                scripts.forEach((link) => {

                    // if this script isn't loaded
                    if(loaded.indexOf(link) === -1) {

                        // load it
                        let element = document.createElement("script")
                        element.id = "gsti-activeScript"
                        element.type = "application/javascript"
                        element.src = link
                        element.async = true

                        if(head.appendChild(element)) {
                            console.log("Injected script:", link)
                        } else {
                            console.log("Failed to inject script:", link)
                        }
                    }
                })
            },

            savedScripts(value) {
                GM_setValue("savedScripts", JSON.stringify(value.filter(v => !v.default)))
                log("Scripts", "Updated saved script storage", value)
            }
        },

        // these are just regular methods that can be called from within the app's scope
        methods: {

            // we use this for toggling the window from being shown and hidden
            toggleWindow(value) {
                this.open = value == true
            },

            // and this is for getting how long ago (or from now) a date/datetime was
            getTimeFromNow(v) {
                return moment(v).fromNow()
            },

            // this gets called whenever the user clicks 'add theme' from within the interface
            inputAddTheme() {
                const link = this.inputTheme

                if(link.length === 0) {
                    log("Themes", "Empty theme URL provided (1):", )
                    return
                }

                if(!link.startsWith("https://") || !link.endsWith(".css")) {
                    log("Themes", "Invalid theme URL provided (2):", link)
                    return
                }

                let pieces = link.split("/")
                if(pieces.length < 3) {
                    log("Themes", "Invalid theme URL provided (3):", pieces)
                    return
                }

                let name = pieces[pieces.length - 1].split(".css")[0]
                if(this.savedThemes.findIndex(t => t.link === link || t.name === name) > -1) {
                    log("Themes", "Tried to add a saved theme that was already added:")
                    return
                }

                this.savedThemes.push({
                    name,
                    link
                })
            },

            isThemeActive(link) {
                return this.activeThemes.indexOf(link) > -1
            },

            addActiveTheme(link) {
                if(this.isThemeActive(link)) {
                    log("Themes", "Tried to add an active theme that is already active:", link, this.activeThemes)
                    return
                }

                this.activeThemes.push(link)
                log("Themes", "Added active theme:", link, this.activeThemes)
            },

            removeActiveTheme(link) {
                let index = this.activeThemes.indexOf(link)
                if(index === -1) {
                    log("Themes", "Tried to remove an active theme that is already inactive", link, this.activeThemes)
                    return
                }

                this.activeThemes.splice(index, 1)
                log("Themes", "Removed active theme:", link, this.activeThemes)
            },

            deleteSavedTheme(link) {
                let index = this.savedThemes.findIndex(t => t.link === link)
                if(index === -1) {
                    log("Themes", "Tried to delete a non-saved theme (index not found)", link, index)
                    return
                }

                if(this.isThemeActive(link)) {
                    this.removeActiveTheme(link)
                }

                this.savedThemes.splice(index, 1)
                log("Themes", "Removed saved theme:", link, this.savedThemes)
            },


            inputAddScript() {
                const link = this.inputScript

                if(link.length === 0) {
                    log("Scripts", "Empty script URL provided (1):", )
                    return
                }

                if(!link.startsWith("https://") || !link.endsWith(".js")) {
                    log("Scripts", "Invalid script URL provided (2):", link)
                    return
                }

                let pieces = link.split("/")
                if(pieces.length < 3) {
                    log("Scripts", "Invalid script URL provided (3):", pieces)
                    return
                }

                let name = pieces[pieces.length - 1].split(".js")[0]
                if(this.savedScripts.findIndex(s => s.link === link || s.name === name) > -1) {
                    log("Scripts", "Tried to add a saved script that was already added:")
                    return
                }

                this.savedScripts.push({
                    name,
                    link
                })
            },

            isScriptActive(link) {
                return this.activeScripts.indexOf(link) > -1
            },

            isScriptLoaded(link) {
                return this.loadedScripts.findIndex(s => s.link === link) > -1
            },

            addActiveScript(link) {
                if(this.isScriptActive(link)) {
                    log("Scripts", "Tried to add an active script that is already active:", link, this.activeScripts)
                    return
                }

                this.activeScripts.push(link)
                log("Scripts", "Added active script:", link, this.activeScripts)
            },

            removeActiveScript(link) {
                let index = this.activeScripts.indexOf(link)
                if(index === -1) {
                    log("Scripts", "Tried to remove an active script that is already inactive", link, this.activeScripts)
                    return
                }

                this.activeScripts.splice(index, 1)
                log("Scripts", "Removed active script:", link, this.activeScripts)
            },

            deleteSavedScript(link) {
                let index = this.savedScripts.findIndex(t => t.link === link)
                if(index === -1) {
                    log("Scripts", "Tried to delete a non-saved script (index not found)", link, index)
                    return
                }

                if(this.isScriptActive(link)) {
                    this.removeActiveScript(link)
                }

                this.savedScripts.splice(index, 1)
                log("Scripts", "Removed saved script:", link, this.savedScripts)
            },


            // Unhandled Script UI Event Logs
            unhandledEvent(source, type) {
                log("Scripts", `Unhandled ${type} event`, source)
            }
        }
    })

    window.settingsApp = {
        onReady(feed, cb) {
            app.feed = feed

            /*let buttonText = "A nice button"

            // generate test scripts
            for(var i = 0; i < 10; i++) {
                let object = {}

                object = {
                    key: `script-${i}`,
                    name: `Script #${i + 1}`,
                    link: `https://example.link/script-${i}.js`,
                    version: "1.0.0",

                    settings: [
                        {
                            type: "button",

                            name: "Test Setting #1",
                            description: "This setting does really cool things!",
                            label: buttonText,

                            onClick() {
                                log("Test", "button clicked for script:", i)
                                buttonText = buttonText === "A nice button" ? "A not nice button" : "A nice button"
                            }
                        },
                        {
                            type: "text",

                            name: "Test Setting #2",
                            description: "This setting does stuff with text!",

                            placeholder: "Type something...",
                            value: "",

                            onChange(value) {
                                log("Test", "input changed for script:", i, value)
                            }
                        },
                        {
                            type: "select",

                            name: "Test Setting #3",
                            description: "This setting allows single-select!",
                            multiple: true,

                            values: [],
                            options: [
                                "hi",
                                "hi2",
                                "hi3"
                            ],

                            onChange(value) {
                                log("Test", "select changed for script:", i, value)
                            }
                        }
                    ]
                }

                app.loadedScripts[app.loadedScripts.length] = object
            }*/

            jq(document).ready(cb)
        },
        start() {
            jq(jq(jq(".pun #brdwelcome ul.conl li").last()).children()[0]).append(` • <a href="javascript:void(0)" id="gst-button" @click='toggleWindow(true)'>Custom forum settings</a>`)
            Vue.nextTick(() => app.$mount("body > div"))
        }
    }

    class Script {
        constructor(name, link, author, version) {
            if(typeof(name) != "string") {
                throw new Error("Invalid type for name")
            }

            if(typeof(link) != "string") {
                throw new Error("Invalid type for link")
            }

            if(typeof(author) != "string") {
                throw new Error("Invalid type for author")
            }

            if(typeof(version) != "string") {
                throw new Error("Invalid type for version")
            }

            this.key = name.replace(/[^0-9a-zA-Z]/g, "")

            this.name = name
            this.link = link
            this.author = author
            this.version = version

            this.settings = []
        }

        removeSetting(name) {
            let index = this.settings.findIndex(s => s.name === name)

            if(index > -1) {
                this.settings.splice(index, 1)
                return true
            }

            return false
        }

        addButton(name, description, label, callback) {
            this.settings.push({
                type: "button",

                name, description, label,
                onClick: callback
            })
        }

        addTextBox(name, description, placeholder, value, callback) {
            this.settings.push({
                type: "text",

                name, description, placeholder, value,
                onChange: callback
            })
        }

        addDropdown(name, description, value, options, callback) {
            this.settings.push({
                type: "select",
                multiple: false,

                name, description, value, options,
                onChange: callback
            })
        }

        addComboBox(name, description, values, options, callback) {
            this.settings.push({
                type: "select",
                multiple: true,

                name, description, values, options,
                onChange: callback
            })
        }
    }

    GST.registerScript = function(name, link, author, version) {
        let index = app.loadedScripts.push(new Script(name, link, author, version)) - 1
        return app.loadedScripts[index]
    }

    app.savedThemes.push({
        default: true,
        name: "Alternate",
        link: "https://gsext.nex.wtf/styles/themes/default-alt.css"
    })

    app.savedThemes.push({
        default: true,
        name: "Alternate v2",
        link: "https://gsext.nex.wtf/styles/themes/default-alt-v2.css"
    })

    app.savedThemes.push({
        default: true,
        name: "Legacy (Original)",
        link: "https://gsext.nex.wtf/styles/themes/legacy.css"
    })

    app.savedScripts.push({
        default: true,
        name: "Online Members Tracker",
        link: "https://gsext.nex.wtf/scripts/ext/online-api.js"
    })
})(window)