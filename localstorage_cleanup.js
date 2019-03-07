var size_string = localStorageSpace();
var size_array = size_string.split(' ');

// If the local storage space is above 9MB (10 MB is the limit per origin)
if(parseInt(size_array[0]) > 9000){

    // Disable cross origin sync
    window["optimizely"].push({
        "type": "disableCrossOrigin"
      });
    
    // Delete all optimizely related local storage data
    for (var key in window.localStorage){
        if(key.indexOf('optimizely') !== -1){
            window.localStorage.removeItem(key)
        }
    }
}

// Function that returns size of local storage on current origin (max is 10 MB)
var localStorageSpace = function(){
    var allStrings = '';
    for(var key in window.localStorage){
        if(window.localStorage.hasOwnProperty(key)){
            allStrings += window.localStorage[key];
        }
    }
    return allStrings ? 3 + ((allStrings.length*16)/(8*1024)) + ' KB' : 'Empty (0 KB)';
};
