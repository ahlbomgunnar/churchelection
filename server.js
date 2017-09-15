// Express
var express = require('express');
var router = express();

// Server data
var oldData = require('./data/data.js');

// Socket.io server
var http = require('http');
var server = http.Server(router);
var io = require('socket.io')(server);

// Pug
const pug = require('pug');
router.set('view engine', 'pug');
router.set("views", __dirname + "/views");

// Routes
router.get('/', function(req, res)        { res.render('index') })
router.get('/vote', function (req, res)   { res.render('vote') })
router.get('/result', function (req, res) { res.render('result', { data:oldData }) })
router.get('*', function(req, res)        { res.render('error') })

// Socket server handler
io.on('connection', (socket) => {
  io.emit('clientConnection', oldData);
  // On change in data
  socket.on('update', (object) => {
    // For every voting areas in use, find specific vote area
    let newData = oldData;
  	for(let x in newData) {
      // If requested voting area
      if(newData[x].place === object.place) {
        // Find specific party
        for(let y in newData[x].party) {
          if(newData[x].party[y].name === object.party) {
            newData[x].party[y].votes = parseInt(object.votes);
            // Save data
            oldData = newData;
            break;
          }
        }
      } 
    }
    // Emit updated data
    io.emit('dataUpdate', oldData);
    // Emit user confirmation
    socket.emit('clientConfirmation', object);
  });

})

// Server start
server.listen(3000, () => { console.log('Server avaliable at localhost:3000'); })

