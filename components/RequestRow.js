import React from "react";
import {
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableFooter,
  TableCell,
  TableBody,
  Table,
  Button,
} from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

const RequestRow = (props) => {
  const onApprove = async () => {
    const campaign = Campaign(props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(props.id).send({ from: accounts[0] });
  };

  const onFinalize = async () => {
    const campaign = Campaign(props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods
      .finalizeRequest(props.id)
      .send({ from: accounts[0] });
  };
  return (
    <>
      <TableRow>
        <TableCell>{props.id}</TableCell>
        <TableCell>{props.request.description}</TableCell>
        <TableCell>
          {web3.utils.fromWei(props.request.value, "ether")}
        </TableCell>
        <TableCell>{props.request.recipient}</TableCell>
        <TableCell>{props.request.approvalsCount}/5</TableCell>
        <TableCell>
          <Button color="green" basic onClick={onApprove}>
            Approve
          </Button>
        </TableCell>
        <TableCell>
          <Button color="red" basic onClick={onFinalize}>
            Finalize
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default RequestRow;
