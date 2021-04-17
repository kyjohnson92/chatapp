const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')
const bcrypt = require('bcrypt')
const db = require('./database')

function initialize(passport, getUserByEmail, getUserById){
    passport.use(new LocalStrategy(
      function(username, password, done) {
        db.get('SELECT username, id, password FROM user WHERE username = ?', username, async function(err, row) {
            if (!row) return done(null, false, { message: 'Incorrect username.' })
            let pwMatch = await bcrypt.compare(password, row.password)
             if(!pwMatch) return done(null, false, { message: 'Incorrect password.' })
                return done(null, row)
        })
    }))
    
    passport.serializeUser(function(user, done) {
        return done(null, user.id);
    })
  
    passport.deserializeUser(function(id, done) {
      db.get('SELECT id, username FROM user WHERE id = ?', id, function(err, row) {
        if (!row) return done(null, false);
          return done(null, row);
    })
  })
}

  module.exports = initialize