const fs = require('fs');

const fastify = require('fastify');
const fastify_static = require('fastify-static');
const path = require('path');

// inject sendHtml function into response object
const fastify_reply = require('fastify/lib/reply');
fastify_reply.prototype.sendHtml = function(html) {
  this.type('text/html; charset=utf-8').send(html);
}

const app = fastify();
const port = process.env.PORT || 3000;

const sql_loader = require('./sql_loader');

app.register(fastify_static, {
  root: path.join(__dirname, 'public'),
  index: 'index.html'
})

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

  res.sendHtml(buf);
});

app.get('/initdb/:templateName', async (req, res) => {
  const templateName = req.params.templateName;
  const loader = new sql_loader();
  const status = await loader.reset(templateName);
  const statusStr = status ? 'done' : 'failed';

  res.sendHtml(`init ${statusStr}: ${templateName}`);
});

// fastify examples
app.get('/example/:file(^\\d+).txt', async (req, res) => {
  return req.params.file;
});

app.get('/example/near/:lat-:lng/radius/:r', async (req, res) => {
  return `lat: ${req.params.lat}, long ${req.params.lng}, radius: ${req.params.r}`;
});

// start application server
app.listen(port, '0.0.0.0', () => console.log(`Example app listening on port ${port}!`));
