const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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
