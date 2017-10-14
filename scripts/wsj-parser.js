var Baby = require('babyparse'),
    fs = require('fs'),
    request = require('request');

var parse = function(buy) {
    return new Promise((resolve, reject) => {
        var url;
        if (buy) {
            url = 'http://www.wsj.com/mdc/public/npage/2_3045-mfgppl-mfxml2csv.html';
        } else {
            url = 'http://www.wsj.com/mdc/public/npage/2_3045-mflppg-mfxml2csv.html';
        }
        request.get(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                var csv = body;
                var parsed = Baby.parse(csv, {
                    skipEmptyLines: true,
                    delimiter: '\t'
                });
                resolve(parsed);
            } else {
                reject(error);
            }
        });
    })
};

module.exports = {
    parse: parse
};
