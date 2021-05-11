(passport = require("passport")),
  (path = require("path")),
  (bcrypt = require("bcrypt")),
  (db = require("./database"));

const getIndex = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
};

const postIndex = (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.send({ err: true, message: info.message });
      return next(null);
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/chatroom");
    });
  })(req, res, next);
};

const getRegistration = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
};

const postRegistration = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const data = {
      name: req.body.username,
      password: hashedPassword,
    };
    const sql = "INSERT INTO user (username, password) VALUES (?,?)";
    const params = [data.name, data.password];

    db.get(
      `SELECT COUNT(*) FROM user WHERE username =  '${data.name}'`,
      function (error, row) {
        if (row["COUNT(*)"] == 0) {
          db.run(sql, params);
          console.log("User created");
          res.redirect("/");
        } else {
          console.log(row["COUNT(*)"]);
          console.log("Username already exists..");
          res.redirect("/register");
        }
        if (error) {
          console.log(error);
          console.log("Username already exists..");
          res.redirect("/register");
        }
      }
    );
  } catch {
    res.redirect("/register");
  }
};

const getChatroom = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/chatroom.html"));
};

module.exports = {
  getIndex,
  postIndex,
  getRegistration,
  postRegistration,
  getChatroom,
};
