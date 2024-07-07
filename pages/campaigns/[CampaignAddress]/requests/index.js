import React from "react";
import Layout from "../../../../components/Layout";
import {
  Button,
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableFooter,
  TableCell,
  TableBody,
  Table,
} from "semantic-ui-react";
import Link from "next/link";
import Campaign from "../../../../ethereum/campaign.js";
import RequestRow from "../../../../components/RequestRow.js";

const CampaignRequests = ({
  address,
  requests,
  requestCount,
  stakeHoldersCount,
}) => {
  console.log(stakeHoldersCount);
  const renderRows = () => {
    return requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          request={request}
          address={address}
          id={index}
          totalCount={stakeHoldersCount}
        />
      );
    });
  };
  return (
    <Layout>
      <h3>All Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <Button primary>Add requests</Button>
      </Link>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>Description</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
            <TableHeaderCell>Recipeint</TableHeaderCell>
            <TableHeaderCell>Approval Count</TableHeaderCell>
            <TableHeaderCell>Approve</TableHeaderCell>
            <TableHeaderCell>Finalize</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>{renderRows()}</TableBody>
      </Table>
    </Layout>
  );
};

export async function getServerSideProps(props) {
  try {
    const address = await props.params.CampaignAddress;
    const campaign = Campaign(address);
    let requestCount = await campaign.methods.getRequestCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );

    requests.map((request) => {
      request["1"] = Number(request["1"]);
      request["4"] = Number(request["4"]);
      request["value"] = Number(request["value"]);
      request["approvalsCount"] = Number(request["approvalsCount"]);
    });

    requestCount = Number(requestCount);
    return { props: { address, requests, requestCount } };
  } catch (err) {
    console.log(err.message);
    const address = "A new error";
    return { props: { address } };
  }
}

// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: true,
//   };
// }

export default CampaignRequests;
