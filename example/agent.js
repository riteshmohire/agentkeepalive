'use strict';

const http = require('http');
const Agent = require('../');

const keepaliveAgent = new Agent({
  keepAlive: true,
});
// https://www.google.com/search?q=nodejs&sugexp=chrome,mod=12&sourceid=chrome&ie=UTF-8

const options = {
  host: 'www.taobao.com',
  path: '/',
  method: 'GET',
  port: 80,
  agent: keepaliveAgent,
};

function get() {
  const start = Date.now();
  const req = http.get(options, res => {
    console.log('STATUS1: %d, %d ms', res.statusCode, Date.now() - start);
    console.log('HEADERS1: %j', res.headers);
    res.on('data', chunk => {
      console.log('BODY1: %d', chunk.length);
    });
    res.on('end', () => {
      console.log('get end');
    });
  });
  req.on('error', e => {
    console.log('problem with request: ' + e.message);
  });
}

get();

setTimeout(() => {
  console.log('keep alive sockets:', keepaliveAgent);
  process.exit();
}, 300000);

let count = 0;
setInterval(function() {
  const name = keepaliveAgent.getName(options);
  const sockets = keepaliveAgent.sockets[name] || [];
  const freeSockets = keepaliveAgent.freeSockets[name] || [];
  console.log('%ss, %s, sockets: %d, destroyed: %s, free sockets: %d, destroyed: %s', ++count,
    name, sockets.length, sockets[0] && sockets[0].destroyed,
    freeSockets.length, freeSockets[0] && freeSockets[0].destroyed);
}, 1000);

setInterval(get, 120000);
