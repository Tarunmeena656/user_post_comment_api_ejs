require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');
const logger = require('morgan')
const connectDatabase = require('./utils/db-connection');
const indexRouter = require('./routes/index-route');
const passport = require('passport')
const bodyParser = require('body-parser');
const redis = require('redis');
const redisStore = require('connect-redis').default;
const methodOverride = require('method-override');


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(logger('dev'));


app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')
app.set('views', 'src/views')



const redisClient = redis.createClient({url:'redis://127.0.0.1:6379'});
redisClient.connect();
redisClient.on('connect', () => {
    console.log('redis connected');
})

app.use(session({
    store: new redisStore({client: redisClient}),
    secret: "Tarun@12345",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24  
    }
}))

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());
app.use( (req,res,next) => {
    res.locals.flash = req.flash();
    next()
})

app.use((err,req,res,next) => {
    const { status = 500, message = 'something went wrong' } = err;
    res.status(status).send(message);
});

app.use(indexRouter)

connectDatabase()
.then(() => {
    app.listen(4000, () => {
        console.log('server is up and running on 4000')
    });
})
.catch((err)=>{
    console.log(err)
})




