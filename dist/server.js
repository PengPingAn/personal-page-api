"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const app = express();
// ✅ 允许所有来源
app.use(cors());
// ✅ 或指定来源
// app.use(cors({ origin: 'http://localhost:3000' }))
app.listen(5000, () => console.log("Server running on port 5000"));
//# sourceMappingURL=server.js.map