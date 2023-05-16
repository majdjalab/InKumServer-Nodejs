var express = require("express"),
	 bcrypt = require('bcrypt'),
	jwt = require("jsonwebtoken")
	mongoose = require("mongoose"),
   passport = require("passport"),
   bodyParser = require("body-parser"),
   LocalStrategy = require("passport-local")

const User = require("../model/User");
const Posts = require("../model/Posts");
var UserRouter = express();


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(Posts.authenticate()));
passport.serializeUser(Posts.serializeUser());
passport.deserializeUser(Posts.deserializeUser());
//=====================
// ROUTES
//=====================

// Showing home page
UserRouter.get("/", function (req, res) {
	res.render("home");
});

// Showing secret page
UserRouter.get("/secret", isLogin, function (req, res) {
	res.render("secret");
});

// Showing register form
UserRouter.get("/register", function (req, res) {
	res.render("register");
});

// Handling user signup

UserRouter.post("/register", async (req, res) => {
	// check if the user exists
	const userex = await User.findOne({ username: req.body.username} );
	const emailex = await User.findOne({ email: req.body.email} );
	const passwordRegex = req.body.password;
	const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
	const isContainsLowercase = /^(?=.*[a-z]).*$/;
	const isContainsUppercase = /^(?=.*[A-Z]).*$/;
	const isContainsNumber = /^(?=.*[0-9]).*$/;

if (!req.body.password || !req.body.username){
			return res.status(400).json({message: "one field not provided"});
		} else if (userex || emailex) {
			res.status(409).json({ message: "Username or Email already exist" });
		}else if ( passwordRegex.length < 8 || 
			passwordRegex.search(isContainsSymbol || 
			isContainsLowercase || isContainsUppercase || isContainsNumber) < 0) {
			return res.status(400).json({message: "password must contain Symbols & Uppercase & Lowercase & Number"});
		} 
		else {
			const hash = bcrypt.hashSync(req.body.password, 10);
			req.body.password = hash;
			const user = await User.create({
			username: req.body.username,
			password: hash,
			name: req.body.name,
			email: req.body.email
		  });
		  
		  return res.status(200).json({message: "Registration Success!"});}
  });



//Showing login form
UserRouter.get("/login", function (req, res) {
	res.render("login");
});

//Handling user login


const login = (req, res, next) => {
    
	User.findOne({ where : {
        email: req.body.email, 
    }}).then(User => {
		if (!User){
			return res.status(404).json({message: "user not found"});
        } else {
            // password hash
            bcrypt.compare(req.body.password, User.password, (err, compareRes) => {
                if (err) { // error while comparing
                    res.status(502).json({message: "error while checking user password"});
                } else if (compareRes) { // password match
                    const token = jwt.sign({ email: req.body.email }, 'secret', { expiresIn: '1h' });
                    res.status(200).json({message: "user logged in", "token": token});
                } else { // password doesnt match
                    res.status(401).json({message: "invalid credentials"});
				};
            });
        };
    })
    .catch(err => {
        console.log('error', err);
    });
};

UserRouter.post("/login", login)
//Handling user logout
UserRouter.get("/logout", function (req, res) {
	req.logout(function(err) {
		if (err) { return next(err); }
		res.redirect('/');
	});
});

const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: 'not authenticated' });
    };
    const token = authHeader.split(' ')[1];
    let decodedToken; 
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        return res.status(500).json({ message: err.message || 'could not decode the token' });
    };
    if (!decodedToken) {
        res.status(401).json({ message: 'unauthorized' });
    } else {
        res.status(200).json({ message: 'here is your resource' });
    };
};

function isLogin(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect("/login");
}

module.exports = UserRouter;