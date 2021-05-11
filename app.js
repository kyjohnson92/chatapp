const express = require("express"),
  app = express(),
  http = require("http").createServer(app),
  db = require("./utils/database");
(passport = require("passport")),
  (PORT = 3000 || process.env.PORT),
  (cookieParser = require("cookie-parser")),
  (passport_config = require("./utils/passport-config")),
  (socket = require("./utils/socket")),
  ({
    getIndex,
    postIndex,
    getRegistration,
    postRegistration,
    getChatroom,
  } = require("./utils/routes"));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public/styles"));

//Routes
app.get("/", getIndex);
app.post("/", postIndex);
app.get("/register", getRegistration);
app.get("/chatroom", getChatroom);
app.post("/register", postRegistration);

passport_config(passport);

socket(http, app);

http.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
