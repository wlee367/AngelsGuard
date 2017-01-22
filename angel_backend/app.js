var mongojs = require("mongojs");
var database = mongojs("hypetrain:RubsArm@localhost/angel?authSource=angel", [ "users", "events" ]);

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('/etc/nginx/ssl/rsakey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/nginx/ssl/rsa_chain.pem', 'utf8');

var credentials = {
    key: privateKey,
    cert: certificate
};
var express = require('express');
var app = express();

var twilio = require('twilio');

// new rest API
var client = new twilio.RestClient('AC6229c24ae97164091dca4665bb7a34c0', '782f457990a5f7c73f4f28373268e880');

//Set up the HTTPS connection
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(777);

app.use(function (req, res, next) {
    //var allowedOrigins = ['https://web.lignite.me:8443/check_account/', 'https://web.lignite.me:8443/create_new/', 'https://web.lignite.me:8443', 'web.lignite.me:8443'];
    var origin = req.headers.origin ? req.headers.origin : req.headers.host;

    //console.log("req " + JSON.stringify(req.headers));
    //if(allowedOrigins.indexOf(origin) > -1){
    res.setHeader('Access-Control-Allow-Origin', origin);
    //}
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});

// app.post("/anything", function (req, res) {
//     var data = '';
//     req.on('data', function(chunk) {
//         data += chunk + "";
//     }).on('end', function() {
//         //Parse the data sent in the request
//         var jsonData = undefined;
//         try{
//             jsonData = JSON.parse(data);
//         }
//         catch(error){
//             return;
//         }
//     });
// });

function generateID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i = 0; i < 6; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text.toUpperCase();
}

app.post("/user/register", function (req, res) {
    var data = '';
    req.on('data', function(chunk) {
        data += chunk + "";
    }).on('end', function() {
        //Parse the data sent in the request
        var jsonData = undefined;
        try{
            jsonData = JSON.parse(data);
        }
        catch(error){
            return;
        }

        var newUser = {
            "userID": "facebookUserID",
            "event": "uofthacks_3839100394",
            "details": {
                "wearing": "",
                "description": "",
                "photo": ""
            },
            "phone": "+1-226-218-6744",
            "angel": false
        };

        database.users.insert(newUser, function(error, docs){
            if(error){
                return console.error("Error registering user into database: " + error);
            }

            console.log("Success creating user with facebookUserID " + newUser.userID);

            res.writeHead(200);
            res.end(JSON.stringify({
                "result": 200,
                "message": "User registered successfully"
            }));
        });
    });
});

app.post("/user/get", function (req, res) {
    var data = '';
    req.on('data', function(chunk) {
        data += chunk + "";
    }).on('end', function() {
        //Parse the data sent in the request
        var jsonData = undefined;
        try{
            jsonData = JSON.parse(data);
        }
        catch(error){
            return;
        }

        var searchObject = { "userID":"Annie" };

        database.users.find(searchObject, function(error, docs){
            if(error){
                res.writeHead(200);
                res.end(JSON.stringify({
                    "result": 500,
                    "message": "Error finding user"
                }));
                return console.error("Error registering user into database: " + error);
            }

            console.log("Got ")

            var user = docs[0];
            res.writeHead(200);
            res.end(JSON.stringify({
                "result": 200,
                "message": "Got user",
                "user": user
            }));
        });
    });
});

app.post("/user/update", function (req, res) {
    var data = '';
    req.on('data', function(chunk) {
        data += chunk + "";
    }).on('end', function() {
        //Parse the data sent in the request
        var jsonData = undefined;
        try{
            jsonData = JSON.parse(data);
        }
        catch(error){
            return;
        }

        var searchObject = { "userID":jsonData.userID };

        database.users.find(searchObject, function(error, docs){
            if(error){
                res.writeHead(200);
                res.end(JSON.stringify({
                    "result": 500,
                    "message": "Error finding user"
                }));
                return console.error("Error registering user into database: " + error);
            }

            console.log("Got ")

            var user = docs[0];
            var newUser = user;
            newUser.details = jsonData.details;
            newUser.phoneNumber = jsonData.phoneNumber;

            database.users.update(searchObject, newUser, function(updateError, updateDocs){
                if(updateError){
                    res.writeHead(200);
                    res.end(JSON.stringify({
                        "result": 200,
                        "message": "Error updating databaase with new user info"
                    }));
                    return console.error("Error updating database " + updateError);
                }

                res.writeHead(200);
                res.end(JSON.stringify({
                    "result": 200,
                    "message": "User info updated",
                    "databaseResponse": updateDocs
                }));
            })
        });
    });
});

app.post("/event/find", function (req, res) {
    var data = '';
    req.on('data', function(chunk) {
        data += chunk + "";
    }).on('end', function() {
        //Parse the data sent in the request
        var jsonData = undefined;
        try{
            jsonData = JSON.parse(data);
        }
        catch(error){
            return;
        }

        var searchObject = { "eventID":jsonData.eventID };

        database.events.find(searchObject, function(error, docs){
            if(error){
                res.writeHead(200);
                res.end(JSON.stringify({
                    "result": 500,
                    "message": "Error finding user"
                }));
                return console.error("Error registering user into database: " + error);
            }

            console.log("Got ")

            if(docs.length !== 1){
                res.writeHead(200);
                res.end(JSON.stringify({
                    "result": 400,
                    "message": "Event not found, sorry"
                }));
                return;
            }

            var jevent = docs[0];

            res.writeHead(200);
            res.end(JSON.stringify({
                "result": 200,
                "message": "Found event",
                "jevent":jevent
            }));

        });
    });
});

app.post("/user/danger", function (req, res) {
    var data = '';
    req.on('data', function(chunk) {
        data += chunk + "";
    }).on('end', function() {
        //Parse the data sent in the request
        var jsonData = undefined;
        try{
            jsonData = JSON.parse(data);
        }
        catch(error){
            return;
        }

        console.log("Someone needs saving! Let's sort them out!");

        database.users.find({ "userID": jsonData.userID }, function(error, docs){
            if(error){
                return console.error("Error registering user into database: " + error);
            }

            var userDescription = "Angel alert! ";
            userDescription += docs[0].userID + " needs help. They are wearing '" + docs[0].details.wearing + "'. ";
            userDescription += "They also noted these things: '" + docs[0].details.description + "'. ";
            userDescription += "Please go help them out.";

            console.log("Len " + userDescription.length);

            for(var i = 0; i < userDescription.length; i+=95){
                console.log("i " + i);
                if(i === 0){
                    res.writeHead(200);
                    res.end(JSON.stringify({
                        "result": 200,
                        "message": "User has been marked as in danger and someone will come help"
                    }));
                }

                var partUserDescription = userDescription.substring(i);
                partUserDescription = partUserDescription.substring(0, (partUserDescription.length > 95 ? 95 : partUserDescription.length));

                var smsMessageObject = {
                    to:'+12263771048',
                    // to: '+12262186744',
                    from:'+12262712092',
                    body:partUserDescription
                };

                console.log("Sending to angels: " + JSON.stringify(smsMessageObject));

                // return;

                client.sms.messages.create(smsMessageObject, function(error, message) {
                    // The HTTP request to Twilio will run asynchronously. This callback
                    // function will be called when a response is received from Twilio
                    // The "error" variable will contain error information, if any.
                    // If the request was successful, this value will be "falsy"
                    if (!error) {
                        // The second argument to the callback will contain the information
                        // sent back by Twilio for the request. In this case, it is the
                        // information about the text messsage you just sent:
                        console.log('Success! The SID for this SMS message is:');
                        console.log(message.sid);

                        console.log('Message sent on:');
                        console.log(message.dateCreated);
                    } else {
                        console.log('Oops! There was an error ' + JSON.stringify(error));

                        if(i === 0){
                            res.writeHead(200);
                            res.end(JSON.stringify({
                                "result": 200,
                                "message": "Error in warning as dangered " + error
                            }));
                        }
                    }
                });
            }
        });
    });
});

app.post("/event/create", function (req, res) {
    var data = '';
    req.on('data', function(chunk) {
        data += chunk + "";
    }).on('end', function() {
        //Parse the data sent in the request
        var jsonData = undefined;
        try{
            jsonData = JSON.parse(data);
        }
        catch(error){
            return;
        }

        if(!jsonData.userID){
            res.writeHead(200);
            res.end(JSON.stringify({
                "result": 400,
                "message": "Please include the user ID in your call"
            }));
            return;
        }

        var searchUser = {
            "userID": jsonData.userID
        };

        database.users.find(searchUser, function(userError, userDocs){
            if(userError){
                return console.error("Error finding user from database: " + userError);
            }

            if(userDocs.length !== 1){
                res.writeHead(200);
                res.end(JSON.stringify({
                    "result": 500,
                    "message": "Somehow, " + userDocs.length + (userDocs.length === 1 ? " user has " : " users have ") + "this userID: " + searchUser.userID
                }));
                return;
            }
            else{
                var user = userDocs[0];
                var newEvent = {
                    "creator": {
                        "userID": user.userID
                    },
                    "name": jsonData.name,
                    "eventID": generateID(),
                    "time": {
                        "begins": Date.now(),
                        "ends": Date.now() + (60*60*1000)
                    }
                };

                database.events.insert(newEvent, function(eventError, eventDocs){
                    if(eventError){
                        res.writeHead(200);
                        res.end(JSON.stringify({
                            "result": 500,
                            "message": "Error inserting new event " + eventError
                        }));
                        return;
                    }

                    res.writeHead(200);
                    res.end(JSON.stringify({
                        "result": 200,
                        "message": "Event created!",
                        "id": newEvent.eventID
                    }));

                    console.log("Event created!");
                });
            }
        });
    });
});

console.log("The Angel API is live!");