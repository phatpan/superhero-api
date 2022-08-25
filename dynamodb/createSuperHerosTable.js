var tableName = require('../config').tableName;
var configDB = require('../config').configDB;
var AWS = require("aws-sdk");
AWS.config.update(configDB);
var dynamodb = new AWS.DynamoDB();

var params = {
    TableName: tableName,
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH" },

    ],
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "N" },

    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

dynamodb.createTable(params, function (err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
