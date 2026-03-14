const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const userController = require("../controllers/users");

const PUBLIC_KEY_PATH = path.join(__dirname, '..', 'keys', 'public.key');
let publicKey;
try {
  publicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');
} catch (e) {
  console.error('Unable to read public key for JWT verification:', e.message);
}

module.exports = {
  checkLogin: async function (req, res, next) {
    try {
      let token = req.headers.authorization;
      if (!token || !token.startsWith('Bearer')) {
        return res.status(401).send("ban chua dang nhap");
      }
      token = token.split(" ")[1];

      if (!publicKey) {
        return res.status(500).send('JWT public key not available');
      }

      let result = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      let user = await userController.FindUserById(result.id);
      if (!user) {
        return res.status(401).send("ban chua dang nhap");
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).send("ban chua dang nhap");
    }
  }
};