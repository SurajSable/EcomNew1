// const User = require("../models/user");

// exports.createOrUpdateUser = async (req, res) => {
//   const { name, picture, email } = req.user;

//   const user = await User.findOneAndUpdate(
//     { email },
//     { name: email.split("@")[0], picture },
//     { new: true }
//   );
//   if (user) {
//     console.log("USER UPDATED", user);
//     res.json(user);
//   } else {
//     const newUser = await new User({
//       email,
//       name: email.split("@")[0],
//       picture,
//     }).save();
//     console.log("USER CREATED", newUser);
//     res.json(newUser);
//   }
// };

// exports.currentUser = async (req, res) => {
//   User.findOne({ email: req.user.email }).exec((err, user) => {
//     if (err) throw new Error(err);
//     res.json(user);
//   });
// };

const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // to generate signed token


exports.signup = async (req, res) => {

    // console.log(req.body);
    const body = req.body;

    if (!(body.email && body.password)) {
      return res.status(400).send({ error: "Data not formatted properly" });
    }
    // creating a new mongoose doc from user data
    const user = new User(body);
    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    user.password = await bcrypt.hash(user.password, salt);
    user.save().then((doc) => res.status(201).send(doc));
  };


  exports.signin = async (req, res) => {

    // console.log(req.body);
    const body = req.body;
    const user = await User.findOne({ email: body.email });
    if (user) {
      // check user password with hashed password stored in the database
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (validPassword) {
        // res.status(200).json({ userDetails: user });
         // generate a signed token with user id and secret
         const token = jwt.sign({ _id: user._id }, "processJWT_SECRET");
         // persist the token as 't' in cookie with expiry date
         res.cookie("t", token, { expire: new Date() + 9999 });
         // return response with user and token to frontend client
         const { _id, name, email, role } = user;
         return res.status(200).json({ token, user: { _id, email, name, role } });
      } else {
        res.status(400).json({ error: "Invalid Password" });
      }
    } else {
      res.status(401).json({ error: "User does not exist" });
    }
  };

  exports.signout = async (req, res) => {
    res.clearCookie("t");
    res.json({ message: "Signout success" });
};


