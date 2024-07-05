const userModel = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
    try {
        let { email, password, fullname } = req.body;

        let user = await userModel.findOne({ email });
        if (user) {
            req.flash("error", "You already have an account, please login");
            return res.redirect("/");
        }

        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Create the user with hashed password
        user = await userModel.create({
            email,
            password: hash,
            fullname,
        });

        // Generate the token
        let token = generateToken(user);

        // Set the cookie and send response
        res.cookie("token", token);
        req.flash("success", "User created successfully");
        return res.redirect("/");

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports.loginUser = async function (req, res) {
    try {
        let { email, password } = req.body;

        let user = await userModel.findOne({ email });
        if (!user) {
            req.flash("error", "Email or Password incorrect");
            return res.redirect("/");
        }

        // Compare password using bcrypt.compare
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                let token = generateToken(user);
                res.cookie("token", token);
                // Redirect to "/shop" after successful login
                return res.redirect("/shop");
            } else {
                req.flash("error", "Email or Password incorrect");
                return res.redirect("/");
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports.logout = function (req,res){
    res.cookie("token", "");
    res.redirect("/");
}