import web3 from "./web3.js";

import Factory from "./build/Factory.json" assert { type: "json" };

const instance = new web3.eth.Contract(
  JSON.parse(Factory.interface),
  // "0x3D49ed30Aa5308fEdF8bf49Ec33904d9A935c1C9"
  "0x9ebB9559d24edf8C382fe8B196b060B98C2c6534"
);

export default instance;
