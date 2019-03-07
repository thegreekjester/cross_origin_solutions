//***************CROSS ORIGIN SOLUTION*********************

//Set in Project JS

//Functions needed to make this work

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

function setCookie(name, value, days, domain) {
    var d = new Date;
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    document.cookie = name + "=" + value + ";domain=" + domain + ";path=/;expires=" + d.toGMTString();
}

//The folowing function is what takes the current localStorage and writes it and the current origin to the window.name property

function windowNameInit() {

    var obj = {};
    obj.origin = window.origin;
    for (var key in window.localStorage) {
        if (key.indexOf('optimizely') !== -1) {
            obj[key] = window.localStorage.getItem(key);
        }
    }
    window.name = JSON.stringify(obj);
    return true;

}

//Obj that is made from the window.name attribute
try {
    var syncedLocalStorage = JSON.parse(window.name);
}
catch (error) {
    var syncedLocalStorage = window.name;
}


//object size
var objSize = Object.keys(syncedLocalStorage).length;

//make sure the window.name is filled with local storage stuff and the origin is not the same
if (objSize > 1 && window.origin !== syncedLocalStorage.origin) {


    //Current endUserId in window.name
    var oldEndUserId = Object.keys(syncedLocalStorage)[1].split('$$')[1];

    //The following if statement takes care of manually setting the endUserId if you are crossing top level domains
    if (oldEndUserId !== getCookie('optimizelyEndUserId')) {



        //Current parent domain of the window
        var domain = "." + window.location.hostname.split('.').slice(-2).join('.');


        //set the endUserId now
        setCookie('optimizelyEndUserId', oldEndUserId, 30, domain);
    }

    //This forloop sets the localStorage values from the window.name to the new origin (gets run on both subdomaina and top level domain changes)
    for (var key in syncedLocalStorage) {
        if (key !== 'origin') {
            window.localStorage.setItem(key, syncedLocalStorage[key]);
        }
    }
}

//sets the lifecycle hooks to both snippit iniatlization and the campaign decided events for the windowNameInit function
window["optimizely"] = window["optimizely"] || [];
window["optimizely"].push({
    type: "addListener",
    filter: {
        type: "lifecycle",
        name: "activated"
    },
    handler: windowNameInit
});

window["optimizely"].push({
    type: "addListener",
    filter: {
        type: "lifecycle",
        name: "campaignDecided"
    },
    handler: windowNameInit
});