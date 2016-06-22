var express = require('express');
path = require('path');
var bodyParser = require('body-parser');
mongoose = require('mongoose');
app = express();

app.use(express.static(path.join(__dirname, '/client')));
app.use(bodyParser.json());

require('./server/config/mongoose.js');
require('./server/config/routes.js')(app);

app.listen(5050, function(){
	console.log('Now Running On Port 5050');
})