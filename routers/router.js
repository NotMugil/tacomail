const express = require("express");
const router = express.Router();


router.get("/",(req,res,next)=>{
  res.render('home.ejs',{url:req.protocol+"://"+req.headers.host})
})

router.get("/about",(req,res,next)=>{
  res.render('about.ejs',{url:req.protocol+"://"+req.headers.host})
})

router.get("/eg", (req, res, next) =>{
  try {
    res.render("example.ejs", {url:req.protocol+"://"+req.headers.host})
    
  } catch (error) {
    
  }
})

router.get("/home", (req, res, next) =>{
  try {
    res.render("index.ejs", {url:req.protocol+"://"+req.headers.host})
    
  } catch (error) {
    
  }
})

router.get("/dashboard", (req, res, next) =>{
  try {
    res.render("dashboard.ejs", {url:req.protocol+"://"+req.headers.host})
    
  } catch (error) {
    
  }
})

router.get("/login", (req, res, next) =>{
  try {
    res.render("./auth/login.ejs", {url:req.protocol+"://"+req.headers.host})
    
  } catch (error) {
    
  }
})

router.get("/signup", (req, res, next) =>{
  try {
    res.render("./auth/signup.ejs", {url:req.protocol+"://"+req.headers.host})
  } catch (error) {
    
  }
})

router.get("/login", (req, res, next) =>{
  try {
    res.render("login.ejs", {url:req.protocol+"://"+req.headers.host})
    
  } catch (error) {
    console.log(error)
    
  }
})



router.get("/signup", (req, res, next) =>{
  try {
    res.render("signup.ejs", {url:req.protocol+"://"+req.headers.host})
    
  } catch (error) {
    console.log(error)
  }
})





module.exports = router;