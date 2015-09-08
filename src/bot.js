var Slack = require('slack-client');
var rx = require('rx');
var Message = require('./message');

/**
 * Creates a new bot
 * @param {String} apiKey Slack API Key
 */
var Bot = function(apiKey) {
  this.slack = new Slack(apiKey, true, true);
};

Bot.prototype.login = function() {
  rx.Observable.fromEvent(this.slack, 'open')
    .subscribe(this.setUp());
  this.slack.login();
  this.handleMessage();
};

Bot.prototype.handleMessage = function() {
  var messages = rx.Observable.fromEvent(this.slack, 'message')
    .where(e => e.type === 'message')
    .map(e => new Message(e));
  this.messages = messages;
  return messages;
};

Bot.prototype.listen = function(trigger, callback) {
  this.messages
    .filter(matchesTrigger)
    .subscribe(function() {
      callback();
    });

  function matchesTrigger(message) {
    return message.text().match(trigger);
  }
};

Bot.prototype.setUp = function() {
  // set up stuff when bot logs in
};

module.exports = Bot;
