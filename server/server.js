import { getMessagesMySQL, sendMessageMySQL, newUserMySQL, authenticateUserMySQL, getHashMySQL } from './database.js'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import bcrypt from 'bcrypt'

const MESSAGES_TO_SHOW = 10

const COST_FACTOR_SALT = 10

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  },
})
app.use(express.json());

app.get('/messages', async (req, res) => {
  const newMessages = await getMessagesMySQL(MESSAGES_TO_SHOW);
  // console.log(req.params);
  res.send(newMessages);
});

io.on('connection', (socket) => {
  
  console.log('New client connected:', socket.id);
  socket.on('auth', async (username, password) => {
    const userData = await getHashMySQL(username).then(res => res[0][0])
    if (userData.length==0) { return -1 }
    
    bcrypt.compare(password, userData[0].passwordHash, (err, res) => {
      const auth = (err || res==false) ? -1 : userData[0].id
      io.to(socket.id).emit('auth response', auth);
    });
  });
  socket.on('new message', async (userid, message) => {
    await sendMessageMySQL(userid, message);
    socket.broadcast.emit('message', userid, message);
  });

  socket.on('new user', (username, password) => {
    try {
      bcrypt.hash(password, COST_FACTOR_SALT, async (err, hash) => {
        if (err) { throw err } 
        const newUserIDResult = await newUserMySQL(username, hash);
        const newUserID = newUserIDResult[0]?.insertId;
        io.to(socket.id).emit('new user id', newUserID);
      });
    } catch (err) { 
      io.to(socket.id).emit('new user error', err?.code ?? 'Unknown error');
    }
  });
});


httpServer.listen(process.env.WEBSERVER_PORT, () => {
  console.log('Listening on port ' + process.env.WEBSERVER_PORT)
})