/*
Load Twilio configuration from .env config file - the following environment
variables should be set:
process.env.TWILIO_ACCOUNT_SID
process.env.TWILIO_API_KEY
process.env.TWILIO_API_SECRET
process.env.TWILIO_CONFIGURATION_SID
*/

require('dotenv').load();
var path = require('path');
var AccessToken = require('twilio').AccessToken;
var VideoGrant = AccessToken.VideoGrant;
var express = require('express');
var randomUsername = require('./randos');


var sentimentAnalysis = require('sentiment-analysis');
var sentiment = require('sentiment');

var bodyParser = require('body-parser');


// Create Express webapp
var app = express();
app.use(express.static(path.join(__dirname, 'public')));

// Allen: use text parser instead
app.use(bodyParser.text());
/*
Generate an Access Token for a chat application user - it generates a random
username for the client requesting a token, and takes a device ID as a query
parameter.
*/


app.post('/sentiment', function(request, response){   
    console.log(request.body + " is the body");
    response.send("HeLLOOvkhvjhvjhcj");
});

app.get('/token', function(request, response) {
    var identity = randomUsername();
    
    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    var token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET
    );

    // Assign the generated identity to the token
    token.identity = identity;

    //grant the access token Twilio Video capabilities
    var grant = new VideoGrant();
    grant.configurationProfileSid = process.env.TWILIO_CONFIGURATION_SID;
    token.addGrant(grant);

    // Serialize the token to a JWT string and include it in a JSON response
    response.send({
        identity: identity,
        token: token.toJwt()
    });
});





// Create http server and run it
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Express server running on *:' + port);
});
