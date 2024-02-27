// ==UserScript==
// @name                    Custom Gamesense Themes
// @namespace               https://gamesense.pub/forums/*
// @author                  Nexxed & AnonVodka
// @version                 2.0.2-beta

// @supportURL              https://github.com/Gamesensed/Gamesense-Themes
// @updateURL               https://gsext.nex.wtf/loader.user.js
// @downloadURL             https://gsext.nex.wtf/loader.user.js

// @match                   https://gamesense.pub/forums/*
// @run-at                  document-start

// @require                 https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require                 https://code.jquery.com/jquery-3.6.0.slim.min.js
// @require                 https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js

// @require                 https://gsext.nex.wtf/scripts/app.js
// @resource    html        https://gsext.nex.wtf/layouts/window.html
// @resource    css         https://gsext.nex.wtf/styles/window.css
// @resource    feed        https://gsext.nex.wtf/feed.json

// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_getResourceText
// @grant unsafeWindow
// ==/UserScript==

window.jq = $.noConflict(true);

(function () {
    'use strict';

    // pre-load our window CSS
    GM_addStyle(GM_getResourceText("css"))

    // now check if there's any themes available to be loaded
    let themes = GM_getValue("activeThemes") ? JSON.parse(GM_getValue("activeThemes")) : []
    if(themes.length > 0) {
        console.log(`Injecting ${themes.length} themes...`)

        themes.forEach((link) => {
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
        })

        console.log(`Theme injection complete!`)
    }

    let scripts = GM_getValue("activeScripts") ? JSON.parse(GM_getValue("activeScripts")) : []
    if(scripts.length > 0) {
        console.log(`Injecting ${scripts.length} scripts...`)

        let head = document.getElementsByTagName("head")[0]

        scripts.forEach((link) => {
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
        })

        console.log(`Script injection complete!`)
    }


    // setup the callback for when the window is ready, and parse along the content of the feed
    settingsApp.onReady(JSON.parse(GM_getResourceText("feed")), function () {

        if(jq("body > div").length > 0) {

            // load our window HTML
            jq("body > div").append(GM_getResourceText("html"))

            // patch the default font-awesome iconset with our own (and updated) one
            jq("link").each(function() {
                if(jq(this).attr("href") == "/static/css/font-awesome.min.css")
                    jq(this).attr("href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css")
            })

            // go through each script...
            jq("script").each(function() {

                // patch the shoutbox ("v8" only) code with our own (for customizing the shoutbox)
                if(jq(this).attr("src") == "/static/js/sb.js?v=8")
                    jq(this).attr("src", "https://gsext.nex.wtf/scripts/sbCustom.js")

                // set all types of script tags to the appropriate type
                // otherwise, Vue complains
                jq(this).attr("type", "application/javascript")
            })

            settingsApp.start()

        } else console.error("Couldn't find body div for mounting")
    })
})()