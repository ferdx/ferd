# A modular slackbot

[![Build Status](https://travis-ci.org/ferdx/ferd.svg?branch=master)](https://travis-ci.org/ferdx/ferd)

Ferd is a modular Slack Bot. It abstracts away the complexity of the Slack Real-Time Messaging API. Use this repo as an open source project to build your own bots, or check out [FerdX](http://ferdx.io) for some fun.

## To Run

Uses ES6. Runs using `node --harmony`

```javascript
var ferdModule = require('ferdModule');
var Ferd = require('ferd');

var ferd = new Ferd(); //create new ferd instance
ferd.addModule(ferdModule); //inject module into ferd
ferd.login(); //bot starts listening
ferd.logout(); //bot stops listening
```

## Creating Ferd Modules

To create modules, use the following syntax:

```javascript
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

For more information on Slack types, check out [https://api.slack.com/types](https://api.slack.com/types).

## Contributing

For contributing, see the [contributing guidelines.](CONTRIBUTING.md)

## Style Guide

If you're contributing, make sure to check out the [style guide.](STYLE-GUIDE.md)

## Team

* Nick Salloum <nick@callmenick.com>
* Timothy Quach <timothyquachbot@gmail.com>
* Andrew Kishino <AndrewKishino@gmail.com>
* David Rosson <david@rosson.com.au>

## License

MIT