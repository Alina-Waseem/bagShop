const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const productModel = require("../models/product");
const userModel = require("../models/user");


router.get("/", function (req, res) {
    let error = req.flash("error");
    res.render("index", { error , loggedin: false});
});

router.get("/shop", isLoggedIn, async function (req, res) {
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", {products, success});

});

router.get("/cart", isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({email: req.user.email}).populate("cart");
    const bill = (Number(user.cart[0].price)+20) - Number(user.cart[0].discount);
    
    res.render("cart",{user ,bill});
});

router.get("/addtocart/:productid", isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success" , "Added to cart");
    res.redirect("/shop");
});

router.get("/logout", isLoggedIn, function (req, res) {
    res.render("shop");

});

module.exports = router;


