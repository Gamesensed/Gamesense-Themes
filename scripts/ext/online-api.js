function updateMembers() {

    // return false if onlinelist doesn't exist in this page
    if($("#onlinelist").length <= 0)
        return false

    // store our online members for later use
    let members = []

    // otherwise, loop through every online member
    $("#onlinelist > dd > a").each(function() {

        // get the <a> element of this iteration
        let element = $(this)

        // extract the ID from the href - similar to the following string: "profile.php?id=696969"
        let member_id = element.attr("href").split("=")[1] || 0

        // if it's a valid ID
        if(member_id !== 0 && !!parseInt(member_id)) {

            // add it the array
            members.push(parseInt(member_id))
        }
    })

    // update storage with the new data
    localStorage.setItem("cgs_online_members", JSON.stringify({
        updated: Date.now(),
        members
    }))

    // completed
    return true
}

(function() {
    let script = GST.registerScript("Online Tracker", "https://gsext.nex.wtf/scripts/ext/online-api.js", "Nexxed", "1.0.0")

    let options = {
        toggle: [ "Disabled", "Enabled" ],
        tags: [ "None", "Online only", "Offline only", "Both" ]
    }

    // UI Setup
    script.addDropdown("Tracker", "Whether or not the tracker is enabled and tracking online members.", localStorage.getItem("cgs_online_enabled") || 0, options.toggle, function(value) {
        localStorage.setItem("cgs_online_enabled", value)
    })

    script.addDropdown("Tracker: Apply Classes", "When enabled, it adds classes to online members for styling options.", localStorage.getItem("cgs_online_classes_enabled") || 0, options.toggle, function(value) {
        localStorage.setItem("cgs_online_classes_enabled", value)
    })

    script.addDropdown("Tracker: Status Tags", "Choose how online status tags are displayed when viewing posts.", localStorage.getItem("cgs_online_tags") || 0, options.tags, function(value) {
        localStorage.setItem("cgs_online_tags", value)
    })


    // if the tracker is enabled
    if(localStorage.getItem("cgs_online_enabled") == 1) {

        // update members (if possible)
        updateMembers()

        // if the tracker and "apply classes" option is enabled
        if(localStorage.getItem("cgs_online_classes_enabled") == 1) {

            // get the stored members from local storage
            const storedMembers = localStorage.getItem("cgs_online_members")

            // get the latest tracker information
            let online = storedMembers ? JSON.parse(storedMembers) : { updated: 0, members: [] }

            // if this data has been recently updated in the last 15 minutes
            if(Date.now() - online.updated <= (1000 * 60 * 15)) {

                // loop through every post avatar on the page
                $(".postavatar:has(img)").each(function() {

                    // get the element of this iteration
                    let postavatar = $(this)

                    // now the image (first child)
                    let image = $($(this).children()[0])

                    // check if the online list contains a member ID matching this users picture
                    // https://gamesense.pub/forums/img/avatars/696969.jpg?m=696969696969
                    let matches = image.attr("src").match(/avatars\/(.*?)\./)

                    // if we have matches
                    if(matches.length > 0) {

                        // get the second match (which would be the UID)
                        let uid = parseInt(matches[1])

                        // if it's a valid UID
                        if(!!uid) {

                            // add the online/offline class to the postavatar element
                            postavatar.addClass(online.members.findIndex(id => id === uid) > -1 ? "online" : "offline")
                        }
                    }
                })
            }
        }


    }
})()