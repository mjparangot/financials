var interval = 1000; // 1000 ms/sec * 60 sec/min * 60 min/hr = 1 hr

var start = function() {
    setInterval(function() {
        console.log("Hello");
    }, interval);
}

module.exports = {
    start: start
}
