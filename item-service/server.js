const express = require("express");
const cors = require("cors");
const amqp = require("amqplib");
const sequelize = require("./database");
const Item = require("./models/Item");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const PORT = process.env.PORT || 3002;

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

let channel = null;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    connection.on("error", (err) => {
      console.log("item-service: RabbitMQ error:", err.message);
    });
    connection.on("close", () => {
      channel = null;
      console.log("item-service: สายหลุด จะลองต่อใหม่ใน 5 วินาที...");
      setTimeout(connectRabbitMQ, 5000);
    });
    channel = await connection.createChannel();
    await channel.assertQueue("item.created");
    console.log("item-service: เชื่อมต่อ RabbitMQ สำเร็จ!");
  } catch (error) {
    console.log("เชื่อมต่อ RabbitMQ ไม่สำเร็จ:", error.message, "- ลองใหม่ใน 5 วินาที");
    setTimeout(connectRabbitMQ, 5000);
  }
}

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log("item-service: เชื่อมต่อ MySQL สำเร็จ!");
  } catch (error) {
    console.log("เชื่อมต่อ MySQL ไม่สำเร็จ:", error.message, "- ลองใหม่ใน 5 วินาที");
    setTimeout(syncDatabase, 5000);
  }
}

connectRabbitMQ();
syncDatabase();

app.post("/items", async (req, res) => {
  try {
    let image = null;
    if (typeof req.body.image === "string" && req.body.image.startsWith("data:image/")) {
      image = req.body.image;
    }

    const newItem = await Item.create({
      name: req.body.name,
      category: req.body.category,
      location: req.body.location,
      status: req.body.status,
      image
    });

    if (channel) {
      const forQueue = newItem.toJSON();
      delete forQueue.image;
      channel.sendToQueue("item.created", Buffer.from(JSON.stringify(forQueue)));
      console.log("ส่งข้อความเข้าคิว item.created:", newItem.name);
    }

    res.status(201).json({ message: "โพสต์รายการสำเร็จ", item: newItem });
  } catch (error) {
    res.status(400).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

app.get("/items", async (req, res) => {
  try {
    const items = await Item.findAll();
    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`item-service กำลังทำงานที่ http://localhost:${PORT}`);
});
