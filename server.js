const config = require('./config');

const Transporter = require('./transporter');
const transporter = new Transporter('rpc.proto');

const bindOptions = {
  bindAddress : config.bindAddress,
  rpc:{
    
  }
}
