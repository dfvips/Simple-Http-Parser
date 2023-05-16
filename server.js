const express = require('express');
const http = require('https');
const zlib = require('zlib');
const iconv = require('iconv-lite');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/send-request', async (req, res) => {
  const requestText = req.body.requestText;
  const responseText = await sendHttpRequest(requestText);
  let responseBody;
  try {
    responseBody = JSON.parse(responseText);   
  } catch (e) {
    responseBody = responseText;   // return entire body as string if parsing fails.
  }
  res.send(responseBody);
});

function sendHttpRequest(requestText) {
  return new Promise((resolve, reject) => {
    let requestInfo = '';
    requestInfo = getRequestInfo(requestText);

    const req = http.request(requestInfo.options, res => {
      // console.log(`statusCode: ${res.statusCode}`);

      const chunks = [];
      let encoding = res.headers['content-encoding'] || 'identity';
      let responseBody;

      // 根据Content-Encoding头信息选择对应的解压模块
      switch (encoding) {
        case 'gzip':
          var gunzip = zlib.createGunzip();
          res.pipe(gunzip);
          responseBody = gunzip;
          break;
        case 'deflate':
          var inflate = zlib.createInflate();
          res.pipe(inflate);
          responseBody = inflate;
          break;
        case 'identity':
          responseBody = res;
          break;
        default:
          reject(new Error(`Unsupported content-encoding: ${encoding}`));
          return;
      }

      // 创建一个Buffer对象来存储解压缩后的响应结果
      const buffers = [];
      responseBody.on('data', chunk => {
        buffers.push(chunk);
      });
      responseBody.on('end', () => {
        // 将Buffer对象转换为正确编码的字符串
        const buffer = Buffer.concat(buffers);
        const responseText = iconv.decode(buffer, 'utf-8');
        resolve(responseText);
      });
    });

    req.on('error', error => {
      reject(error);
    });

    req.write(requestText);
    req.end();
  });
}

function getRequestInfo(requestText) {
  // 解析请求文本
  const lines = requestText.split('\n');
  const firstLine = lines[0].split(' ');

  // 获取请求方式、路径和 HTTP 版本
  const method = firstLine[0];
  const path = firstLine[1];
  const httpVersion = firstLine[2];

  // 获取请求头信息
  const headers = {};
  let hasRequestBody = false; // 添加一个变量来判断请求是否有请求体
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '\r' || lines[i] === '') break;
    const splitIndex = lines[i].indexOf(':');
    const key = lines[i].substring(0, splitIndex).trim();
    const value = lines[i].substring(splitIndex + 1).trim();
    headers[key] = value;
    if (key.toLowerCase() === 'content-length') { // 判断是否有请求体
      hasRequestBody = true;
    }
  }

  // 构造请求选项对象
  const options = {
    hostname: headers['Host'],
    path: path,
    method: method,
    headers: headers,
    rejectUnauthorized: false
  };

  if (hasRequestBody) { // 如果有请求体，则将其添加到请求选项中
    const requestBody = requestText.substring(requestText.indexOf('\r\n\r\n') + 4);
    options.headers['Content-Length'] = Buffer.byteLength(requestBody);
    options.body = requestBody;
  }

  return { options };
}

// async function openUrl() {
//   const open = await import('open');
//   await open.default('http://127.0.0.1:3000');
// }
function start() {
    const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${server.address().port}`);
    console.log(`Powered by dreamfly`);
    // openUrl()
    });
}

module.exports = { start }