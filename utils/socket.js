const session = require("express-session"),
  SQLiteStore = require("connect-sqlite3")(session),
  socketio = require("socket.io"),
  passport = require("passport"),
  cookieParser = require("cookie-parser"),
  passportSocketIo = require("passport.socketio"),
  formatMessage = require("./utils");

const initializeIO = (http, app) => {
  const io = socketio(http);

  const store = new SQLiteStore();
  app.use(
    session({
      store,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 2419200000,
      },
      secret: "shabba",
    })
  );

  //to store 'online' users
  let userList = [];

  io.use(
    passportSocketIo.authorize({
      key: "connect.sid",
      secret: "shabba",
      store: store,
      passport,
      cookieParser,
      fail: (one, two, three, four) => {
        console.log("Failed to Connect");
      },
    })
  ).on("connection", (socket) => {
    console.log("a user connected");

    let user = socket.request.user.username;

    //object of connected users
    if (!userList.includes(user)) {
      userList.push(user);
    }

    //emit list of online users
    io.emit("users", userList);

    //distribute any user messages to all connected clients

    socket.on("chat message", (msg) => {
      io.emit("message", formatMessage(msg, user));
    });

    socket.on("disconnect", () => {
      console.log("a user has disconnected");

      //remove user from online user list on disconnect
      let index = userList.findIndex((id) => id === user);
      userList.splice(index, 1);
      io.emit("users", userList);
    });
  });
};

module.exports = initializeIO;
