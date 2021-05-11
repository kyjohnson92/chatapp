//function to get current user time hhmm
const timeNow = () => {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMessage = (text, user) => {
  return {
    user,
    text,
    time: timeNow(),
  };
};

module.exports = formatMessage;
