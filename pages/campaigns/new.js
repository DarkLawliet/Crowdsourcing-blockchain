import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Form, FormField, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { useRouter } from "next/router";

const CampaignNew = () => {
  const [minimumContribution, setMinimumContribution] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (event) => {
    setMinimumContribution(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      await factory.methods
        .createCampaign(minimumContribution)
        .send({ from: accounts[0] });

      router.push("/");
    } catch (err) {
      setErrorMsg(err.message);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Layout>
        <h3>Create a Campaign</h3>
        <Form action="post" onSubmit={onSubmit} error={!!errorMsg}>
          <FormField>
            <label>Minimum contribution</label>
            <Input
              label="Wei"
              labelPosition="right"
              value={minimumContribution}
              onChange={handleChange}
            />
          </FormField>
          <Message error header="You fucked up!" content={errorMsg} />
          <Button type="submit" primary loading={isLoading}>
            Create
          </Button>
        </Form>
      </Layout>
    </div>
  );
};

export default CampaignNew;
