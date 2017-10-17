var mongo = require('mongodb').MongoClient,
    url = `mongodb://${process.env.mongo_user}:${process.env.mongo_password}@ds141464.mlab.com:41464/financials`,
    db;

mongo.connect(url, function(err, mongoDB) {
    if (err) throw err;
    db = mongoDB;
});

var getStocks = function(sort, sortOrder) {
    return new Promise((resolve, reject) => {
        var mysort = {};
        if (sort && sortOrder) {
            mysort[sort] = sortOrder
        }
        db.collection('stocks').find().sort(mysort).toArray(function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

var upsertMoneyflows = function(data) {
    data.forEach(function(item, index) {
        var query = {symbol: data[index].symbol},
            newValues = data[index],
            options = {upsert: true};
        db.collection('stocks').findAndModify(query, {}, {$set: newValues}, options, function(err, res) {
            if (err) throw err;
        });
    });
};

module.exports = {
    getStocks: getStocks,
    upsertMoneyflows: upsertMoneyflows
};
