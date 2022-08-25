var configDB = require('./config').configDB;
var tableName = require('./config').tableName;
var AWS = require('aws-sdk');
AWS.config.update(configDB);
var fs = require('fs');
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

async function updateSuperHero(req, res) {
    try {
        if (!req.files) {
            res.send({
                status: "failed",
                message: "No file uploaded",
            });
        } else {
            let file = req.files.file;
            let power_stats = req.body.power_stats;
            let id = req.body.id;

            var params = {
                TableName: tableName,
                Item: {
                    power_stats: { N: power_stats },
                    id: { N: id },
                    image_name: { S: id + '.jpg' },
                    name: { S: req.body.name },
                    synopsis: { S: req.body.synopsis },
                    starring: { S: req.body.starring },
                    directed_by: { S: req.body.directed_by }
                }
            };

            dynamodb.putItem(params, function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    file.mv("./public/images/" + id + ".jpg");
                    res.send({
                        status: "success",
                        message: "File is uploaded",
                        data: {
                            name: file.name,
                            mimetype: file.mimetype,
                            size: file.size,
                        },
                    });
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

function getSuperHeros(req, res) {
    var params = {
        TableName: tableName,
        ProjectionExpression: "#id, #name, #power_stats, #synopsis, #starring, #directed_by, #image_name",
        ExpressionAttributeNames: {
            "#id": "id",
            "#name": "name",
            "#power_stats": "power_stats",
            "#synopsis": "synopsis",
            "#starring": "starring",
            "#directed_by": "directed_by",
            "#image_name": "image_name"
        }
    };

    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(data.Items)
            if (typeof data.LastEvaluatedKey != "undefined") {
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }
        }
    }
}

function getSuperHeroById(req, res) {
    var superHeroID = parseInt(req.param('id'));
    var params = {
        TableName: tableName,
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: {
            "#id": "id"
        },
        ExpressionAttributeValues: {
            ":id": superHeroID
        }
    };

    docClient.query(params, function (err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            let imageName = data.Items[0].image_name
            var image1 = 'public/images/' + imageName;
            const imageBase64 = fs.readFileSync(image1, { encoding: 'base64' });
            res.send({
                "id": data.Items[0].id,
                "name": data.Items[0].name,
                "power_stats": data.Items[0].power_stats,
                "synopsis": data.Items[0].synopsis,
                "starring": data.Items[0].starring,
                "directed_by": data.Items[0].directed_by,
                "image_name": imageBase64
            })
        }
    });
}

module.exports = { updateSuperHero, getSuperHeros, getSuperHeroById };