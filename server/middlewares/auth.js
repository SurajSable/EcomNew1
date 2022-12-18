const admin = require("../firebase");
const User = require("../models/user");

exports.authCheck = async (req, res, next) => {
  // console.log(req.headers.authtoken); // token
  // try {
  //   const firebaseUser = await admin
  //     .auth()
  //     .verifyIdToken(req.headers.authtoken);
  //   // console.log("FIREBASE USER IN AUTHCHECK", firebaseUser);
  //   req.user = firebaseUser;
  //   next();
  // } catch (err) {
  //   // console.log(err);
  //   res.status(401).json({
  //     err: "Invalid or expired token",
  //   });
  // }

// 1. Read token.
const token = req.headers["authorization"];
console.log(token);
if(!token){
    return res.status(401).send("Unauthorized: Token Required");
}
// 2. Check if token is valid
try{
    const payLoad = jwt.verify(token,  process.env.JWT_SECRET);
    req.userID = payLoad.userid;
    console.log(req.userID);
}catch(err){
    return res.status(401).send("Unauthorized: Invalid Token");
}

// 3. if valid, proceed to next middleware.
next();



};

exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;

  const adminUser = await User.findOne({ email }).exec();

  if (adminUser.role !== "admin") {
    res.status(403).json({
      err: "Admin resource. Access denied.",
    });
  } else {
    next();
  }
};
