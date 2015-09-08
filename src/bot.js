var Slack = require('slack-client');
var rx = require('rx');
var Message = require('./message');
var Response = require('./response');

/**
 * Creates a new bot
 * @param {String} apiKey Slack API Key
 */
var Bot = function(apiKey) {
  this.slack = new Slack(apiKey, true, true);
};

/**
 * Opens WebSocket with slack using API key
 * @return {[type]} [description]
 */
Bot.prototype.login = function() {
  rx.Observable.fromEvent(this.slack, 'open')
    .subscribe(this.setUp());
  this.slack.login();
  this.handleMessage();
};

/**
 * Sets up an Observable message stream
 * @return {[type]} [description]
 */
Bot.prototype.handleMessage = function() {
  var messages = rx.Observable.fromEvent(this.slack, 'message')
    .where(e => e.type === 'message')
    .map(e => new Message(e));
  this.messages = messages;
  return messages;
};

/**
 * Sets up an Observer to the message stream
 * BUG: Filter by match before creating Response.
 * @param  {[type]}   trigger  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Bot.prototype.listen = function(trigger, callback) {
  var slack = this.slack;
  this.messages
    .map(message => Response(trigger, message, slack))
    .filter(response => response !== null)
    .subscribe(function(response) {
      callback(response);
    });
};

/**
 * TODO: ???
 */
Bot.prototype.setUp = function() {
  // set up stuff when bot logs in
};

module.exports = Bot;
