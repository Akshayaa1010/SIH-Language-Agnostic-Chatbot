// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.post("/ask", async (req, res) => {
  const { question } = req.body;
  // your logic to answer
  res.json({answer: "This is a placeholder response"});
});

// ✅ Simple test route (no PDF/test folder)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
// Get uploaded documents
app.get("/documents", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) return res.status(500).json({ error: "Cannot read uploads" });
    // Return only PDF or TXT
    const docs = files.filter(f => f.endsWith(".pdf") || f.endsWith(".txt"));
    res.json(docs);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend is running on ${PORT}`);
});

