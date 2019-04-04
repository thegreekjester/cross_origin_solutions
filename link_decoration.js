
window["optimizely"] = window["optimizely"] || [];
window["optimizely"].push({
    type: "addListener",
    filter: {
        type: "lifecycle",
        name: "activated"
    },
    handler: onActivated
});

// Check if enduserID is in URL 
if (window.location.href.indexOf('opt_id') !== -1) {


    var queryId = getUrlParameter('opt_id');

    if (queryId !== endUserId) {
        var topLevel = window.location.hostname.split('.').slice(-2).join('.');
        setCookie('optimizelyEndUserId', queryId, 60, topLevel);

    }

}

function onActivated() {

    // Provide top level / sub domain changes 
    var domains = ['playhearthstone.com'];

    // EndUserID
    var endUserId = getCookie('optimizelyEndUserId');

    // Create empty <a> list
    var a_tags = [];

    document.addEventListener("DOMContentLoaded", function (event) {
        // Push all <a> with an href that includes one of the provided domains
        for (var i = 0; i < domains.length; i++) {
            var matches = document.querySelectorAll("a[href*='" + domains[i] + "'");

            a_tags = a_tags.concat(matches);
        }

        a_tags[0].forEach(function (tag) {
            tag.href += (tag.href.split('?')[1] ? '&' : '?') + 'opt_id=' + endUserId;
        });
    });


}

// Functions required for this to work 
function getCookie(name) {
    var match = document.cookie.match(name + '=([^;]*)');
    return match ? match[1] : undefined;
};


function setCookie(name, value, days, domain) {
    var d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    document.cookie = name + "=" + value + ";domain=" + domain + ";path=/;expires=" + d.toGMTString();
}


function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};
