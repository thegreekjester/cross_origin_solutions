var templatePayload = {
    "account_id": 'account123',
    "visitors": [{
        "visitor_id": null,
        "attributes": {},
        "snapshots": [{
            "decisions": [],
            "events": []
        }]
    }],
    "anonymize_ip": true,
    "client_name": "Optimizely/client-side-event-tracker",
    "client_version": "1.0.0",
    "enrich_decisions": true
};

var buildPayload = function (visitorId, events) {
    events = events || [];
    // enrich event data with required data
    events = events.map(function (evt) {
        return Object.assign(evt, {
            uuid: evt.uuid || Math.random().toString(36).substr(2, 10),
            timestamp: evt.timestamp || (new Date).getTime()
        });
    });
    var sendPayload = Object.assign({}, templatePayload, { visitors: [{ attributes: [], visitor_id: visitorId, snapshots: [{ decisions: [], events: events }] }] });
    return sendPayload;
};

var trackEvent = function () {
    var payload = buildPayload.apply(null, arguments);
    console.log('this is your event! ', payload);
    return fetch('https://logx.optimizely.com/v1/events', {
        method: 'post',
        body: JSON.stringify(payload)
    }).then(function (response) {
        if (response.status > 199 && response.status < 300) return Promise.resolve(response);
        return Promise.reject(response);
    });
};

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
}

function onActivated(e) {
    console.log('activated!');
    var visitorId = window.optimizely.get('visitor_id').randomId;
    var session_data = JSON.parse(window.sessionStorage.getItem('optly_data'));
    var utils = window.optimizely.get('utils');
    var data;

    if (session_data) {
        data = session_data;
    } else {
        data = window.optimizely.get('data');
        window.sessionStorage.setItem('optly_data', JSON.stringify(data));
    }

    var tags = [];
    for (var event in data.events) {
        if (data.events[event].eventType === 'click') {
            tags.push({ id: event, selector: data.events[event].eventFilter.selector });
        }
    }
    console.log('tags done', tags);

    tags.forEach(function (obj) {
        var el;
        utils.waitForElement(obj.selector).then(function () {
            el = document.querySelector(obj.selector);
            if (el && el.href) {
                console.log('time to change', el.href);

                el.href += (el.href.split('?')[1] ? '&' : '?') + 'event=' + obj.id;
                el.href += (el.href.split('?')[1] ? '&' : '?') + 'opt_id=' + visitorId;
            }
        });

    });

    if (window.location.href.indexOf('opt_id') !== -1 && window.location.href.indexOf('event') !== -1) {
        var newId = getUrlParameter('opt_id');
        var event = getUrlParameter('event');
        trackEvent(newId, [{
            "entity_id": event
        }])
            .then(function (success) {
                console.log('Success', success);
            }, function (err) {
                console.log('Error', err);
            });

    }
}

window["optimizely"] = window["optimizely"] || [];
window["optimizely"].push({
    type: "addListener",
    filter: {
        type: "lifecycle",
        name: "activated"
    },
    handler: onActivated
});



