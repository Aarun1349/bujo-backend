const jwt = require("jsonwebtoken");

const fetchuser = async (req, res, next) => {
  // Get user from jwt auth token and append id to request
  try {
    const token = req.header("authToken");
    //consolelog('token',token)

    if (!token) {
      res.status(500).send({ error: "User is not authenticted" });
    }
    //consolelog("JWT_TOKEN",process.env.JWT_TOKEN)
    const data = jwt.verify(token, process.env.JWT_TOKEN);
    //consolelog("data",data)
    res.user = data.user;
  } catch (err) {
    //consolelog(err.message);
    res.status(400).send("Internal Server Error");
  }

  next();
};

module.exports = fetchuser;
