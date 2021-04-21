const express = require('express'),
      path = require('path'),
      app = express(),
      http = require('http').createServer(app),
      bcrypt = require('bcrypt'),
      passport = require('passport'),
      session = require('express-session'),
      SQLiteStore = require('connect-sqlite3')(session),
      PORT = 3000 || process.env.PORT,
      cookieParser = require('cookie-parser'),
      io = require('socket.io')(http),
      passportSocketIo = require("passport.socketio"),
      db = require('./utils/database'),
      formatMessage = require('./utils/utils')

const initializePassport = require('./utils/passport-config')
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)
const store = new SQLiteStore
app.use(session({
  store,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.ENVIRONMENT !== 'development' && process.env.ENVIRONMENT !== 'test',
    maxAge: 2419200000
  },
  secret: 'shabba'
}));
app.use(cookieParser())

app.use(passport.initialize())
app.use(passport.session())
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}))
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/public/styles'))


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/', function(req,res, next){
  passport.authenticate('local',function(err, user, info) {
    //console.log(user)
    if (err) { return next(err); }
    if (!user) {
        res.send({err:true, message: info.message}); 
        return next(null)
      }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
        //console.log(user.username)
      
      return res.redirect('/chatroom');
    })
  })(req, res, next);
});

app.get('/register', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/register.html'));
});

app.get('/chatroom', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/chatroom.html'));
});

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const data = {
      name: req.body.username,
      password: hashedPassword
    }
    const sql ='INSERT INTO user (username, password) VALUES (?,?)'
    const params =[data.name, data.password]

    db.get(`SELECT COUNT(*) FROM user WHERE username =  '${data.name}'`, function(error, row){
      if (row['COUNT(*)'] == 0){
        db.run(sql,params)
        console.log('User created')
        res.redirect('/')
      }else{
        console.log(row['COUNT(*)'])
        console.log('Username already exists..')
        res.redirect('/register')
      }
      if(error){
        console.log(error)
        console.log('Username already exists..')
        res.redirect('/register')
      }
  })}
  catch {
    res.redirect('/register')
    }
  })

let userList = [];

  io.use(passportSocketIo.authorize({
    key: 'connect.sid',
    secret: 'shabba',
    store: store,
    passport,
    cookieParser,
    fail: (one, two , three , four) => {
      console.log('im failing')
    }
  })).on('connection', (socket) => {
    console.log('a user connected');

    let user = socket.request.user.username;

    //object of connected users
    if(!userList.includes(user)){
      userList.push(user)}

    //emit list of online users
    io.emit('users', userList );

    //distribute any user messages to all connected clients

    socket.on('chat message', (msg) => {
      io.emit('message', formatMessage(msg, user));
    });

    socket.on('disconnect', () => {
      console.log('a user has disconnected');
      let index = userList.findIndex(id => id === user)
      userList.splice(index, 1)
      io.emit('users', userList )
    })
  });

  
http.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})