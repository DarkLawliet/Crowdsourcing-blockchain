import React, { useEffect } from "react";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Layout from "../components/Layout.js";
import Link from "next/link";
import routes from "../routes.js";

function CampaignIndex({ campaigns }) {
  const renderCampaigns = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: <Link href={`/campaigns/${address}`}>View Campaign</Link>,
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <div>
        <h1>Welcome to the kickstarter website</h1>
        <Link href={"/campaigns/new"}>
          <Button
            content="Create Campaign"
            icon="add circle"
            primary
            floated="right"
          />
        </Link>

        <div>{renderCampaigns()}</div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const campaigns = await factory.methods.allContracts().call();
  return { props: { campaigns } };
}

export default CampaignIndex;
