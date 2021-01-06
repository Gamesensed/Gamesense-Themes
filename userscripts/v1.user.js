// ==UserScript==
// @name Custom Gamesense Themes
// @namespace https://gamesense.pub/forums/*
// @author Nexxed & AnonVodka
// @version 1.3.1
// @match https://gamesense.pub/forums/*
// @run-at document-start
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

const presetCommitId = "b617b8e4854fe10c9928928a96b35da7e9a474b6";

const userGroups = {
    1: "Administrator",
    2: "Moderator",
    3: "Member",
    5: "Premium",
    6: "Banned",
    7: "Lua Moderator",
    8: "Community Moderator"
};

const defaultColors = {
    "1 normal": "#b4e61e",
    "1 hovered": "#e4ff5e",

    "2 normal": "#fc0",
    "2 hovered": "#ffe478",

    "4 normal": "#60a0dc",
    "4 hovered": "#80d6ff",

    "5 normal": "#e61515",
    "5 hovered": "#ff4545",

    "6 normal": "#60a0dc",
    "6 hovered": "#80d6ff",

    "7 normal": "#58d794",
    "7 hovered": "#98fdc8",

    "8 normal": "#fc0",
    "8 hovered": "#ffe478",

    "9 postedBy": "#d4d4d4"
};

var g_currentUser = 0;
$(() => {
    var regex = /profile\.php\?id=(.*?)"/gm;
    var matches = regex.exec($("#navprofile").html());

    if(matches && matches[1]) {
        g_currentUser = matches[1];
    } else {
        // some spooky gamers can change this variable so we only use it as a last-resort
        g_currentUser = gs_user_id;
    }
});

const g_currentPage = (() => {
    const regex = /pub\/forums\/(.*?)\.php/gm;
    const matches = regex.exec(window.location.href);
    if(matches && matches[1]) {
        return matches[1];
    } else return "index";
})();

function addCSS(css, isLink, extra) {
    var style = document.createElement(isLink ? 'link' : 'style');
    if (isLink) {
        style.rel = "stylesheet";
        style.href = css;
    } else {
        style.innerHTML = css;

    }
    style.type = "text/css";
    style.id = extra;
    document.getElementsByTagName("head")[0].appendChild(style);
}

function addCustomTheme(theme) {
    addCSS(`https://rawcdn.githack.com/Nexxed/Gamesense-Themes/${presetCommitId}/themes/${theme}.css`, true, "themeURL");
}

function removeCustomTheme() {
    $("#themeURL").remove();
}

function changeUsergroupCSS(usergroup, type, color) {
    $(`#usergroupCSS-${usergroup}-${type}`).remove();
    if (usergroup == "1" || usergroup == "2" || usergroup == "5" || usergroup == "7" || usergroup == "8") {
        if (type == "hovered") {
            addCSS(`.pun a:hover.usergroup-${usergroup} { font-weight: 700; color: ${color} !important; }`, false, `usergroupCSS-${usergroup}-${type}`);
        } else if (type == "normal") {
            addCSS(`.pun .usergroup-${usergroup} { color: ${color} !important; }`, false, `usergroupCSS-${usergroup}-${type}`);
        }
    } else {
        if (type == "hovered") {
            addCSS(`.pun a:hover.usergroup-${usergroup} { color: ${color} !important; }`, false, `usergroupCSS-${usergroup}-${type}`);
        } else if (type == "normal") {
            addCSS(`.pun .usergroup-${usergroup} { color: ${color} !important; }`, false, `usergroupCSS-${usergroup}-${type}`);
        } else if (type == "postedBy") {
            addCSS(`#bisexual-user { color: ${color} !important; #font-weight: 700; }`, false, `usergroupCSS-${usergroup}-${type}`)
        }
    }
}

async function addPostedByCSS() {
    waitForKeyElements(".byuser", function() {
        $(".byuser").each(function() {
            var user = $(this).text().split("by ")[1];
            if (user) {
                $(this).html(`by <a id="bisexual-user"></a>`);
                $(this).children("#bisexual-user").text(user);
            }
        });
    });
}

function addSettingsMenu(isIndex) {
    addCSS(`
        .gs-divider {
            padding: 0;
            margin: 0;
            background: #1e5799;
            background: -moz-linear-gradient(left, #1e5799 0, #f300ff 50%, #e0ff00 100%);
            background: -webkit-gradient(linear, left top, right top, color-stop(0, #1e5799), color-stop(50%, #f300ff), color-stop(100%, #e0ff00));
            background: -webkit-linear-gradient(left, #1e5799 0, #f300ff 50%, #e0ff00 100%);
            background: -o-linear-gradient(left, #1e5799 0, #f300ff 50%, #e0ff00 100%);
            background: -ms-linear-gradient(left, #1e5799 0, #f300ff 50%, #e0ff00 100%);
            background: linear-gradient(to right, #1e5799 0, #f300ff 50%, #e0ff00 100%);
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1e5799',  endColorstr='#e0ff00',  GradientType=1 );
            height: 4px;
            border-bottom: 1px solid #000;
        }

        .settingsMenu {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #020202;
            background-color: rgba(0,0,0,0.4);
            font: 68.75%/1.4545em Verdana, Helvetica, Arial, sans-serif;
        }

        .settingsMenu-content {
            position: relative;
            background-color: #1b1b1b;
            margin: 15% auto;
            border: 1px solid #3e3e3e;
            padding-bottom: 20px;
            min-width: 310px;
            max-width: 700px;
            width: 70%;
        }

        .settingsMenu-content input {
            background-color: #212122;
            color: #ccc;
            border: 1px solid #3e3e3e;
            font-size: 10px;
            font-family: verdana,helvetica,arial,sans-serif;
            margin-left: 4px;
            padding: 5px;
        }

        .close_settings {
            color: #d4d4d4;
            float: right;
            font-size: 18px;
            font-weight: bold;
        }

        .close_settings:hover,
        .close_settings:focus {
            color: #d0d0d0;
            text-decoration: none;
            cursor: pointer;
        }

        .settingsMenu-header {
            padding: 2px 16px;
            color: white;
        }
        .settingsMenu-header h2 {
            margin-left: 4px;
        }
        .settingsMenu-header input[type=button]  {
            width: 47%;
        }
        .settingsMenu-header .seperator {
            margin-left: 3px;
            margin-top: 3px;
        }

        .settingsMenu-body {
            padding: 2px 16px;
        }

        .settingsMenu-body #settingsTab {
            display: block;
        }
        #settingsTab > input[type=text] {
            width: 50%;
            margin-bottom: 3px;
        }
        #settingsTab > label {
            position: absolute;
            margin-top: 1px;
        }

        .settingsMenu-body #colorsTab {
            display: none;
        }
        #colorsTab > input {
            margin-bottom: 3px;
        }
        #colorsTab > input[type=button] {
            width: 30%;
        }
        #colorsTab > input[type=text] {
            width: 50%;
        }

        .settingsMenu-body input[type=checkbox] {
            position: relative;
            cursor: pointer;
        }
    .settingsMenu-body input[type=checkbox]:before {
            content: '';
            display: block;
            position: absolute;
            width: 10px;
            height: 10px;
            top: 0;
            left: 0;
            border: 1px solid #3e3e3e;
            color: #ccc;
            background-color: #212122;
        }
        .settingsMenu-body input[type=checkbox]:checked:after {
            content: '';
            display: block;
            width: 2px;
            height: 5px;
            border: solid #ccc;
            border-width: 0 2px 2px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
            position: absolute;
            top: 2px;
            left: 4px;
        }
        .settingsMenu-body select {
            display: block;
            background-color: #212122;
            color: #ccc;
            border: 1px solid #3e3e3e;
            font-size: 10px;
            font-family: verdana,helvetica,arial,sans-serif;
            margin-left: 4px;
            margin-bottom: 3px;
        }

        .settingsMenu-footer {
            padding: 2px 16px;
            color: white;
        }

        hr.main {
            border-color: #505050;
        }

        #groupColourPreview {
            line-height: 22px;
            width: 7px;
            display: inline-block;
            border: 1px solid #3e3e3e;
        }
    `, false, 'settingsMenuCSS')

    var htmlCode = `
    <div id='settings_menu' class='settingsMenu'>
        <div class='settingsMenu-content'>
            <div class='settingsMenu-header'>
                <h2>Custom forum settings
                    <span class='close_settings'>&times;</span>
                </h2>
                <input type='button' id='settingsBtn' value='Settings'>
                <input type='button' id='colorsBtn' value='Colors'>
                <div class='seperator'></div>
            </div>
            <div class='settingsMenu-body'>
                <div id='settingsTab'>
                    <input type='checkbox' id='toggleBetterLinks'>
                    <label for='toggleBetterLinks'>Open post links in new tab</label>
                    <br>
                    <input type='checkbox' id='toggleGroupLegend'>
                    <label for='toggleGroupLegend'>Show usergroup legend</label>
                    <br>
                    <input type='checkbox' id='togglePostGroups'>
                    <label for='togglePostGroups'>Enable usergroup tooltips in posts</label>
                    <hr class="main">
                    <input type='checkbox' id='togglePageHeader'>
                    <label for='togglePageHeader'>Enable gradient bar</label>
                    <br>
                    <input type='checkbox' id='toggleSnowEffect'>
                    <label for='toggleSnowEffect'>Enable snowfall</label>
                    <br>
                    <input type='checkbox' id='toggleCustomTheme'>
                    <label for='toggleCustomTheme'>Change forum theme</label>
                    <select id='customTheme'>
                        <option value='legacy'>Old (legacy)</option>
                        <option value='default-alt'>Default alt.</option>
                    </select>
                    <hr class="main">
                    <input type='text' id='customCSS' placeholder='https://example.com/stylesheet.css' value=''> Custom CSS link<br>
                    <input type='text' id='forumMotto' placeholder='A cool motto' value=''> Forum motto<br>
                    <input type='text' id='forumMottoCSS' placeholder='color: #ffffff' value=''> Forum motto CSS<br>
                    ${isIndex ? `
                    <input type='checkbox' id='showShoutbox'>
                    <label for='showShoutbox'>Show shoutbox</label><br>
                    <input type='text' id='shoutboxSize' placeholder='207' value='207'> Shoutbox size (px)<br>
                    <input type='text' id='shoutboxCSSLink' placeholder='https://example.com/stylesheet.css' value=''> Custom Shoutbox CSS link<br>
                    ` : ``}
                </div>
                <div id='colorsTab'>
                    <input type='text' id='1 normal' value='#b4e61e'><div id="groupColourPreview">&nbsp;</div> Admin color<br>
                    <input type='text' id='1 hovered' value='#e4ff5e'><div id="groupColourPreview">&nbsp;</div> Admin hovered color<br>
                    <input type='text' id='2 normal' value='#fc0'><div id="groupColourPreview">&nbsp;</div> Mod color<br>
                    <input type='text' id='2 hovered' value='#ffe478'><div id="groupColourPreview">&nbsp;</div> Mod hovered color<br>
                    <input type='text' id='4 normal' value='#60a0dc'><div id="groupColourPreview">&nbsp;</div> Member color<br>
                    <input type='text' id='4 hovered' value='#80d6ff'><div id="groupColourPreview">&nbsp;</div> Member hovered color<br>
                    <input type='text' id='5 normal' value='#e61515'><div id="groupColourPreview">&nbsp;</div> Premium color<br>
                    <input type='text' id='5 hovered' value='#ff4545'><div id="groupColourPreview">&nbsp;</div> Premium hovered color<br>
                    <input type='text' id='6 normal' value='#60a0dc'><div id="groupColourPreview">&nbsp;</div> Banned color<br>
                    <input type='text' id='6 hovered' value='#80d6ff'><div id="groupColourPreview">&nbsp;</div> Banned hovered color<br>
                    <input type='text' id='7 normal' value='#58d794'><div id="groupColourPreview">&nbsp;</div> Lua-Mod color<br>
                    <input type='text' id='7 hovered' value='#98fdc8'><div id="groupColourPreview">&nbsp;</div> Lua-Mod hovered color<br>
                    <input type='text' id='8 normal' value='#b4e61e'><div id="groupColourPreview">&nbsp;</div> Com-Mod color<br>
                    <input type='text' id='8 hovered' value='#e4ff5e'><div id="groupColourPreview">&nbsp;</div> Com-Mod hovered color<br>
                    <input type='text' id='9 postedBy' value='#d4d4d4'><div id="groupColourPreview">&nbsp;</div> Posted by color<br>
                    <input type='button' id='saveBtn' value='Save colors'>
                    <input type='button' id='loadBtn' value='Load colors'>
                    <input type='button' id='defaultBtn' value='Reset to default'>
                </div>
            </div>
        </div>
    </div>`;

    $('body').prepend(`<canvas id="snow" style="position: fixed;height: 100%;width: 100%;"></canvas>`);
    $('body').append(htmlCode);
}

function changeTheme() {
    if (GM_getValue('toggleCustomTheme') == true) {
        removeCustomTheme();
        addCustomTheme(GM_getValue('customTheme'));
    }
}

changeTheme();

$(() => {
    (async function() {
        $("body").prepend("<div class='gs-divider'></div>")

        function loadCustomCSS(link) {
            if ($("#customCSSLink"))
                $("#customCSSLink").remove();

            var link = link || GM_getValue("customCSSLink") || "";
            if (link.length > 0)
                addCSS(link, true, "customCSSLink");
        }

        function changeShoutboxSize(size) {
            if ($("#shoutboxSizeCSS"))
                $("#shoutboxSizeCSS").remove();

            var size = size || GM_getValue("shoutboxSize") || "207";
            addCSS(`#shout > div:nth-of-type(1) { height: ${size}px !important; }`, false, "shoutboxSizeCSS")
        }

        function changeShoutboxCSS(size) {
            if ($("#shoutboxCSS"))
                $("#shoutboxCSS").remove();
            var size = size || GM_getValue("shoutboxCSS") || null;
            if (size !== null)
                addCSS(size, true, "shoutboxCSS")
        }

        function changeShoutbox() {
            $('.blockform')[0].style.display = GM_getValue("showShoutbox") || "";
        }

        function changeForumMotto() {
            var motto = GM_getValue("forumMotto") || "";
            $("#brddesc")[0].innerHTML = motto;
        }

        function addForumMottoCSS(css) {
            if ($("#forummottoCSS"))
                $("#forummottoCSS").remove();
            var css = css || GM_getValue("forumMottoCSS") || "";
            if (css.length > 0)
                addCSS(css, false, "forummottoCSS");
        }

        function betterLinks(enable) {
            if (enable) {
                $(".blockpost .box .inbox .postbody .postright .postmsg a, div.postsignature.postmsg a").each(function() {
                    // ignore usergroup links
                    for (var i = 0; i < 10; i++)
                        if ($(this).hasClass(`usergroup-${i}`)) return;

                    // make them open in a new tab when clicked
                    $(this).attr("target", "_blank");
                })
            } else {
                $(".blockpost .box .inbox .postbody .postright .postmsg a, div.postsignature.postmsg a").each(function() {
                    // ignore usergroup links
                    for (var i = 0; i < 10; i++)
                        if ($(this).hasClass(`usergroup-${i}`)) return;

                    // make them open in a new tab when clicked
                    $(this).removeAttr("target");
                })
            }
        }

        function groupLegend(enable) {
            if (enable && $("#onlinelist")[0]) {
                // initialize
                $("#onlinelist").parent().append($(`<dl class="clearb" id="grouplegend"><dt style="display: contents"><strong>Groups: </strong></dt></dl>`));

                Object.keys(userGroups).map((index) => {
                    var name = userGroups[index];
                    $("#grouplegend").append($(`<dd style="display: contents"><a href="#" class="usergroup-${index}">${name}</a>, </dd>`));
                });

                var e = $("#grouplegend").children().last();
                $(e).html($(e).html().slice(0, $(e).html().length-2));
            } else {
                $("#grouplegend").remove();
            }
        }

        // for clarification, this is for displaying the tooltip
        // on members' titles for their actual forum usergroup.
        function displayPostGroups(enable) {
            if(g_currentPage == "viewtopic") {
                $(".usertitle").each(function() {
                    if(enable) {
                        const regex = /<a class="usergroup-(.*?)"/gm;
                        var matches = regex.exec($(this).prev().html());
                        if(matches && matches[1]) {
                            $(this).attr("title", userGroups[matches[1]]);
                        }
                    } else $(this).removeAttr("title");
                });
            }
        }

        const pageHeader = enable => {
            $(".gs-navbar, .gs-divider").css("display", enable ? "block" : "none");
        }

        const snowEffect = enable => {
            $("#snow").css("display", enable ? "inherit" : "none")
        }

        addPostedByCSS();
        loadCustomCSS();

        while (!document.querySelector("body")) {
            await new Promise(r => setTimeout(r, 0));
        }

        var isIndex = g_currentPage == "index";
        if ($('.blockform')[0] != undefined && isIndex) {
            changeShoutbox();
        }

        changeForumMotto();
        addForumMottoCSS();

        addSettingsMenu(isIndex);
        while (!document.querySelector("#settings_menu")) {
            addSettingsMenu(isIndex);
            await new Promise(r => setTimeout(r, 0));
        }

        $($($(".pun #brdwelcome ul.conl li").last()).children()[0]).append(` • <a href="#" id="open_settings">Custom forum settings</a>`)

        function loadUsergroupColors() {
            $("#colorsTab > input[type=text]").each(function (idx, b) {
                var group = $(b)[0].id.split(" ")[0];
                var type = $(b)[0].id.split(" ")[1];
                var settings = JSON.parse(GM_getValue(`usergroup-${group}-${type}`))

                if (settings.id == group) {
                    $(b)[0].value = settings.color
                }

                changeUsergroupCSS(settings.id, type, settings.color);
                $(this).next().css("background", settings.color);
            });
        }

        var openSettingsMenu = document.getElementById("open_settings");
        var settingsMenu = document.getElementById("settings_menu");
        var closeButton = document.getElementsByClassName("close_settings")[0];

        var settingsBtn = document.getElementById("settingsBtn");
        var colorsBtn = document.getElementById("colorsBtn");
        var settingsTab = document.getElementById("settingsTab");
        var colorsTab = document.getElementById("colorsTab");

        var saveBtn = document.getElementById("saveBtn");
        var loadBtn = document.getElementById("loadBtn");
        var defaultBtn = document.getElementById("defaultBtn");

        var toggleCustomTheme = document.getElementById("toggleCustomTheme");
        var toggleBetterLinks = document.getElementById("toggleBetterLinks");
        var toggleGroupLegend = document.getElementById("toggleGroupLegend");
        var togglePostGroups = document.getElementById("togglePostGroups");
        var togglePageHeader = document.getElementById("togglePageHeader");
        var toggleSnowEffect = document.getElementById("toggleSnowEffect")
        var customTheme = document.getElementById("customTheme");
        var customCSS = document.getElementById("customCSS");
        var forumMotto = document.getElementById("forumMotto");
        var forumMottoCSS = document.getElementById("forumMottoCSS");
        var shoutboxCSS = document.getElementById("shoutboxCSSLink");

        openSettingsMenu.onclick = function() {
            settingsMenu.style.display = "block";
        };

        const closeMenu = () => settingsMenu.style.display = "none";
        closeButton.onclick = closeMenu;

        settingsBtn.onclick = function() {
            settingsTab.style.display = "block";
            colorsTab.style.display = "none";
        }

        colorsBtn.onclick = function() {
            colorsTab.style.display = "block";
            settingsTab.style.display = "none";
        }

        toggleCustomTheme.onclick = function() {
            GM_setValue('toggleCustomTheme', toggleCustomTheme.checked);

            if (GM_getValue('toggleCustomTheme') == true) {
                changeTheme();
            } else removeCustomTheme();
        }

        toggleBetterLinks.onclick = function() {
            GM_setValue('toggleBetterLinks', toggleBetterLinks.checked);
            betterLinks(GM_getValue('toggleBetterLinks'));
        }

        toggleGroupLegend.onclick = function() {
            GM_setValue('toggleGroupLegend', toggleGroupLegend.checked);
            groupLegend(GM_getValue('toggleGroupLegend'));
        }

        togglePostGroups.onclick = function() {
            GM_setValue('togglePostGroups', togglePostGroups.checked);
            displayPostGroups(GM_getValue('togglePostGroups'));
        }

        togglePageHeader.onclick = function() {
            GM_setValue('togglePageHeader', togglePageHeader.checked);
            pageHeader(GM_getValue('togglePageHeader'));
        }

        toggleSnowEffect.onclick = function() {
            GM_setValue('toggleSnowEffect', toggleSnowEffect.checked);
            snowEffect(GM_getValue('toggleSnowEffect'));
        }

        customTheme.onchange = function() {
            GM_setValue('customTheme', customTheme.value);
            changeTheme();
        }

        customCSS.onchange = function (s) {
            var link = customCSS.value;

            if (link.length == 0) {
                if ($("#customCSSLink"))
                    $("#customCSSLink").remove();
            } else loadCustomCSS(link);

            GM_setValue("customCSSLink", link)
        }

        forumMotto.onchange = function (s) {
            GM_setValue('forumMotto', forumMotto.value);
            changeForumMotto();
        }

        forumMottoCSS.onchange = function (s) {
            var css = forumMottoCSS.value;

            if (css.length == 0) {
                if ($("#forummottoCSS"))
                    $("#forummottoCSS").remove();
            } else addForumMottoCSS(css);

            GM_setValue("forumMottoCSS", css)
        }

        if (isIndex) {
            var showShoutbox = document.getElementById("showShoutbox");
            var shoutboxSize = document.getElementById("shoutboxSize");

            showShoutbox.onclick = function (s) {
                GM_setValue("showShoutbox", showShoutbox.checked ? "block" : "none")
                changeShoutbox()
            };

            shoutboxSize.onchange = function (s) {
                var size = $(s.target)[0].value;

                if (size.length == 0) {
                    if ($("#shoutboxSizeCSS"))
                        $("#shoutboxSizeCSS").remove();
                } else changeShoutboxSize(size);

                GM_setValue("shoutboxSize", size)
            };
            shoutboxCSS.onchange = function (s) {
                var size = $(s.target)[0].value;
                if (size.length == 0) {
                    if ($("#shoutboxCSS"))
                        $("#shoutboxCSS").remove();
                } else {
                    changeShoutboxCSS(size);
                }
                GM_setValue("shoutboxCSS", size)
            };
            shoutboxSize.value = GM_getValue("shoutboxSize") || null;
            showShoutbox.checked = GM_getValue("showShoutbox") == "block" ? true : false;
        }

        $("#colorsTab > input[type=text]").on("change", function (s) {
            var group = $(s.target)[0].id.split(" ")[0];
            var type = $(s.target)[0].id.split(" ")[1];
            var clr = $(s.target)[0].value;

            changeUsergroupCSS(group, type, clr);
            $(this).next().css("background", clr);
        });

        saveBtn.onclick = function() {
            $("#colorsTab > input[type=text]").each(function (idx, b) {
                var group = $(b)[0].id.split(" ")[0];
                var type = $(b)[0].id.split(" ")[1];
                var clr = $(b)[0].value;

                GM_setValue(`usergroup-${group}-${type}`, JSON.stringify({
                    id: group,
                    color: clr
                }))
            });
        }
        loadBtn.onclick = function() {
            loadUsergroupColors()
        }
        defaultBtn.onclick = function() {
            $("#colorsTab > input[type=text]").each(function (idx, b) {
                var group = $(b)[0].id.split(" ")[0];
                var type = $(b)[0].id.split(" ")[1];
                var clr = defaultColors[`${group} ${type}`];

                $(b)[0].value = clr
                changeUsergroupCSS(group, type, clr)
                $(this).next().css("background", clr);
            });
        }

        toggleCustomTheme.checked = GM_getValue('toggleCustomTheme') !== undefined ? GM_getValue('toggleCustomTheme') : false;
        toggleBetterLinks.checked = GM_getValue('toggleBetterLinks') !== undefined ? GM_getValue('toggleBetterLinks') : false;
        toggleGroupLegend.checked = GM_getValue('toggleGroupLegend') !== undefined ? GM_getValue('toggleGroupLegend') : false;
        togglePostGroups.checked = GM_getValue('togglePostGroups') !== undefined ? GM_getValue('togglePostGroups') : false;
        togglePageHeader.checked = GM_getValue('togglePageHeader') !== undefined ? GM_getValue('togglePageHeader') : false;
        toggleSnowEffect.checked = GM_getValue('toggleSnowEffect') !== undefined ? GM_getValue('toggleSnowEffect') : true;
        customTheme.value = GM_getValue('customTheme') || "";
        customCSS.value = GM_getValue("customCSSLink") || "";
        forumMotto.value = GM_getValue("forumMotto") || "";
        forumMottoCSS.value = GM_getValue("forumMottoCSS") || "";

        betterLinks(toggleBetterLinks.checked);
        groupLegend(toggleGroupLegend.checked);
        displayPostGroups(togglePostGroups.checked);
        pageHeader(togglePageHeader.checked);
        snowEffect(toggleSnowEffect.checked);
        loadUsergroupColors();
        changeShoutboxSize();
        changeShoutboxCSS();

        (() => {
            var c = document.getElementById('snow'),
                $ = c.getContext("2d");
            var w = c.width = window.innerWidth,
                h = c.height = window.innerHeight;

            Snowy();
            function Snowy() {
                var snow, arr = [];
                var num = 300, tsc = 0.2, sp = 0.5;
                var sc = 1.3, t = 0, mv = 20, min = 1;

                for (var i = 0; i < num; ++i) {
                    snow = new Flake();
                    snow.y = Math.random() * (h + 50);
                    snow.x = Math.random() * w;
                    snow.t = Math.random() * (Math.PI * 2);
                    snow.sz = (100 / (10 + (Math.random() * 100))) * sc;
                    snow.sp = (Math.pow(snow.sz * .8, 2) * .15) * sp;
                    snow.sp = snow.sp < min ? min : snow.sp;
                    arr.push(snow);
                }

                go();
                function go() {
                    window.requestAnimationFrame(go);
                    $.clearRect(0, 0, w, h);
                    $.fill();
                    for (var i = 0; i < arr.length; ++i) {
                        f = arr[i];
                        f.t += .05;
                        f.t = f.t >= Math.PI * 2 ? 0 : f.t;
                        f.y += f.sp;
                        f.x += Math.sin(f.t * tsc) * (f.sz * .3);
                        if (f.y > h + 50) f.y = -10 - Math.random() * mv;
                        if (f.x > w + mv) f.x = - mv;
                        if (f.x < - mv) f.x = w + mv;
                        f.draw();
                    }
                }

                function Flake() {
                    this.draw = function() {
                        this.g = $.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.sz);
                        this.g.addColorStop(0, 'hsla(255,255%,255%,1)');
                        this.g.addColorStop(1, 'hsla(255,255%,255%,0)');
                        $.moveTo(this.x, this.y);
                        $.fillStyle = this.g;
                        $.beginPath();
                        $.arc(this.x, this.y, this.sz, 0, Math.PI * 2, true);
                        $.fill();}
                    }
                }

                window.addEventListener('resize', function(){
                    c.width = w = window.innerWidth;
                    c.height = h = window.innerHeight;
                }, false);

        })();
    })();
})
