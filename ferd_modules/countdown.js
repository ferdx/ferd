module.exports = function(ferd) {

  /**
   * Listens for `countdown` or `countdown help` matches, and sends back some
   * help to the user.
   */
  ferd.listen(/^countdown\s*$|^countdown help\s*$/i, function(response) {
    var sender = response.getMessageSender();
    
    var helpString = 'Hey ' + sender.name + '! Here are the example formats for using the countdown timer:\n'
      + '> `countdown X:YY`, where `X` is a number in minutes, and `Y` is a number in seconds\n'
      + '> `countdown X minutes`, where `X` is a number\n'
      + '> `countdown Y seconds`, where `Y` is a number\n'
      + '> `countdown X minutes Y seconds`, where `X` and `Y` are numbers\n'
      + '> `countdown Xm`, where `X` is a number, and `m` represents minutes\n'
      + '> `countdown Ys`, where `Y` is a number, and `s` represents seconds\n'
      + '> `countdown Xm Ys`, where `X` and `Y` are numbers, and `m` and `s` represent minutes and seconds\n';

    response.send(helpString);
  });
  
  ferd.listen(/countdown\s(\d+)\s(seconds)/i, function(response) {
    var sender = response.getMessageSender();
    var matches = response.match;
    var timerStarted = false;
    var timeRemaining = parseInt(matches[1]);
    var timeString = secondsToString(timeRemaining);
    var timerInterval;
    var m;

    /**
     * Runs the initial logic to check if the user has entered a valid time. If
     * they haven't, inform them and set timerStarted to true. This prevents the
     * updater function from running later. If it is a valid input, however,
     * then kick things off as normal.
     */
    if (timeRemaining <= 0) {
      timerStarted = true;
      m = response.send('Sorry ' + sender.name + ', but you can only use numbers greater than 0 for the countdown! Type `countdown help` for valid countdown formats.');
    } else {
      m = response.send('Time remaining: ' + timeString);
    }

    /**
     * beginCountdown
     *
     * @description [description]
     * @return {[type]}
     */
    var beginCountdown = function() {
      timerInterval = setInterval(function() {
        if (timeRemaining === 0) {
          endCountdown();
        } else {
          timeRemaining = timeRemaining - 1;
          timeString = secondsToString(timeRemaining);
          m.updateMessage('Time remaining: ' + timeString);
        }
      }, 1000);
    };

    /**
     * endCountdown
     *
     * @description [description]
     * @return {[type]}
     */
    var endCountdown = function() {
      clearInterval(timerInterval);
      m.updateMessage('Time up!');
    };

    /**
     * @description An observer on the message object, which lets us know when
     *   it's been posted via the timestamp. If the timestamp has been added,
     *   it means the message has been successfully posted and we can now track
     *   it for future updating.
     * @param {[type]} 
     * @param {[type]} 
     * @return {[type]}
     *
     * TODO: Possibly refactor into a helper outside of this.
     */
    Object.observe(m, function(changes) {
      changes.forEach(function(change) {
        if (timerStarted === false && change.name === 'ts') {
          timerStarted = true;
          beginCountdown();
        }
      });
    }, ['add']);

  });

};

/**
 * secondsToString
 *
 * @description Takes in a number `time` in seconds and converts it to a user
 *   friendly string of format mm:ss.
 * @param {Number} time The time remaining, in seconds
 * @return {String} A stringified format of the time remaining, as mm:ss
 */
function secondsToString(time) {
  var str;
  var remainder = time % 60;
  var minutes = (time - remainder)/60;
  var mm = minutes.toString();
  var ss = remainder.toString();
  if (remainder < 10) { ss = '0' + ss; }
  return mm + ':' + ss;
}