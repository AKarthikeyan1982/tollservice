const express = require('express');
const cors = require('cors')
const tolls = require('./routes/tolls') ;
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// app.set('secretKey', 'secretKey'); 
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
    res.json({"TollApp" : "Welcome!"});
});

// public route
app.use('/tolls', tolls);

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

// handle 404 error - express doesn't consider not found 404 as an error so we need to handle 404 it explicitly
app.use(function(req, res, next) {
	let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle errors
app.use(function(err, req, res, next) {
  if(err.status === 404)
  	res.status(404).json({message: "Not found"});
  else	
    res.status(500).json({message: "Something looks wrong :( !!!"});
});

app.listen(port, function(){
	console.log('Toll App node server listening on port: '+ port);
});
