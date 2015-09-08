var Response = function(trigger, message, slack, match) {
  this.message = message;
  this.trigger = trigger;
  this.slack = slack;
  this.match = match
};


Response.prototype.send = function(response) {
  var channelId = this.message.channel();
  var channel = this.slack.getChannelGroupOrDMByID(channelId);
  channel.send(response);
};

var ResponseFactory = function(trigger, message, slack) {
  var match = message.text().match(trigger);
  if (match) return new Response(trigger, message, slack, match);
  else return null;
};

module.exports = ResponseFactory;
