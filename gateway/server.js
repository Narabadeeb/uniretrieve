const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3001";
const ITEM_SERVICE_URL = process.env.ITEM_SERVICE_URL || "http://localhost:3002";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());

app.use((req, res, next) => {
  console.log("Gateway ได้รับ request:", req.method, req.url);
  next();
});

app.use("/api/auth", createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true
}));

app.use("/api/items", createProxyMiddleware({
  target: ITEM_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path) => path === "/" ? "/items" : "/items" + path
}));

app.listen(PORT, () => {
  console.log(`gateway กำลังทำงานที่ http://localhost:${PORT}`);
});