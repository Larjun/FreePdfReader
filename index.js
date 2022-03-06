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

// set the view engine to ejs
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