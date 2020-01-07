const fs = require('fs');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const sql_loader = require('./sql_loader');

app.use(express.static('public', {
  index: 'index.html'
}));

app.get('/hello', (req, res) => res.send('Hello World!'));

app.get('/listdb', async (req, res) => {
  let buf = '<ul>';

  const files = fs.readdirSync('./sql');
  files.forEach(file => {
    const match = file.match(/^(.+)\.sql$/);
    if (match) {
      const template = match[1];
      buf += `<li><a href="initdb/${template}">${template}</a></li>`;
    }
  });
  buf += '</ul>list done';

  res.send(buf);
});

app.get('/initdb/:templateName', async (req, res) => {
  const templateName = req.params.templateName;
  const loader = new sql_loader();
  const status = await loader.reset(templateName);
  const statusStr = status ? 'done' : 'failed';

  res.send(`init ${statusStr}: ${templateName}`);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
