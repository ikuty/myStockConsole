var aws = require('aws-sdk');
var docClient = new aws.DynamoDB.DocumentClient({region: 'ap-northeast-1'});
const axios = require('axios');

exports.handler = async (event, context) => {
    var params = {
        TableName : "irbank-page-caches",
        KeyConditionExpression: "#hash = :url",
        ExpressionAttributeNames:{
            "#hash": "url"
        },
        ExpressionAttributeValues: {
            ":url": event.url
        }
    };
    var result = 0;
    let content = "";
    var resultJSON = await docClient.query(params,(err,data)=>{
        if (err) {
            console.log(err,err.stack);
        }
    }).promise();
    if (resultJSON.Items.length > 0) {
        if (resultJSON.Items[0].date == formatDate(getNowJST())) {
            content = resultJSON.Items[0].content;
            result = 1;
        } else {
            const newContent = await getContent();
            updateItem(docClient,event.url,formatDate(getNowJST()),newContent);
            content = newContent;
            result = 2;
        }
    } else {
        const newContent = await getContent();
        putItem(docClient,event.url,formatDate(getNowJST()),newContent);
        content = newContent;
        result = 3;
    }
    const response = {
        //event: event, 
        //context: context,
        statusCode: 200, // HTTP 200 OK
        headers: {
            'x-custom-header': 'my custom header value'
        },
        body: JSON.stringify({
            result: result,
            content: content
        })
    };
    return response;
};

function formatDate(dt) {
  var y = dt.getFullYear();
  var m = ('00' + (dt.getMonth()+1)).slice(-2);
  var d = ('00' + dt.getDate()).slice(-2);
  return (y  + m  + d);
}

function updateItem(docClient,_url,_date,_content) {
    console.log("updateItem");
    let param = {
        TableName: "irbank-page-caches",
        Key: {
            "url": _url
        },
        ExpressionAttributeNames: {
            "#date": "date",
            "#content": "content"
        },
        ExpressionAttributeValues: {
            ":newDate": _date,
            ":newContent": _content
        },
        UpdateExpression: 'set #date = :newDate, #content=:newContent',
    }
    docClient.update(param,function(err, updateResult){
        console.log(JSON.stringify(err));
        console.log('updated.');
    });
}

function putItem(docClient,_url,_date,_content) {
    console.log("putItem");
    let param = {
        TableName: "irbank-page-caches",
        Item: {
            "url": _url,
            "date": _date,
            "content": _content
        }
    }
    docClient.put(param,function(err, updateResult){
        console.log(JSON.stringify(err));
        console.log('put done.');
    });
}

function getNowJST(){
    let date = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    return date;
}

async function getContent(_url) {
    const d = await axios.get('https://yahoo.co.jp');
    return d.data;
}