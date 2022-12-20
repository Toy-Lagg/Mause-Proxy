const http = require('http');
const httpProxy = require('http-proxy');

const PORT = 8000;

const proxy = httpProxy.createProxyServer({});

http.createServer((req, res) => {
  // Render the form
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<form method="POST">');
  res.write('<label for="url">Enter a website:</label><br>');
  res.write('<input type="text" id="url" name="url"><br>');
  res.write('<input type="submit" value="Submit">');
  res.write('</form>');
  res.end();
}).listen(PORT, () => {
  console.log(`Web proxy listening on port ${PORT}`);
});

http.createServer((req, res) => {
  // Parse the form data
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const formData = new URLSearchParams(body);
    const targetUrl = formData.get('url');

    // Forward the request to the target server
    req.headers.host = targetUrl;
    proxy.web(req, res, { target: targetUrl });
  });
}).listen(PORT + 1, () => {
  console.log(`Web proxy forwarding on port ${PORT + 1}`);
});
