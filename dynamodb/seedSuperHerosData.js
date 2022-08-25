var tableName = require('../config').tableName;
var configDB = require('../config').configDB;
var AWS = require("aws-sdk");
var fs = require('fs');
AWS.config.update(configDB);

var docClient = new AWS.DynamoDB.DocumentClient();
var superHeros = JSON.parse(fs.readFileSync('../seeds/superHerosData.json', 'utf8'));

superHeros.forEach(function (superHero) {
    var params = {
        TableName: tableName,
        Item: {
            "id": superHero.id,
            "name": superHero.name,
            "power_stats": superHero.power_stats,
            "synopsis": superHero.synopsis,
            "starring": superHero.starring,
            "directed_by": superHero.directed_by,
            "image_name": superHero.image_name
        }
    };

    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add Super Hero", superHero.name, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:", superHero.name);
        }
    });
});
