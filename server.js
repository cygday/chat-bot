const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
/*const boydParser = require('body-parser');*/

const app = express();
const server = http.createServer(app);
const io = new Server(server);

/*app.use(bodyParser.urlencoded({ extended: true }));*/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));

const users = { user1: "pass1", user2: "pass2" };
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] === password) {
        req.session.user = username;
        res.redirect('/chat');
    } else {
        res.send('Invalid login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/chat', (req, res) => {
    if (!req.session.user) return
    res.redirect('/login');
    res.sendFile(__dirname + '/index.html');
});




app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const ChatMessage = mongoose.model('ChatMessage', {
    message: String,
    timestamp: { type: Date, default: Date.now },
});

io.on('connection', (socket) => {
    console.log(`🔌 new User connected`);

    ChatMessage.find().sort({ timestamp: -1 }).limit(10). then(messages => {
        messages.reverse().forEach(msg =>
            socket.emit('chat message', msg.message));
    });

    socket.on('chat message', async (msg) => {
        await ChatMessage.create({ message: msg });
        io.emit('chat message', msg);
    });
/*    socket.on('disconnect', () => {
        console.log(`❌ User disconnected`);
    });*/
    
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});
