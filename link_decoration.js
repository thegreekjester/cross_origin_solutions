window.getCookie = function(name) {
    var match = document.cookie.match(name + '=([^;]*)');
    return match ? match[1] : undefined;
  };
  
  
window.setCookie = function(name, value, days, domain) {
    var d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    document.cookie = name + "=" + value + ";domain=" + domain + ";path=/;expires=" + d.toGMTString();
  };
  
  
window.getUrlParameter = function(sParam) {
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


// Provide top level / sub domain changes
var endUserId = window.getCookie('optimizelyEndUserId');

// Check if enduserID is in URL
if (window.location.href.indexOf('opt_id') !== -1) {

    var queryId = getUrlParameter('opt_id');
  
    if (queryId !== endUserId) {
      var topLevel = window.location.hostname.split('.').slice(-2).join('.');
      window.setCookie('optimizelyEndUserId', queryId, 60, topLevel);
  
  }
}
 
window.addEventListener("load", function(){
  console.log('content loaded');
    var endUserId = window.optimizely ? window.optimizely.get('visitor').visitorId : window.getCookie('optimizelyEndUserId');
    var domains = ['account.bellmedia.ca'];
    var a_tags = [];
    for (var i = 0; i < domains.length; i++) {
      var matches = document.querySelectorAll("a[href*='" + domains[i] + "'");
      a_tags = a_tags.concat(matches);
    }

    a_tags[0].forEach(function(tag) {
      tag.href += (tag.href.split('?')[1] ? '&' : '?') + 'opt_id=' + endUserId;
    });
});


