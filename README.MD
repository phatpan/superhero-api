## Step 1 : How to start DynamoDB in Local
1. Download the latest version of DynamoDB in url this https://s3.eu-central-1.amazonaws.com/dynamodb-local-frankfurt/dynamodb_local_latest.tar.gz
2. Unzip the file contents into a new folder. For example, we can call it dynamodb
3. cd dynamodb_local_latest
4. run command line 
``` 
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb

```

## Step 2 : How to prepare data for API
1. cd into project folder
2. Run the command as follows
3. yarn install
4. yarn create-db
5. yann seed-data

## Step 3 : How to start API
1. yarn start