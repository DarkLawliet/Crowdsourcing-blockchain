pragma solidity ^0.4.17;

contract Factory{

    address[] public deployedContracts;

    function createCampaign(uint minimum) public {
        address campaignAddress = new Campaign(minimum, msg.sender);
        deployedContracts.push(campaignAddress);
    }

    function allContracts() public view returns(address[]) {
        return deployedContracts;
    }
}

contract Campaign{
    struct Request{
        string description;
        uint value;
        address recipient;
        bool completed;
        uint approvalsCount;
        mapping(address => bool) approvals;
    }
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    uint public stakeHoldersCount;
    mapping(address => bool) public stakeHolders;


    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    function contribute() public payable{
        require(msg.value > minimumContribution);

        stakeHolders[msg.sender] = true;
        stakeHoldersCount++;
    }

    function createRequest(string memory description, uint value, address recipient) public restricted{
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            completed: false,
            approvalsCount: 0
        });
        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(!request.completed);
        require(stakeHolders[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvalsCount++;
        request.approvals[msg.sender] = true;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(!request.completed);
        require(request.approvalsCount > (stakeHoldersCount/2));
        
        request.recipient.transfer(request.value);
        request.completed = true; 
    }

    function getSummary() public view returns(
        uint, uint, uint, uint, address
    ){
        return(
            minimumContribution,
            this.balance,
            requests.length,
            stakeHoldersCount,
            manager
        );
    }

    function getRequestCount() public view returns(uint){
        return requests.length;
    }
}