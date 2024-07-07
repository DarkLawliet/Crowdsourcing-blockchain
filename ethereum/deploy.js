import HDWalletProvider from "@truffle/hdwallet-provider";
import { Web3 } from "web3";
import { config } from "dotenv";
import factory from "./build/Factory.json" assert { type: "json" };
config();

const factoryInterface = factory.interface;

const bytecode = factory.bytecode;

const provider = new HDWalletProvider(
  process.env.SEED_PHRASE,
  // remember to change this to your own phrase!
  `https://sepolia.infura.io/v3/${process.env.INFURA_PASS}`
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(factoryInterface))
    .deploy({ data: bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();
