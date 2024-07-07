import React, { useState } from "react";
import Layout from "../../../../components/Layout";
import {
  Button,
  Form,
  FormField,
  Message,
  Input,
  Label,
  ButtonGroup,
} from "semantic-ui-react";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
import { useRouter } from "next/router";
import Link from "next/link";

const NewRequest = ({ address }) => {
  console.log(address);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [recipeint, setRecipient] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    const campaign = Campaign(address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(
          description,
          web3.utils.toWei(amount, "ether"),
          recipeint
        )
        .send({ from: accounts[0] });
    } catch (err) {
      setErrorMessage(err.message);
    }
    setIsLoading(false);
    setDescription("");
    setAmount("");
    setRecipient("");
  };

  return (
    <Layout>
      <Link href={`/campaigns/${address}/requests`}>Back</Link>
      <h3>Create a new Request</h3>
      <Form error={!!errorMessage} onSubmit={onSubmit}>
        <FormField>
          <label>Description</label>
          <Input
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
        </FormField>
        <FormField>
          <label>Amount in Ether</label>
          <Input
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
            }}
          />
        </FormField>
        <FormField>
          <label>Recipient</label>
          <Input
            value={recipeint}
            onChange={(event) => {
              setRecipient(event.target.value);
            }}
          />
        </FormField>
        <Message error header={"Fucked up here too!!"} content={errorMessage} />
        <Button primary loading={isLoading}>
          Create
        </Button>
      </Form>
    </Layout>
  );
};

export async function getStaticProps(props) {
  try {
    const address = props.params.CampaignAddress;
    return { props: { address } };
  } catch (err) {
    console.log(err.message);
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export default NewRequest;
