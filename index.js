const Hapi = require('hapi');
const routes = require('./src/routes.js');
const config = require('./src/config');
const Inert = require('inert');
const pubRoute = require('./src/config/public.js');
// Include Mongoose ORM to connect with database
var mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(config.database.host,{useMongoClient: true});

// Start Host Server
const server = Hapi.server(config.application);

// Initialize View Engine
const liftOff = async () => {  
    await server.register({
      plugin: require('vision')
    })
    server.views({
        engines: {
            html: require('handlebars')
        }
    });
};
liftOff();

// Prepare preResponse behavior 
const preResponse = function (request, h) {

    const response = request.response;

    // No Boom = No Error, Continue
    if (!response.isBoom) {
        return h.continue;
    }

    // Replace error with friendly HTML

    const error = response;
    const ctx = {
        statusCode: error.output.statusCode,
        message: error.message
    };

    // Return Error Page 
    return h.view('error', ctx).code(error.output.statusCode);
};
server.ext('onPreResponse', preResponse);

// Setting Controller route
for (let route in routes) {
    server.route(routes[route]);
}
// Start the server
const start = async () => {

    try {
        // Register Static file for Frontend
        await server.register(Inert);
        server.route(pubRoute);

        // Start!!
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();

