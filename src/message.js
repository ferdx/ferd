var Message = function(json) {
  this.json = json;
};

Message.prototype.text = function() {
  return this.json.text;
};

Message.prototype.user = function() {
  return this.json.user;
};

Message.prototype.channel = function() {
  return this.json.channel;
};
Message.prototype.team = function() {
  return this.json.team;
};
Message.prototype.ts = function() {
  return this.json.ts;
};

module.exports = Message;
