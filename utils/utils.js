  //function to get current user time hhmm
  function timeNow() {
    return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function formatMessage(text) {
    return {
      //username,
      text,
      time: timeNow()
    };
  }

module.exports = formatMessage