var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.json());
User =require('./models/user');
var jwt = require('jsonwebtoken');
mongoose.connect('mongodb://localhost/users');
var db = mongoose.connection;
var ObjectId = require('mongoose').Types.ObjectId;
var mcache = require('memory-cache');

var cache = (duration) => {
  return (req, res, next) => {
    let key = 'express' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}

app.post('/api/login', (req,res) =>{
  const user = { id: 3 };
  const token = jwt.sign({ user: user.id }, 'secret_key');
  res.json({
    message: 'Use this token!',
    token: token
  });
});

app.get('/api/user', usToken,cache(10), (req, res)=> {
   setTimeout(() => {
  jwt.verify(req.token, 'secret_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      User.getPersons((err, persons) => {
        if (err) {
          console.log('error!');
        } else {
          res.json(persons);
           message: 'Show user';
          console.log('Show all users');
        }
      });
    }           
  });
   }, 3000)
});

app.post('/api/user', usToken,  (req, res) => {
  jwt.verify(req.token, 'secret_key', function(err, data) {
     if (err) {
      res.sendStatus(403);
    } else {
  var user = req.body;
  User.addUser(user, (err, user) => {
    if (err) {
      console.log('error!');
    } else {
    res.json(user);
    message: 'Add user';
    console.log('Add user');}
  });
}
});
});

app.get('/api/user/:id',usToken,cache(10), function (req, res) {
   setTimeout(() => {
   jwt.verify(req.token, 'secret_key', function(err, data) {
     if (err) {
      res.sendStatus(403);
    } else {
  var id = req.params.id;
  User.findOne({"_id": ObjectId(id)}, function(err, doc) {
     res.json(doc);
      message: 'Show user';
    console.log('Show user id' + ObjectId(id));
  });
}
});
}, 3000)
});

function usToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(3000, function () {
  console.log('Port 3000');
});