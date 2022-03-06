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

app.post('/getSpeech',function(req,res) {
	console.log('Generating speech audio')
	var speechText = req.text
	var text = "Why is six afraid of seven? Six hasn't been the same since he left Vietnam. He can seldom close his eyes without opening them again at fear of Charlies lurking in the jungle trees. Not that you could ever see the bastards, mind you. They were swift, and they knew their way around the jungle like nothing else. He remembers the looks on the boys' faces as he walked into that village and... oh, Jesus. The memories seldom left him, either. Sometimes he'd reminisce - even hear - Tex's southern drawl. He remembers the smell of Brooklyn's cigarettes like nothing else. He always kept a pack of Lucky's with him. The boys are gone, now. He knows that; it's just that he forgets, sometimes. And, every now and then, the way that seven looks at him with avid concern in his eyes... it makes him think. Sets him on edge. Makes him feel like he's back there... in the jungle."
	speechText = text
	var gtts = new gTTS(text, 'en');
	speechPath = __dirname + '/tmp/speech.mp3'
	gtts.stream().pipe(res);
	/*
	gtts.save(speechPath,(err,res) => {
		if (err) { 
			console.log('Error writing audio to file')
			res.send({generatedText:false})
			//throw new Error(err)	
		}
		else {
			console.log('Wrote audio to file')
			res.send({generatedText:true});
		}
	})
	*/
	
});

app.listen(3000,(req,res) => {
	console.log('Listening on port 3000');
});