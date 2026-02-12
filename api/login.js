import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!SECRET) {
    return res.status(500).json({ message: "Server error" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Isi username & password" });
  }

  const filePath = path.resolve("data/users.json");
  const users = JSON.parse(fs.readFileSync(filePath));

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Login gagal" });
  }

  const token = jwt.sign({ username }, SECRET, { expiresIn: "2h" });

  res.status(200).json({ token });
}
