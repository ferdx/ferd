# A modular slackbot

Ferd is a modular Slack Bot. It abstracts away the complexity of the Slack Real-Time Messaging API.
# To Run
Uses ES6. Runs using node --harmony
```
var ferdModule = require('ferdModule');
var Ferd = require('ferd');

var ferd = new Ferd(); //create new ferd instance
ferd.addModule(ferdModule); //inject module into ferd
ferd.login(); //bot starts listening
ferd.logout(); //bot stops listening
```

# Slack Modules
```
/* All variables in this closure are accessible by all bots using this module */
var randomYo = ["whats up? ", "hey ", "yo "];
var getRandomYo = function() {
  return randomYo[Math.floor(Math.random() * randomYo.length)];
};

module.exports = function(ferd) {
  /* All variables in this closure are accessible to all listeners in this module */
  var yoCount = 0;

  /* Listens to all messages */
  ferd.listen(/(.*) is (.*)/, function(response) {
    var sender = response.getMessageSender();
    response.send("No, " + sender.name + ", you " + "aren't " + response.match[2]);
  });

  /* Listens to messages tagged with bot's name or mentions bot */
  var listener = ferd.respond(/yo/i, function(response) {
    var sender = response.getMessageSender();
    response.send(getRandomYo() + sender.name);
    yoCount++;
  });

  /* Stops listening on specific listener */
  ferd.ignore(listener);

  /* Say 'hello' to join session and 'goodbye' to leave session.
   * Use to create poker and trivia games.
   */
  ferd.session(/hello/, /goodbye/, function(response) {
    response.send("I hear you... " + response.getMessageSender().name);
  });

  /*  Get all mentions of `yo` since bot's initialization */
  ferd.listen(/how many yo?/ function(response) {
    response.send(yoCount);
  });
};


```
## Slack types

https://api.slack.com/types
