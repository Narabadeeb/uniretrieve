const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(cors());

app.use((req, res, next) => {
  console.log("Gateway ได้รับ request:", req.method, req.url);
  next();
});

app.use("/api/auth", createProxyMiddleware({
  target: "http://localhost:3001",
  changeOrigin: true
}));

app.use("/api/items", createProxyMiddleware({
  target: "http://localhost:3002",
  changeOrigin: true,
  pathRewrite: (path) => path === "/" ? "/items" : "/items" + path
}));

app.listen(3000, () => {
  console.log("gateway กำลังทำงานที่ http://localhost:3000");
});