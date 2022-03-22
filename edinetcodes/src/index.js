const axios = require('axios');
const fs = require('fs');
const {Parse} = require('unzipper');
const {createWriteStream, createReadStream} = require('fs');
const {parse} = require('csv-parse/sync');
const iconv = require('iconv-lite');
const AWS = require("aws-sdk");
const documentclient = new AWS.DynamoDB.DocumentClient();
const dynamoDB = new AWS.DynamoDB();

const url = "https://my-stock-console-temp.s3.ap-northeast-1.amazonaws.com/Edinetcode_20220313.zip";
const tmpdir = "/tmp";
const edicodefile = "edicode.zip";
const csvfilename = 'EdinetcodeDlInfo.csv';

exports.handler = async (event, context) => {
    
    await loadAndSaveZip(url,false);
    await Unzip();
    await loadCsvToDynamoDB();

    const response = {
        //event: event, 
        //context: context,
        statusCode: 200, // HTTP 200 OK
        headers: {
            'x-custom-header': 'my custom header value'
        },
        body: JSON.stringify({
            result: "hoge",
            content: "fuga"
        })
    };
    return response;
};

//zipファイルをダウンロードし/tmpに保存する
async function loadAndSaveZip(url,force=false) {
    //ファイルの存在確認
    const files = fs.readdirSync(tmpdir);
    const fileExists = files.includes(edicodefile);
    if (force||!fileExists) {
        const res = await axios.get(url, {responseType: 'arraybuffer'});
        fs.writeFileSync(tmpdir +"/"+edicodefile, new Buffer.from(res.data), 'binary');
        console.log('file is downloaded.');
        
        
    }
}
//zipファイルを解凍し/tmpに展開する
async function Unzip() {
    const unzip = () => {
        const stream = fs.createReadStream(tmpdir+"/"+edicodefile).pipe(Parse());
        return new Promise((resolve, reject) => {
            stream.on('entry', (entry) => {
                const writeStream = createWriteStream(tmpdir+`/${entry.path}`);
                return entry.pipe(writeStream);
            });
            stream.on('finish', () => resolve());
            stream.on('error', (error) => reject(error));
        });
    };
    await unzip();
    const files = fs.readdirSync(tmpdir);
    console.log(files);
}
//csvを読み込みdynamoDBに書き込む
async function loadCsvToDynamoDB() {
    const data = fs.readFileSync(tmpdir+'/'+csvfilename);
    const str = iconv.decode(data, 'Shift_JIS');
    const records = parse(str, {
        columns: true,
        from_line: 2,
    });
    var requestItems = [];
    for (var i=0; i<records.length; i++) {
        var requestItem = {
            PutRequest: {
                Item: {
                    'security_code': records[i]["証券コード"],
                    "edinet_code": records[i]["ＥＤＩＮＥＴコード"],
                    "industry": records[i]["提出者業種"],
                    "name": records[i]["提出者名"],
                    "name_eng": records[i]["提出者名（英字）"],
                    "name_kana": records[i]["提出者名（ヨミ）"],
                    "address": records[i]["所在地"],
                    "capital": Number(records[i]["資本金"]),
                    "settlement_date":  records[i]["決算日"],
                    "listing_classification": records[i]["上場区分"],
                }
            }
        }
        requestItems.push(requestItem);
    }
    var params = {
        RequestItems : {
            "edinet-codes" :requestItems
        }
    }

    var resultJSON = await documentclient.batchWrite(params,function(err,data){
        console.log(err);
    }).promise();
    console.log("hoge",resultJSON);
    return 0;
}


