const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public', {
  index: 'index.html'
}));

app.get('/hello', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
