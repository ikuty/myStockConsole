const dynamoCache = require('./dynamoCache');
exports.handler = async (event, context) => {
    const dCache = new dynamoCache();
    let content = await dCache.getContent("https://yahoo.co.jp");
    const response = {
        //event: event, 
        //context: context,
        statusCode: 200, // HTTP 200 OK
        headers: {
            'x-custom-header': 'my custom header value'
        },
        body: JSON.stringify({
            result: dynamoCache.lastStatus,
            content: content
        })
    };
    return response;
};