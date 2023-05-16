// App.js

var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport")

	

var UserRouter = require("./router/UserRouter");
var PostsRouter = require("./router/PostsRouter");



var app = express();
mongoose.set('strictQuery', true);
mongoose.connect("YOUR_DATABASE_URL");

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(require("express-session")({
	secret: "Random Message",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", UserRouter);
app.use('/', PostsRouter);

var port = process.env.PORT || 5000;
app.listen(port, function () {
	console.log("Server Has Started!");
});
