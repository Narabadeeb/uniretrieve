const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const PORT = process.env.PORT || 3003;

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("มี browser เชื่อมต่อเข้ามา:", socket.id);
  socket.on("disconnect", () => {
    console.log("browser ตัดการเชื่อมต่อ:", socket.id);
  });
});

async function listenMatchFound() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    connection.on("error", (err) => {
      console.log("notification-service: RabbitMQ error:", err.message);
    });
    connection.on("close", () => {
      console.log("notification-service: สายหลุด จะลองต่อใหม่ใน 5 วินาที...");
      setTimeout(listenMatchFound, 5000);
    });

    const channel = await connection.createChannel();
    await channel.assertQueue("match.found");
    console.log("notification-service: เชื่อมต่อ RabbitMQ สำเร็จ! รอฟังคิว match.found...");

    channel.consume("match.found", (msg) => {
      const data = JSON.parse(msg.content.toString());
      console.log("notification-service ได้รับ:", data);
      io.emit("match-notification", data);
      channel.ack(msg);
    });
  } catch (error) {
    console.log("notification-service เชื่อมต่อ RabbitMQ ไม่สำเร็จ:", error.message, "- ลองใหม่ใน 5 วินาที");
    setTimeout(listenMatchFound, 5000);
  }
}
listenMatchFound();

server.listen(PORT, () => {
  console.log(`notification-service กำลังทำงานที่ http://localhost:${PORT}`);
});