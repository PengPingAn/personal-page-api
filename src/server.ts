const express = require("express");
const cors = require("cors");

const app = express();

// ✅ 允许所有来源
app.use(cors());

// ✅ 或指定来源
// app.use(cors({ origin: 'http://localhost:3000' }))

app.get("/api/data", (req, res) => {
  res.json({ message: "Hello CORS!" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
