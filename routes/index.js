var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var url = "mongodb+srv://System:utssmartparking@parkdb-fez7r.mongodb.net/";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { layout: false });
});

router.get('/dashboard', function(req, res, next) {
    res.render('dashboard', { title: 'Dashboard' });
});

router.get('/bookSpace', function(req, res, next) {
    res.render('bookSpace', { title: 'Book Space' });
});

router.get('/bookings', function(req, res, next) {
    res.render('bookings', { title: 'Bookings' });
});

router.get('/account', function(req, res, next) {
    res.render('account', { title: 'Account' });
});

router.get('/manageUsers', function(req, res) {
    res.render('manageUsers')
});

router.post('/login', function(req, res, next) {
    var users = [];
    mongo.connect(url, function(err, client) {
        assert.equal(null, err);
        var db = client.db('carParkDB'); // new variable ersion 3.0+ (connection loads client -> this stores the database)
        const cursor = db.collection('Users').find(); //essentially an iterator
        cursor.forEach(function(doc, err) { // doc is the variable we want -> document (like an SQL entry)
            assert.equal(null, err); // check for an error
            users.push(doc); //add the document to the users array
        }, function() {
            client.close();// must be here due to node.js being asynchronous // must close the client from mongo version 3.0+
            res.render('manageUsers', { items: users});
        });
    });


    //let users = getUsers();
    for (let i = 0, len = users.length; i < len; i++) {
        if (users[i].userID == req.body.userID && users[i].password === req.body.password) {
            res.redirect('/dashboard', { status: 'success' });
        }
    }
    res.redirect('/dashboard', { status: 'fail' });
});

router.get('/get-users', function(req, res, next) { //list all users
    var users = [];
    mongo.connect(url, function(err, client) {
        assert.equal(null, err);
        var db = client.db('carParkDB'); // new variable ersion 3.0+ (connection loads client -> this stores the database)
        const cursor = db.collection('Users').find(); //essentially an iterator
        cursor.forEach(function(doc, err) { // doc is the variable we want -> document (like an SQL entry)
            assert.equal(null, err); // check for an error
            users.push(doc); //add the document to the users array
        }, function() {
            client.close();// must be here due to node.js being asynchronous // must close the client from mongo version 3.0+
            res.render('manageUsers', { items: users});
        });
    });
});

router.post('/insert-user', function(req, res, next) {
    var user = {
        userID: req.body.userID,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        usertype: req.body.usertype
    };

    mongo.connect(url, function(err, client){
        assert().equal(null, err);
        var db = client.db('carParkDB');
        db.collection('Users').insertOne(user, function(err, result) {
            assert(null, err);
            console.log('user added.');
            client.close();
        });
    });
    res.redirect('/manageUsers');
});

router.post('/update', function(req, res, next) {

});

router.post('/delete', function(req, res, next) {

});

function getUsers() {
    var users = [];
    mongo.connect(url, function(err, client) {
        assert.equal(null, err);
        var db = client.db('carParkDB'); // new variable ersion 3.0+ (connection loads client -> this stores the database)
        const cursor = db.collection('Users').find(); //essentially an iterator
        cursor.forEach(function(doc, err) { // doc is the variable we want -> document (like an SQL entry)
            assert.equal(null, err); // check for an error
            users.push(doc); //add the document to the users array
        }, function() {
            client.close();// must be here due to node.js being asynchronous // must close the client from mongo version 3.0+
        });
    });
    return users;
}

module.exports = router;
