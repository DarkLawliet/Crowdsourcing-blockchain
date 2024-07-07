import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign.js";
import {
  Button,
  CardGroup,
  Grid,
  GridColumn,
  GridRow,
} from "semantic-ui-react";
import ContributeForm from "../../components/ContributeForm.js";
import Link from "next/link.js";

const CampaignAddress = ({
  minimumContribution,
  balance,
  requestCount,
  stakeHoldersCount,
  manager,
  address,
}) => {
  const router = useRouter();
  const CampaignAddress = router.query.CampaignAddress;
  const balanceInEth = balance / 1000000000000000000;

  const renderCards = () => {
    const items = [
      {
        header: manager,
        meta: "Address of manager",
        description: "This is the address of the creator of the contract",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "Minimum amount of money to contribute and become an approver",
        style: { overflowWrap: "break-word" },
      },
      {
        header: balanceInEth,
        meta: "Balance left in the contract (eth)",
        description: "This is the amount of money present in the contract rn",
        style: { overflowWrap: "break-word" },
      },
      {
        header: requestCount,
        meta: "Number of requests made",
        description:
          "The total number of requests made for receiving money. Should be approved by approvers",
        style: { overflowWrap: "break-word" },
      },
      {
        header: stakeHoldersCount,
        meta: "Request approved count",
        description:
          "Number of people who have already donated to this campaign",
        style: { overflowWrap: "break-word" },
      },
    ];
    return <CardGroup items={items} />;
  };

  return (
    <Layout>
      {/* <h3>The address of the campaign is {CampaignAddress}</h3> */}
      <Grid>
        <GridRow>
          <GridColumn width={10}>{renderCards()}</GridColumn>
          <GridColumn width={6}>
            <ContributeForm address={address} />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn>
            <Link href={`/campaigns/${address}/requests`}>
              <Button primary>View Requests</Button>
            </Link>
          </GridColumn>
        </GridRow>
      </Grid>
    </Layout>
  );
};

export async function getStaticProps(props) {
  try {
    const campaign = Campaign(props.params.CampaignAddress);
    const summary = await campaign.methods.getSummary().call();
    return {
      props: {
        minimumContribution: Number(summary[0]),
        balance: Number(summary[1]),
        requestCount: Number(summary[2]),
        stakeHoldersCount: Number(summary[3]),
        manager: summary[4],
        address: props.params.CampaignAddress,
      },
    };
  } catch (err) {
    const address = "asdsad";
    return { props: { address } };
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export default CampaignAddress;
