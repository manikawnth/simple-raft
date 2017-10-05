const dgram = require('dgram');

const client = dgram.createSocket('udp4');
let message = '\u2665';
client.bind(41411);
setInterval(function(){
  client.send(message, 41410, 'localhost', (err)=>{
    if(err){
      console.log(err);
      client.close();
    }
  })
}, 1000)