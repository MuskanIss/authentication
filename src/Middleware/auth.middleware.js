const jwt = require("jsonwebtoken");
const findUser = (token) => {
  return new Promise((resolve, reject) =>
    jwt.verify(token, process.env.SECRET_KEY, (err, same) => {
      console.log(token);
      if (err) return reject(err);
      resolve(same);
    })
  );
};

const authMiddleware = async (req, res, next) => {
  const { authtoken } = req.headers;
  if (!authtoken || !authtoken.startsWith("Bearer ")) {
    return res.status(500).json("Something went wrong");
  }
  try {
    let token = authtoken.split(" ")[1];
    let user = await findUser(token);
    req.user = user.user;
    next();
  } catch (e) {
    return res.status(500).json("Something went wrong");
  }
};

module.exports = authMiddleware;
