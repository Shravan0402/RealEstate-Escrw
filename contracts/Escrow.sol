// SPDX-License-Identifier: MIT

pragma solidity 0.8.8;

interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _id) external;
}

contract Escrow{

    enum inspectionStatusOptions{pending, done, fail}

    struct estate{
        address nftAddress;
        uint256 nftID;
        address payable buyer;
        address payable seller;
        address payable inspector;
        address lender;
        uint256 purchaseAmount;
        uint256 processedAmount;
        inspectionStatusOptions inspectionStatus;
        bool transactionStatus;
    }
    
    struct approvals{
        bool sellerApproval;
        bool buyerApproval;
        bool lenderApproval;
    }

    mapping(uint256 => estate) properties;
    mapping(uint256 => approvals) public approval;

    address payable owner;

    constructor(){
        owner = payable(msg.sender);
    }

    modifier onlyBuyer(uint256 _nftID){
        require(properties[_nftID].buyer == msg.sender);
        _;
    }

    modifier onlySeller(uint256 _nftID){
        require(properties[_nftID].seller == msg.sender);
        _;
    }

    modifier onlyInspector(uint256 _nftID){
        require(properties[_nftID].inspector == msg.sender);
        _;
    }

    modifier onlyLender(uint256 _nftID){
        require(properties[_nftID].lender == msg.sender);
        _;
    }

    function approve(uint256 _nftID) public {
        if(properties[_nftID].seller == msg.sender){
            approval[_nftID].sellerApproval = true;
        }else if(properties[_nftID].buyer == msg.sender){
            approval[_nftID].buyerApproval = true;
        }else if(properties[_nftID].lender == msg.sender){
            approval[_nftID].lenderApproval = true;
        }
    }

    function new_estate(address _nftAddress, uint256 _nftID, address payable _buyer, address payable _inspector, address _lender, uint256 _purchaseAmount) public {
        properties[_nftID] = estate(_nftAddress, _nftID, _buyer,payable(msg.sender),_inspector,_lender,_purchaseAmount, 0,inspectionStatusOptions.pending, false);
        approval[_nftID] = approvals(false, false, false);
    }

    function inspection_update(uint256 _nftID,inspectionStatusOptions _inspectionStatus) public onlyInspector(_nftID) {
        require(properties[_nftID].processedAmount > 0, "Let the buyer pay the inspection fees");
        properties[_nftID].inspectionStatus = _inspectionStatus;
    }

    function pay_escrow(uint256 _nftID) public payable onlyBuyer(_nftID){
        require(msg.value >= properties[_nftID].purchaseAmount*22/100, "You need to pay atleast 20% of the total amount.");
        properties[_nftID].processedAmount += msg.value;
    }

    function pay_lender(uint256 _nftID) public payable onlyLender(_nftID){
        require(properties[_nftID].inspectionStatus == inspectionStatusOptions.done, "Inspection need to be done in order to proceed");
        require(msg.value >= properties[_nftID].purchaseAmount*80/100, "You need to pay atleast the remaining amount");
        properties[_nftID].processedAmount += msg.value;
    }

    function transact_property(uint256 _nftID) public {
        require(properties[_nftID].inspectionStatus == inspectionStatusOptions.done, "The property need to be insepcted by the inspector");
        require(approval[_nftID].sellerApproval, "Seller approval is needed for the transaction");
        require(approval[_nftID].buyerApproval, "Buyer approval is needed for the transaction");
        require(approval[_nftID].lenderApproval, "Lender approval is needed for the transaction");
        require(properties[_nftID].processedAmount >= properties[_nftID].purchaseAmount);
        (bool sellersuccess, ) = payable(properties[_nftID].seller).call{value: properties[_nftID].purchaseAmount}("");
        require(sellersuccess, "Payment failed");
        (bool inspectorsuccess, ) = payable(properties[_nftID].inspector).call{value: properties[_nftID].processedAmount * 1/100}("");
        require(inspectorsuccess, "Payment failed");
        (bool ownersuccess, ) = payable(owner).call{value: properties[_nftID].processedAmount * 1/100}("");
        require(ownersuccess, "Payment failed");
        IERC721(properties[_nftID].nftAddress).transferFrom(properties[_nftID].seller, properties[_nftID].buyer, properties[_nftID].nftID);
        properties[_nftID].transactionStatus = true;
        properties[_nftID].processedAmount = 0;
    }

    function cancelSale(uint256 _nftID) public {
        require(properties[_nftID].inspectionStatus == inspectionStatusOptions.fail, "The inspection was found to be true");
        payable(properties[_nftID].buyer).call{value: properties[_nftID].processedAmount}("");
    }

    receive() external payable {}

    function getBalance(uint256 _nftID) public view returns(uint256){
        return properties[_nftID].processedAmount;
    }
}