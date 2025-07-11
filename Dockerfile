FROM node:18
WORKDIR /chat-bot
COPY . .
RUN npm install
CMD ["node", "server.js"]