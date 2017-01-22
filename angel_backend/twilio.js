//load twilio
var twilio = require('twilio');

// new rest API
var client = new twilio.RestClient('AC6229c24ae97164091dca4665bb7a34c0', '782f457990a5f7c73f4f28373268e880');

client.sms.messages.create({
    to:'+12263771048',
    from:'+12262712092',
    body:'From: Jane Finch, Wearing: Red Top, Description: I am wearing Guitar Shaped Earrings, Message: I am in Danger '
}, function(error, message) {
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
        console.log('Oops! There was an error.');
    }
});

