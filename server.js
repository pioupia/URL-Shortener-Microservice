require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
let pages = [];
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }))
.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  if(!req.body || !req.body.url || !req.body.url.match(/(?:(?:https?):\/\/?[\w/\-?=%.]+\.[\w/\-&?=%.]+)/)) return res.json({
    error: "Invalid URL"
  });
  const f = pages.find(r => r.url == req.body.url);
  if(f){
    return res.json({ original_url : f.url, short_url : f.code});
  }

  const lastPage = pages.sort((a,b) => b.code - a.code)[0] || {code:0};

  pages.push({
    url: req.body.url,
    code: lastPage.code+1
  });

  return res.json({ original_url : req.body.url, short_url : lastPage.code+1});
});

app.get('/api/shorturl/:id', function(req, res) {
  if(!req.params || !req.params.id || isNaN(req.params.id) || req.params.id < 1 || !pages.find(r => r.code == req.params.id)) return res.json({
    error: "No short URL found for the given input"
  });
  return res.redirect(pages.find(r => r.code == req.params.id).url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
