// Configuration
module.exports = function() {
    var configObj = {
        // Host Server Setting
        application: {
            port: 3000
        },
        // Mongo DB Setting
        database: {
            host: 'mongodb://localhost:27017/url',
            user: '',
            password: ''
        }
    };
    return configObj;
}();
