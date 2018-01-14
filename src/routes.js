const URLController = require('./controllers/URLController');

module.exports =  [

    {
        method: 'POST',
        path: '/url',
        handler: URLController.shorten
    },
    {
        method: 'GET',
        path: '/{params*}',
        handler: URLController.getURL
    }
];
