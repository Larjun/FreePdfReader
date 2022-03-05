const express = require('express'); //Ensure our express framework has been added
const gTTS = require('gtts');

var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('view engine', 'ejs');
app.use(express.static(__dirname));

app.get('/',function(req,res) {
	res.render('pages/homePage');
});

app.listen(3000,(req,res) => {
	console.log('Listening on port 3000');
});
