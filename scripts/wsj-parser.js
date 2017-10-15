var Baby = require('babyparse'),
    fs = require('fs'),
    request = require('request'),
    mongo = require('./mongo');

var getMoneyflows = function(buy) {
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
                resolve(parsed.data);
            } else {
                reject(error);
            }
        });
    })
};

var parseMoneyflows = function(data, flow) {
    var parsed = [],
        index = 3;
    while (data[index] != null) {
        var obj = {
            company:                data[index][0],
            name:                   data[index][0].substring(0, data[index][0].lastIndexOf('(') - 1),
            symbol:                 data[index][0].substring(data[index][0].lastIndexOf('(') + 1, data[index][0].lastIndexOf(')')),
            price:                  data[index][1],
            change:                 data[index][2],
            percent_change:         data[index][3],
            one_week_change:        data[index][4],
            total_money_flow:       data[index][5],
            total_tick_up:          data[index][6],
            total_tick_down:        data[index][7],
            total_up_down_ratio:    data[index][8],
            block_money_flow:       data[index][9],
            block_tick_up:          data[index][10],
            block_tick_down:        data[index][11],
            block_up_down_ratio:    data[index][9],
            timestamp:              data[0][0].substring(data[0][0].indexOf(',') + 3, data[0][0].length),
            flow:                   flow
        };
        parsed.push(obj);
        index++;
    }
    mongo.upsertMoneyflows(parsed);
    return parsed;
}

var getBuyStocks = function() {
    return new Promise((resolve, reject) => {
        getMoneyflows(true).then((data) => {
            if (!data) {
                reject('error');
            } else {
                resolve(parseMoneyflows(data, 'buy'));
            }
        })
    });
}

var getSellStocks = function() {
    return new Promise((resolve, reject) => {
        getMoneyflows(false).then((data) => {
            if (!data) {
                reject('error');
            } else {
                resolve(parseMoneyflows(data, 'sell'));
            }
        })
    });
}

module.exports = {
    getMoneyflows: getMoneyflows,
    getBuyStocks: getBuyStocks,
    getSellStocks: getSellStocks
};
