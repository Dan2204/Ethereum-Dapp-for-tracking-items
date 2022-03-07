// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain');

contract('SupplyChain', function (accounts) {
  // Declare few constants and assign a few sample accounts generated by ganache-cli
  var sku = 1;
  var upc = 1;
  const ownerID = accounts[0];
  const originFarmerID = accounts[1];
  const originFarmName = 'John Doe';
  const originFarmInformation = 'Yarray Valley';
  const originFarmLatitude = '-38.239770';
  const originFarmLongitude = '144.341490';
  var productID = sku + upc;
  const productNotes = 'Best beans for Espresso';
  const productPrice = web3.toWei(1, 'ether');
  var itemState = 0;
  const distributorID = accounts[2];
  const retailerID = accounts[3];
  const consumerID = accounts[4];
  const emptyAddress = '0x00000000000000000000000000000000000000';

  ///Available Accounts
  ///==================
  ///(0) 0x27D8D15CbC94527cAdf5eC14B69519aE23288B95
  ///(1) 0x018C2daBef4904ECbd7118350A0c54DbeaE3549A
  ///(2) 0xCe5144391B4aB80668965F2Cc4f2CC102380Ef0A
  ///(3) 0x460c31107DD048e34971E57DA2F99f659Add4f02
  ///(4) 0xD37b7B8C62BE2fdDe8dAa9816483AeBDBd356088
  ///(5) 0x27f184bdc0E7A931b507ddD689D76Dba10514BCb
  ///(6) 0xFe0df793060c49Edca5AC9C104dD8e3375349978
  ///(7) 0xBd58a85C96cc6727859d853086fE8560BC137632
  ///(8) 0xe07b5Ee5f738B2F87f88B99Aac9c64ff1e0c7917
  ///(9) 0xBd3Ff2E3adEd055244d66544c9c059Fa0851Da44

  console.log('ganache-cli accounts used here...');
  console.log('Contract Owner: accounts[0] ', accounts[0]);
  console.log('Farmer: accounts[1] ', accounts[1]);
  console.log('Distributor: accounts[2] ', accounts[2]);
  console.log('Retailer: accounts[3] ', accounts[3]);
  console.log('Consumer: accounts[4] ', accounts[4]);

  // 1st Test
  it('Testing smart contract function harvestItem() that allows a farmer to harvest coffee', async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event
    var eventEmitted = false;

    // Watch the emitted event Harvested()
    var event = supplyChain.Harvested();
    await event.watch((err, res) => {
      eventEmitted = true;
    });

    // Mark an item as Harvested by calling function harvestItem()
    await supplyChain.harvestItem(
      upc,
      originFarmerID,
      originFarmName,
      originFarmInformation,
      originFarmLatitude,
      originFarmLongitude,
      productNotes
    );

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
    assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
    assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID');
    assert.equal(
      resultBufferOne[3],
      originFarmerID,
      'Error: Missing or Invalid originFarmerID'
    );
    assert.equal(
      resultBufferOne[4],
      originFarmName,
      'Error: Missing or Invalid originFarmName'
    );
    assert.equal(
      resultBufferOne[5],
      originFarmInformation,
      'Error: Missing or Invalid originFarmInformation'
    );
    assert.equal(
      resultBufferOne[6],
      originFarmLatitude,
      'Error: Missing or Invalid originFarmLatitude'
    );
    assert.equal(
      resultBufferOne[7],
      originFarmLongitude,
      'Error: Missing or Invalid originFarmLongitude'
    );
    assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State');
    assert.equal(eventEmitted, true, 'Invalid event emitted');
  });

  // 2nd Test
  it('Testing smart contract function processItem() that allows a farmer to process coffee', async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event
    let eventEmitted = false;

    // Watch the emitted event Processed()
    const event = supplyChain.Processed();
    await event.watch((err, res) => {
      eventEmitted = true;
    });

    // Mark an item as Processed by calling function processtItem()
    await supplyChain.processItem(upc, { from: originFarmerID });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC');
    assert.equal(resultBufferTwo[5], 1, 'Error: Invalid item State');
    assert.equal(eventEmitted, true, 'Event not emitted.');
  });

  // 3rd Test
  it('Testing smart contract function packItem() that allows a farmer to pack coffee', async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event
    let eventEmitted = false;
    // Watch the emitted event Packed()
    const event = supplyChain.Packed();
    await event.watch((err, res) => {
      eventEmitted = true;
    });
    // Mark an item as Packed by calling function packItem()
    await supplyChain.packItem(upc, { from: originFarmerID });
    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);
    // Verify the result set
    assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC');
    assert.equal(resultBufferTwo[5], 2, 'Error: Invalid item state');
    assert.equal(eventEmitted, true, 'Event not emitted.');
  });

  // 4th Test
  it('Testing smart contract function sellItem() that allows a farmer to sell coffee', async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event
    let eventEmitted = false;
    // Watch the emitted event ForSale()
    const event = supplyChain.ForSale();
    await event.watch((err, res) => {
      eventEmitted = true;
    });
    // Mark an item as ForSale by calling function sellItem()
    await supplyChain.sellItem(upc, productPrice, { from: originFarmerID });
    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);
    // Verify the result set
    assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC');
    assert.equal(resultBufferTwo[5], 3, 'Error: Invalid item state');
    assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid productPrice');
    assert.equal(eventEmitted, true, 'Event not emitted.');
  });

  // 5th Test
  it('Testing smart contract function buyItem() that allows a distributor to buy coffee', async () => {
    const supplyChain = await SupplyChain.deployed();
    // ADD DISTRIBUTOR ADDRESS //
    await supplyChain.addDistributor(distributorID, { from: ownerID });

    // Declare and Initialize a variable for event
    let eventEmitted = false;

    // Watch the emitted event Sold()
    const event = supplyChain.Sold();
    event.watch((err, res) => {
      eventEmitted = true;
    });
    // GET BALANCE BEFORE CALLING FUNCTION //
    const balanceBeforeTransaction = await web3.eth.getBalance(originFarmerID);

    // Mark an item as Sold by calling function buyItem()
    await supplyChain.buyItem(upc, { from: distributorID, value: productPrice });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // GET BALANCE AFTER CALLING FUNCTION //
    const balanceAfterTransaction = await web3.eth.getBalance(originFarmerID);

    // Verify the result set
    assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC');
    assert.equal(resultBufferTwo[5], 4, 'Error: Invalid item state');
    assert.equal(
      resultBufferTwo[6],
      distributorID,
      'Error: Missing or Invalid distributorID'
    );
    assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID');
    assert.equal(
      Number(balanceBeforeTransaction) + Number(productPrice),
      Number(balanceAfterTransaction),
      'Error: Balance Incorrect'
    );
    assert.equal(eventEmitted, true, 'Event not emitted.');
  });

  // 6th Test
  it('Testing smart contract function shipItem() that allows a distributor to ship coffee', async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event
    let eventEmitted = false;
    // Watch the emitted event Shipped()
    const event = supplyChain.Shipped();
    await event.watch((err, res) => {
      eventEmitted = true;
    });
    // Mark an item as Shipped by calling function buyItem()
    await supplyChain.shipItem(upc, { from: distributorID });
    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);
    // Verify the result set
    assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC');
    assert.equal(resultBufferTwo[5], 5, 'Error: Invalid item state');
    assert.equal(eventEmitted, true, 'Event not emitted.');
  });

  // 7th Test
  it('Testing smart contract function receiveItem() that allows a retailer to mark coffee received', async () => {
    const supplyChain = await SupplyChain.deployed();
    // ADD RETAILER ADDRESS //
    await supplyChain.addRetailer(retailerID, { from: ownerID });

    // Declare and Initialize a variable for event
    let eventEmitted = false;

    // Watch the emitted event Received()
    const event = supplyChain.Received();
    await event.watch((err, res) => {
      eventEmitted = true;
    });

    // Mark an item as Received by calling function buyItem()
    await supplyChain.receiveItem(upc, { from: retailerID });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC');
    assert.equal(resultBufferTwo[5], 6, 'Error: Invalid item state');
    assert.equal(
      resultBufferTwo[7],
      retailerID,
      'Error: Missing or Invalid distributorID'
    );
    assert.equal(resultBufferOne[2], retailerID, 'Error: Missing or Invalid ownerID');
    assert.equal(eventEmitted, true, 'Event not emitted.');
  });

  // 8th Test
  it('Testing smart contract function purchaseItem() that allows a consumer to purchase coffee', async () => {
    const supplyChain = await SupplyChain.deployed();
    // ADD CONSUMER ADDRESS //
    await supplyChain.addConsumer(consumerID, { from: ownerID });

    // Declare and Initialize a variable for event
    let eventEmitted = false;

    // Watch the emitted event Purchased()
    const event = supplyChain.Purchased();
    await event.watch((err, res) => {
      eventEmitted = true;
    });

    // Mark an item as Purchased by calling function buyItem()
    await supplyChain.purchaseItem(upc, { from: consumerID });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC');
    assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item state');
    assert.equal(
      resultBufferTwo[8],
      consumerID,
      'Error: Missing or Invalid distributorID'
    );
    assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID');
    assert.equal(eventEmitted, true, 'Event not emitted.');
  });

  // 9th Test
  it('Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain', async () => {
    const supplyChain = await SupplyChain.deployed();

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    // Verify the result set:
    assert(resultBufferOne[0], sku, 'Error: Invalid sku');
    assert(resultBufferOne[1], upc, 'Error: Invalid upc');
    assert(resultBufferOne[2], consumerID, 'Error: Invalid ownerID');
    assert(resultBufferOne[3], originFarmerID, 'Error: Invalid originFarmerID');
    assert(resultBufferOne[4], originFarmName, 'Error: Invalid originFarmName');
    assert(
      resultBufferOne[5],
      originFarmInformation,
      'Error: Invalid originFarmInformation'
    );
    assert(resultBufferOne[6], originFarmLatitude, 'Error: Invalid originFarmLatitude');
    assert(resultBufferOne[7], originFarmLongitude, 'Error: Invalid originFarmLongitude');
  });

  // 10th Test
  it('Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain', async () => {
    const supplyChain = await SupplyChain.deployed();

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);
    // Verify the result set:
    assert(resultBufferTwo[0], sku, 'Error: Invalid sku');
    assert(resultBufferTwo[1], upc, 'Error: Invalid upc');
    assert(resultBufferTwo[2], productID, 'Error: Invalid productID');
    assert(resultBufferTwo[3], productNotes, 'Error: Invalid productNotes');
    assert(resultBufferTwo[4], productPrice, 'Error: Invalid productPrice');
    assert(resultBufferTwo[5], 7, 'Error: Invalid State');
    assert(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID');
    assert(resultBufferTwo[7], retailerID, 'Error: Invalid retailerID');
    assert(resultBufferTwo[8], consumerID, 'Error: Invalid consumerID');
  });
});
