var Keys   = require('../api_keys.js');
var Event  = require('../app/models/event.js');
//require the Twilio module and create a REST client
var client = require('twilio')(Keys.twilioAccountSid, Keys.twilioAuthToken);

var displayTime = function(time) {
  var dateString = time.toString();
  var hours = dateString.substring(16,18);
  var postfix;
  if (Number(hours) > 12) {
    postfix = 'PM';
    hours = hours - 12;
  } else {
    postfix = 'AM';
  }
  var minutes = dateString.substring(19,21);
  return hours + ':' + minutes + ' ' + postfix;
};

var sendText = function(userPhoneNumber, event, timeoutTime) {
  var eventTime = displayTime(event.eventTime);
  const { eventName, state, mode } = event;
  const address = event.address.replace(/\s/g, '+');
  const city = event.city.replace(/\s/g, '+');
  //send twilio text
  client.sendMessage({
      to: userPhoneNumber,
      from: '+12097011216',
      body:`Hurry Up! Leave now to get to ${eventName} by ${eventTime}. Click here to get directions: http://maps.apple.com/?daddr=${address}+${city}+${state}&dirflg=d&t=m`
    }, function(err, responseData) { //this function is executed when a response is received from Twilio
      if (err) {
        console.log("Error sending Twilio text", err);
      } else {
        console.log(responseData.from); // outputs "+14506667788"
        console.log(responseData.body); // outputs "word to your mother."
      }
    }
  );

  
  //archive event in database after it starts
  var time = parseInt(Date.parse(event.eventTime) - (new Date().getTime()))
  setTimeout(function() {
    new Event({id: event.id})
      .fetch()
      .then(function(event) {
        event.set('hasOccured', 'true')
        console.log(event, 'HIOHEOIFK')
      })
      .catch(function(err) {
        console.log(err);
      });
  }, time);
}

module.exports = sendText;
