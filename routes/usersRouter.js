const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logout } = require("../controllers/authControllers");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", function (req, res) {
    res.send("Hey it's working");
});

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/logout', logout);

module.exports = router;