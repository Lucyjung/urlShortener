const URLModel = require('../models/URL') ;
const Boom = require('boom');

module.exports = {
    // ********************************************//
    // Name: shorten
    // Description: Post event handler to create entry
    //              in database (generate shorten URL if not provided)
    // Parameter:  
    //   request : Request Object of Hapi framework
    //   h       : Response like object of Hapi framework
    //   
    // Payload 
    //   url     : Input URL (Required) 
    //   requestedURL : Requested URL (Optional) 
    // ********************************************//
    shorten:  (request, h) =>{
        // Validate Input 
        if (request.payload.url){

            // Prepare data to create in DB
            let data = { url: request.payload.url };
            
            return new Promise(resolve => {
                // If requested URL is provided, check existance and create if not duplicate
                if (request.payload.requestedURL){

                    // Append Data 
                    data.shorten = request.payload.requestedURL;

                    // Existance Checking 
                    URLModel.findOne({shorten: data.shorten}, function (err, exist) {
                        if (exist) {
                            // Duplicate, then error !!
                            let response = h.response({
                                status: false,
                                msg: 'Error !! Requested URL Duplicated',
                            });
                            resolve(response) ;
                        } else {
                            // Good to go, then create !!
                            createURL(request, h, data, (response)=>{
                                resolve(response);
                            });
                        }
                    });
                }
                else{
                    // No requested URL then just create !!
                    createURL(request, h, data, (response)=>{
                        resolve(response);
                    });
                }
                
            });
        }
        else{

            // Invalid Input
            let response = h.response({
                status: false,
                msg: 'Error !! URL is required',
                url: ''
            });
            return response;
        }
        

        
    },
    // ********************************************//
    // Name: getURL
    // Description: get event handler to create entry
    //              in database (generate shorten URL if not provided)
    // Parameter:  
    //   request : Request Object of Hapi framework
    //   h       : Response like object of Hapi framework
    //   
    // Host Param: 
    //   url     : shorten URL
    // 
    // Query: None
    //  
    // ********************************************//
    getURL:  (request, h)=>{
        // URL checking, if empty then just return "Index" page
        // otherwise, it might be shorten URL, get the original and return full link
        if (request.params.params !=  '' ){

            // get query data
            let url = request.params.params;
            return new Promise(resolve => {

                // Query data from DB
                URLModel.findOne({shorten: url}, function (err, data) {
                    if (err) {
                        // Connection Error!
                        const error = Boom.serverUnavailable('Database Error');
                        resolve(error) ;
                    } else {
                        if (!data) {
                            // Not found URL in database!
                            const error = Boom.notFound('URL Not Found');
                            resolve( error);
                        } else {
                            // Found! Redirect to original URL
                            resolve (h.redirect(data.url));
                        }
                    }
                });
            });
            
        }else{
            // Index View Page
            return h.view('index');
        }
    },
};
// ********************************************//
// Name: createURL
// Description: Create Database entry based on 
//              given data
// Parameter:  
//   request : Request Object of Hapi framework
//   h       : Response like object of Hapi framework
//   data    : data to be created 
//   cb      : callback function 
// ********************************************//
function createURL(request, h, data,cb){
    URLModel.create(data, function (err, data) {
        // URL = Protocol + hostname + shorten URL 
        let url = request.server.info.protocol + 
        '://' + request.info.host 
        + '/' + data.shorten;
        let response = h.response({
            status: true,
            msg: 'URL Shorten Success ',
            url: url
        });
        // Callback Once we done
        cb(response);
    });
}