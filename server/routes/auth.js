// const express = require("express");

// const router = express.Router();

// // middlewares
// const { authCheck, adminCheck } = require("../middlewares/auth");

// // controller
// const { createOrUpdateUser, currentUser } = require("../controllers/auth");

// router.post("/create-or-update-user", authCheck, createOrUpdateUser);
// router.post("/current-user", authCheck, currentUser);
// router.post("/current-admin", authCheck, adminCheck, currentUser);

// module.exports = router;


const express = require("express");
const router = express.Router();

const {
    signup,
    signin,
    signout

    // requireSignin
} = require("../controllers/auth");
// const { userSignupValidator } = require("../validator");

router.post("/signup",  signup); //userSignupValidator,
router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;

