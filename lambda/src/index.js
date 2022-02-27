var aws = require('aws-sdk');
var docClient = new aws.DynamoDB.DocumentClient({region: 'ap-northeast-1'});
const https = require('axios');

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
    var resultJSON = await docClient.query(params, function(err, data) {  
        if (err) {
            // エラーの場合、コンソールにエラー情報を表示
            console.log(err, err.stack);
        }else{
            if (data.Items.length >0) {
                if (data.Items[0].date == formatDate(getNowJST())) {
                    console.log("Cache returned.");
                } else {
                    let content = getContent(event.url);
                    updateItem(docClient,event.url,formatDate(getNowJST()),content);
                    console.log("Cache updated.");
                }
            } else {
                console.log("empty");
                putItem(docClient,event.url,formatDate(getNowJST()),"hoge2");
            }
            // 取得できた場合、データをコンソールに表示
            console.log(data.Items);
//            console.log(data);
      }
    }).promise();

    const response = {

        foo: 'Hello, world 2!!',
        bar: 'Goodbye, world',
        event: event, 
        context: context,

        statusCode: 200, // HTTP 200 OK
        headers: {
            'x-custom-header': 'my custom header value'
        },
        body: JSON.stringify({
            foo: 'Hello, world',
            bar: 'Goodbye, world',
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

function getContent(_url) {
    return "hgoehgoe";
}