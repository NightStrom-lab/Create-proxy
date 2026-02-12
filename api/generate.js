import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

function randomIP() {
  return `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
}

function randomPort() {
  return Math.floor(Math.random() * (9000 - 1000) + 1000);
}

export default function handler(req, res) {
  if (!SECRET) {
    return res.status(500).json({ message: "Server misconfigured" });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET);

    const proxyList = [];

    for (let i = 0; i < 20; i++) {
      proxyList.push(`http://${randomIP()}:${randomPort()}`);
      proxyList.push(`https://${randomIP()}:${randomPort()}`);
    }

    res.status(200).json({
      total: proxyList.length,
      proxies: proxyList
    });

  } catch {
    res.status(403).json({ message: "Token invalid or expired" });
  }
}