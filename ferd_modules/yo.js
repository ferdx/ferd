module.exports = function(ferd) {
  var yoCount = 0;

  ferd.listen(/(.*) is (.*)/, function(response) {
    var sender = response.getMessageSender();
    response.send("No, " + sender.name + ", you " + "aren't " + response.match[2]);
  });

  var a = ferd.listen(/yo/i, function(response) {
    var sender = response.getMessageSender();
    response.send(getRandomYo() + sender.name);
    yoCount++;
  });
  // ferd.ignore(a);

  ferd.session(/hello/, /goodbye/, function(response) {
    response.send("I hear you... " + response.getMessageSender().name);
  });

};

var randomYo = ["whats up? ", "hey ", "yo "];
var getRandomYo = function() {
  return randomYo[Math.floor(Math.random() * randomYo.length)];
};
