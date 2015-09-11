var Slack = require('slack-client');
var rx = require('rx');
var Response = require('./response');

/**
 * TODO: FIGURE OUT HOW TO DESTROY OBSERVABLES
 * BUG: OBSERVABLES MUST BE EXPLICITLY DESTROYED. MEMORY LEAK!
 */

/**
 * Creates a new bot
 * @param {String} apiKey Slack API Key
 */
var Bot = function(apiKey) {
  this.slack = new Slack(apiKey, true, true);
  this.messages = null;
  this.name = null;
  this.id = null;
};

/**
 * Opens WebSocket with slack using API key
 * @return {[type]} [description]
 */
Bot.prototype.login = function() {
  var self = this;
  this.slack.on('open', () => self.setUp() );
  this.slack.on('error', (reason, code) => console.log('socket error: reason ' + reason + ', code ' + code) );
  this.slack.login();
  this.messages = this.createMessageStream();
};

/**
 * Closes WebSocket and cleans up Observables
 * @return {[type]} [description]
 */
Bot.prototype.logout = function() {
  this.slack.disconnect();
  // destroy all observables created from this.messages
};

/**
 * Sets up an Observable message stream
 * @return {[type]} [description]
 */
Bot.prototype.createMessageStream = function() {
  var messages = rx.Observable.fromEvent(this.slack, 'message')
    .where(e => e.type === 'message')
    // .map(e => new Message(e));
  return messages;
};

/**
 * Sets up an Observer to the message stream
 * @param  {Regex}   capture  [description]
 * @param  {Function} callback [description]
 * @return {Observable}            [description]
 */
Bot.prototype.listen = function(capture, callback) {
  return this.hear(function(message) {
    return true;
  }, capture, callback);
};

/**
 * Listens to message stream for bot name and capture
 * @return {[type]} [description]
 */
Bot.prototype.respond = function(capture, callback) {
  var self = this;
  return this.hear(function(message) {
    return message.text.match(new RegExp(self.name, 'i')) ||
      message.text.match(new RegExp('<' + self.id + '>', 'i'));
  }, capture, callback);
};

/**
 * Helper for listen, respond
 * @param  {Function}   filter   [description]
 * @param  {Regex}   capture  [description]
 * @param  {Function} callback [description]
 * @return {Disposable}            [description]
 */
Bot.prototype.hear = function(filter, capture, callback) {
  var self = this;
  var slack = this.slack;
  var messages = this.messages
    .filter(m => filter(m) && m.text.match(capture))

  var disposable = messages
    .subscribe(function(message) {
      // console.log(message.text);
      var response = Response(capture, message, slack)
      callback(response);
    });

  return disposable;
};

/**
 * Bootstraps Bot identity
 */
Bot.prototype.setUp = function() {
  this.name = this.slack.self.name;
  this.id = this.slack.self.id;
};

/**
 * Inject ferd into module
 * @param {Module} ferdModules [description]
 */
Bot.prototype.addModule = function(ferdModule) {
  ferdModule(this);
};

/**
 * Inject ferd into modules
 * @param {Array[Module]} ferdModules [description]
 */
Bot.prototype.addModules = function(ferdModules) {
  var self = this;
  ferdModules.forEach(function(module) {
    module(self);
  });
};

module.exports = Bot;
