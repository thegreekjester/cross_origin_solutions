window.setCookie = function (c_name, value, exdays, c_domain) {
    c_domain = (typeof c_domain === "undefined") ? "" : "domain=" + c_domain + ";";
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value + ";" + c_domain + "path=/";
};

window.getCookie = function (name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) { return match[2] } else { return undefined };
};

window.getTLD = function (url) {
    var url_split = url.split('.');
    var n = url_split.length;
    return url_split.slice(n - 2).join('.');
}

window.getParameterByName = function (name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

window.cross_origin_sync = function(referrerList){
    // ensures the optimizely object is defined globally using
    window.optimizely = window.optimizely || [];

    // Shifts the most recent referrer's domain to the start of the array, prioritizing said domain. This allows us to prioritize the most recent site that user arrives from.
    if (document.referrer && document.referrer.length > 0) {
        for (i = 0; i < referrerList.length; i++) {
            if (document.referrer.indexOf(referrerList[i]) > -1) {
                // store the matched domain, remove the matched domain from its current position, then place the stored matched domain at the start of the array
                var matchedDomain = referrerList[i];
                referrerList.splice(i, 1);
                referrerList.unshift(matchedDomain);
                // break out of the for loop, since we've found our match
                break;
            }
        }
    }
    window.optimizely.push({
        "type": "waitForOriginSync",
        "canonicalOrigins": referrerList
    });
}

window.linkDecoration = function(){

    var TLD = window.getTLD(window.location.hostname)
    var endUserId = window.optimizely.get('visitor').visitorId;
    document.addEventListener("DOMContentLoaded", function (event) {
        console.log('in dom event ')
        var a_new_window = document.querySelectorAll("a[target='_blank']");
        a_new_window.forEach(function(a){
            href_tld = window.getTLD(a.href);
            if(href_tld != TLD){
                a.href += (a.href.split('?')[1] ? '&' : '?') + 'oeu=' + endUserId;
            }
        })

    });
}

var optimizelyEndUserId = window.getCookie('optimizelyEndUserId');

// *************** WHEN WINDOW.NAME IS USED ***************************** //

if (window.name.indexOf('oeu=') == -1) {
    document.addEventListener('DOMContentLoaded', function(e){
        window.name = 'oeu=' + window.getCookie('optimizelyEndUserId') + ';';
    })
} else if (optimizelyEndUserId) {
    var oeu_window_name = window.name.split('oeu=')[1].split(';')[0]
    if (oeu_window_name != optimizelyEndUserId) { 
        setCookie("optimizelyEndUserId", oeu_window_name, 30, window.getTLD(window.location.href)); 
        window.name = 'oeu=' + window.getCookie('optimizelyEndUserId') + ';';
    }
    
} else{
    var oeu_window_name = window.name.split('oeu=')[1].split(';')[0]
    setCookie("optimizelyEndUserId", oeu_window_name, 30, window.getTLD(window.location.href)); 
    window.name = 'oeu=' + window.getCookie('optimizelyEndUserId') + ';';
}

// *************** WHEN LINK DECORATION IS USED ***************************** //

if (window.location.href.indexOf("oeu") > -1) {
    setCookie("optimizelyEndUserId", window.getParameterByName('oeu'), 30, window.getTLD(window.location.href));
    window.name = 'oeu=' + window.getCookie('optimizelyEndUserId') + ';';
}

// *************** USE CROSS ORIGIN HERE ***************************** //

// If you want to use cross origin sync, make sure to update the array you pass in to the following function
window.cross_origin_sync([
    "domain1.com",
    "domain2.come",
    "example.com",
    "otherurl.com"
])

// Activation listener to decorate links

window["optimizely"] = window["optimizely"] || [];
window["optimizely"].push({
    type: "addListener",
    filter: {
        type: "lifecycle",
        name: "activated"
    },
    handler: window.linkDecoration
});