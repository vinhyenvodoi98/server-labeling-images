const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');
require('dotenv').config()

var port = process.env.PORT || 4000;
const visualRecognition = new VisualRecognitionV3({
  version: '2018-03-19',
  authenticator: new IamAuthenticator({
    apikey: process.env.API_KEY
  }),
  url: 'https://api.us-south.visual-recognition.watson.cloud.ibm.com'
});

const app = express();

app.use(
  cors({
    origin: '*', // allow to server to accept request from different origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // allow session cookie from browser to pass through
  })
);

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.post('/subscription');
app.post('/api/classify', async (req, res) => {
  console.log(req.body.url);
  const classifyParams = {
    url: req.body.url
  };
  visualRecognition
    .classify(classifyParams)
    .then((response) => {
      const classifiedImages = response.result;
      console.log(JSON.stringify(classifiedImages, null, 2));
      res.status(200).json(classifiedImages.images[0].classifiers[0].classes);
    })
    .catch((err) => {
      console.log('error:', err);
    });
});

app.listen(port);
console.log('The magic happens on port ' + port);
