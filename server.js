/**
 * Created by josh on 9/2/15.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

// In production this would need to be an environment variable
var jwtSecret = 'oiweofinweoifnwoie222of';

var user = {
    username: 'user',
    password: 'user'
};

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(expressJwt({ secret: jwtSecret}).unless({path: ['/login']}));

app.get('/notes', function(req, res) {
    var note = {
        title: 'Test note',
        description: 'Test body'
    };
    res.json(note)
});

app.get('/', function(request, response) {
    response.render('/public/index.html');
});

app.post('/login', authenticate, function(req, res){
    var token = jwt.sign({
        username: user.username
    }, jwtSecret);
    res.send(token);
});

app.listen(8080, function() {
    console.log("Listening on 8080");
});

function authenticate(req, res, next){
    var body = req.body;
    if (!body.username || !body.password){
        res.status(400).end('Must provide username or password')
    }
    if (body.username != user.username || body.password != user.password){
        res.status(401).end('Username or password incorrect');
    }
    next();
}