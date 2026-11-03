const amqp = require("amqplib");
const axios = require("axios");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const ITEM_SERVICE_URL = process.env.ITEM_SERVICE_URL || "http://localhost:3002";

async function startMatching() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);

    connection.on("error", (err) => {
      console.log("match-service: connection error:", err.message);
    });
    connection.on("close", () => {
      console.log("match-service: สายหลุด จะลองต่อใหม่ใน 5 วินาที...");
      setTimeout(startMatching, 5000);
    });

    const channel = await connection.createChannel();
    await channel.assertQueue("item.created");
    await channel.assertQueue("match.found");

    console.log("match-service: เชื่อมต่อ RabbitMQ สำเร็จ! กำลังรอฟังข้อความ...");

    channel.consume("item.created", async (msg) => {
      const newItem = JSON.parse(msg.content.toString());
      console.log("match-service ได้รับข้อความ:", newItem.name);

      const oppositeStatus = newItem.status === "lost" ? "found" : "lost";

      try {
        const response = await axios.get(ITEM_SERVICE_URL + "/items");
        const allItems = response.data;

        const matches = allItems.filter((item) =>
          item.id !== newItem.id &&
          item.status === oppositeStatus &&
          item.category === newItem.category
        );

        if (matches.length > 0) {
          console.log(`🎉 จับคู่สำเร็จ! "${newItem.name}" ตรงกับ:`);
          matches.forEach((m) => console.log(`   - ${m.name} (id: ${m.id})`));

          channel.sendToQueue("match.found", Buffer.from(JSON.stringify({
            newItem: newItem,
            matches: matches
          })));
          console.log("ส่งข้อความเข้าคิว match.found แล้ว");
        } else {
          console.log("ยังไม่พบรายการที่ตรงกัน");
        }
      } catch (error) {
        console.log("เรียก item-service ไม่สำเร็จ:", error.message);
      }

      channel.ack(msg);
    });
  } catch (error) {
    console.log("match-service เชื่อมต่อ RabbitMQ ไม่สำเร็จ:", error.message);
    console.log("จะลองใหม่ใน 5 วินาที...");
    setTimeout(startMatching, 5000);
  }
}

startMatching();