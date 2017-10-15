var mongo = require('mongodb').MongoClient,
    url = `mongodb://${process.env.mongo_user}:${process.env.mongo_password}@ds119565.mlab.com:19565/stocks`,
    db;

mongo.connect(url, function(err, mongoDB) {
    if (err) throw err;
    db = mongoDB;
});

var upsertMoneyflows = function(data) {
    data.forEach(function(item, index) {
        var query = {symbol: data[index].symbol},
            newValues = data[index],
            options = {upsert: true};
        db.collection('moneyflows').findAndModify(query, {}, {$set: newValues}, options, function(err, res) {
            if (err) throw err;
        });
    });
}

module.exports = {
    upsertMoneyflows: upsertMoneyflows
}
