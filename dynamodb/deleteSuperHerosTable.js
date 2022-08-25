var tableName = require('../config').tableName;
var configDB = require('../config').configDB;
var AWS = require("aws-sdk");
AWS.config.update(configDB);
var dynamodb = new AWS.DynamoDB();

var params = {
    TableName: tableName
};

dynamodb.deleteTable(params, function (err, data) {
    if (err) {
        console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
