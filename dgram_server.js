const dgram = require('dgram');

const server = dgram.createSocket('udp4');

server.on('message', (msg,rinfo)=>{
  console.log(msg.toString('utf8'));
  console.log(rinfo);
})

server.bind(41410);