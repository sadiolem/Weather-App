// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config();
// }

// const DarkSkyAPI_KEY = process.env.DarkSkyAPI_KEY;
const axios = require('axios');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/weather', (req, res) => {
  const url = `https://api.darksky.net/forecast/5b78c2e40f30cbf8ffdab9dd65e23dbe/${req.body.latitude},${req.body.longitude}?units=si`;
  axios({
      url: url,
      responseType: 'json'
    })
    .then(data => res.json(data.data));
});

app.listen(3000, () => {
  console.log('Server Started');
});
