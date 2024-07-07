import ganache from "ganache";
import Web3 from "web3";
import assert from "assert";
import fs from "fs-extra";

const web3 = new Web3(ganache.provider());

const compiledFactory = JSON.parse(
  fs.readFileSync("./ethereum/build/Factory.json")
);

console.log(compiledFactory.bytecode);
const compiledFactoryInterface = [
  {
    constant: true,
    inputs: [],
    name: "allContracts",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "deployedContracts",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "minimum", type: "uint256" }],
    name: "createCampaign",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const compiledCampaign = JSON.parse(
  fs.readFileSync("./ethereum/build/Campaign.json")
);

const compiledCampaignInterface = [
  {
    constant: false,
    inputs: [{ name: "index", type: "uint256" }],
    name: "finalizeRequest",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "manager",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "requests",
    outputs: [
      { name: "description", type: "string" },
      { name: "value", type: "uint256" },
      { name: "recipient", type: "address" },
      { name: "completed", type: "bool" },
      { name: "approvalsCount", type: "uint256" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "description", type: "string" },
      { name: "value", type: "uint256" },
      { name: "recipient", type: "address" },
    ],
    name: "createRequest",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "minimumContribution",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "stakeHoldersCount",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "contribute",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "index", type: "uint256" }],
    name: "approveRequest",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "stakeHolders",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "minimum", type: "uint256" },
      { name: "creator", type: "address" },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
];

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactoryInterface)
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  [campaignAddress] = await factory.methods.allContracts().call();
  campaign = await new web3.eth.Contract(
    compiledCampaignInterface,
    campaignAddress
  ); //To get the campaign that is deployed.
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("has the correct manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("should allow contribute money to campaign and marks them as approvers", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "200" });

    const isStakeHolder = await campaign.methods
      .stakeHolders(accounts[1])
      .call();

    assert(isStakeHolder);
  });

  it("checks for the minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: "12",
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods.createRequest("Buy Game", "100", accounts[1]).send({
      from: accounts[0],
      gas: 1000000,
    });

    const request = await campaign.methods.requests(0).call();

    console.log(request);

    assert.equal("Buy Game", request.description);
  });

  it("checks the requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      .createRequest("a", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > 1003);
  });
});
