global.express = require('express');

const app = express();

const morgan = require('morgan')
const cors = require('cors')
const path = require('path');
const bodyParser = require('body-parser');
var flash = require('connect-flash');
var cookie = require('cookie-session');

const constants = require('./config/constants')
const keys = require('./keys/keys')
const commonMessage = require('./helper/commonMessage.helper')
const commonFunction = require('./helper/commonFunction.helper');

const port = process.env.PORT || keys.PORT || 8090; // setting port
const env = process.env.ENV || 'development'; //setting environment
const mongoose = require('./database/mongoose.js'); // for database connection

app.use(cors()) // for allow all request
app.use(bodyParser.urlencoded({extended: true})); // to support URL-encoded bodies and to remove deprecation warnings
app.use(bodyParser.json()); // to parse body in json
app.use(express.static(path.join(__dirname,'public'))); // to set public path
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(flash());

app.use(cookie({
    // Cookie config, take a look at the docs...
    secret: 'I Love India...',
    resave: false,
    saveUninitialized: true,
    cookie:{secure:true}
}));

//BASE_URL configuration
app.locals.base_url = keys.BASE_URL+':'+keys.PORT;

// version 1
app.use('/api/v1/users',require('./v1/routes/user.route'));
app.use('/api/v1/demo',require('./v1/routes/demo.route'));

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//setting for error message in environment
if (env == 'development') {
    app.use((err, req, res, next) => {
        console.log(err)
        res.status(err.status || 500).send({
            message: err.message,
            error: true,
            e: err
        });
    });
} else {
    // production error handler
    // no stacktraces leaked to user
    app.use((err, req, res, next) => {
        res.status(err.status || 500).send({
            message: 'Something went wrong.',
            error: true,
            e: null
        });
    });
}

app.listen(port,()=>{
    console.log(`Server is listening on port ${port} with ${env} environment`);
});


exports = module.exports = app;