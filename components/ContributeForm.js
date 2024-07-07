import React, { useState } from "react";
import { Form, Input, Message, Button, FormField } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { useRouter } from "next/router";

const ContributeForm = (props) => {
  const [amount, setAmount] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrMsg("");
    setLoading(true);

    const campaign = Campaign(props.address);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .contribute()
        .send({ from: accounts[0], value: web3.utils.toWei(amount, "ether") });
      router.replace(`/campaigns/${props.address}`);
    } catch (err) {
      setErrMsg(err.message);
    }
    setLoading(false);
    setAmount("");
  };

  return (
    <Form onSubmit={onSubmit} error={!!errMsg}>
      <FormField>
        <label>Amount to contribute</label>
        <Input
          label="ether"
          labelPosition="right"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
          }}
        />
      </FormField>
      <Message error header="Fucked up again!!!" content={errMsg} />
      <Button primary loading={loading}>
        Contribute
      </Button>
    </Form>
  );
};

export default ContributeForm;
