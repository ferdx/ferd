module.exports = function(ferd) {
  var yoCount = 0;

  ferd.listen(/(.*) is (.*)/, function(response) {
    var sender = response.getMessageSender();
    response.send("No, " + sender.name + ", you " + "aren't " + response.match[2]);
  });

  ferd.listen(/yo/i, function(response) {
    var sender = response.getMessageSender();
    response.send(getRandomYo() + sender.name);
    yoCount++;
  });

  ferd.listen(/how many yo?/i, function(response) {
    response.send("You've said yo " + yoCount + " times");
  });

};

var randomYo = ["whats up? ", "hey ", "yo "];
var getRandomYo = function() {
  return randomYo[Math.floor(Math.random() * randomYo.length)];
};
