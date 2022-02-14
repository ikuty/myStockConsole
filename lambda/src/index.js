exports.handler = async (event, context) => {

    const response = {

        foo: 'Hello, world',
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
