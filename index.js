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
	res.render('pages/index', {
    	text: "",
		  pdfUploaded: false
  	});
});

app.post('/uploaded', pdfUpload.single("pdfFile"), (req, res) => {
    let dataBuffer = fs.readFileSync(req.file.path)
    //console.log(req.file)
    pdf(dataBuffer).then(function(data) {
        //console.log(data)
        console.log('Generating speech audio')
        var speechText = data.text
        var gtts = new gTTS(speechText, 'en');
        pdf_uploaded = false;
        // send path to mp3 in result
        speechPath = './public/audio/save.mp3' // change this
        gtts.save(speechPath,(err) => {
          if (err) { 
            console.log('Error writing audio to file')
            pdfUploaded = false;
            //res.send({generatedText:false, speechPath:speechPath})
            //throw new Error(err)	
            res.render('pages/index', {
              text: data.text,
              pdfUploaded: false,
              //generatedText:true,
              //speechPath:speechPath
            });
          }
          else {
            console.log('Wrote audio to file')
            //res.send({generatedText:true, speechPath:speechPath});
            pdf_uploaded = true;
            res.render('pages/index', {
              text: data.text,
              pdfUploaded: true,
            });
          }
        })
    });
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

app.post('upload/getSpeech',function(req,res) {
	console.log('Generating speech audio')
	var speechText = req.text
	var gtts = new gTTS(speechText, 'en');
	// send path to mp3 in result
	speechPath = __dirname + '/tmp/speech.mp3' // change this
	gtts.save(speechPath,(err,res) => {
		if (err) { 
			console.log('Error writing audio to file')
			res.send({generatedText:false, speechPath:speechPath})
		}
		else {
			console.log('Wrote audio to file')
			res.send({generatedText:true, speechPath:speechPath});
		}
	})
	
});

//Pushing to server
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`Express running → PORT ${server.address().port}`);
});