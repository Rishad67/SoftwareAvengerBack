const express = require('express');
const cors = require('cors');
var session = require('express-session');
var mongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db/db');

mongoose.connect(db.DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    () => {console.log('Database is connected')},
    err => {console.log('Can not connect to the database' + err)}
);

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'build')));

var store = new mongoDBStore({
    uri: db.DB,
    collection: 'sessions'
});

app.use(require('express-session')({
    secret: 'This is a secret',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 365 days
    },
    store: store,
    resave: true,
    saveUninitialized: true
}));

app.get('*',function(req,res) {
    res.sendFile(path.resolve(__dirname,'build','index.html'));
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});