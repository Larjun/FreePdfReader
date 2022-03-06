var express = require('express'), //Ensure our express framework has been added
    app = express(),
    bodyParser = require('body-parser'),np //Ensure our body-parser tool has been added
    gTTS = require('gtts'),
    multer = require('multer'),
    path = require("path"),
    fs = require('fs'),
    pdf = require('pdf-parse'),
    maxSize = 1 * 1000 * 1000;
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('view engine', 'ejs');
app.use(express.static("public"));

var file = "";

var storage = multer.diskStorage({
    destination: './pdfUploads/',
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

const pdfUpload = multer({
    storage: storage,
    limits: {
      fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.pdf$/)) { 
         // upload only png and jpg format
         return cb(new Error('Please upload a PDF'))
       }
     cb(undefined, true)
  }
})


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

app.get('/pdfup',function(req,res) {
	res.render('pages/textupload', {
    text: file
  });
});

/*app.get('/pdfup/uploaded',function(req,res) {
	res.render('pages/textupload', {
    text: file
  });
}); */

app.post('/upload', pdfUpload.single("pdfFile"), (req, res) => {
    let dataBuffer = fs.readFileSync(req.file.path)
    console.log(req.file)
    pdf(dataBuffer).then(function(data) {
        console.log(data)
        res.render('pages/textupload', {
          text: data.text
        });
    });
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

app.listen(3000, function () {
    console.log("Server listening on port 3000");
})
