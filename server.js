const express = require("express");
const { createClient } = require("redis");

const app = express();
app.use(express.json()); // Middleware for JSON

// Create Redis client
const client = createClient();

client.on("error", (err) => console.log("Redis Error:", err));

// Connect Redis
async function connectRedis() {
  await client.connect();
  console.log("✅ Redis Connected");
}
connectRedis();

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

// ✅ CREATE (SET USER)
app.post("/set-user", async (req, res) => {
  const { id, name } = req.body;

  await client.set(`user:${id}`, JSON.stringify({ id, name }));

  res.send({
    message: "✅ User stored in Redis",
  });
});

// ✅ READ (GET USER)
app.get("/get-user/:id", async (req, res) => {
  const { id } = req.params;

  const user = await client.get(`user:${id}`);

  res.send({
    data: JSON.parse(user),
  });
});

// ✅ UPDATE USER
app.put("/update-user/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  await client.set(`user:${id}`, JSON.stringify({ id, name }));

  res.send({
    message: "✏️ User updated",
  });
});

// ✅ DELETE USER
app.delete("/delete-user/:id", async (req, res) => {
  const { id } = req.params;

  await client.del(`user:${id}`);

  res.send({
    message: "🗑️ User deleted",
  });
});

// Start Server
app.listen(3000, () => {
  console.log("🔥 Server started on port 3000");
});
