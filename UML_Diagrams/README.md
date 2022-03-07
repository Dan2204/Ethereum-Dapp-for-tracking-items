Assignment for Section 3 - Ethereum Dapp for tracking items.

Tools used:

  Node.js => 10.13.0
  Truffle => 4.1.14
  web3 cdn => 0.20.6
  
npm run dev launches lite-server v2.4.0  
Rinkeby contract address => https://rinkeby.etherscan.io/address/0xa693bfef13e21d19a2e69addefb7f157f285edc4
Creation Transaction Hash => https://rinkeby.etherscan.io/tx/0x830ae7ad5bcee308120cb4d886e266eb4e2e0f8bef9f7226f874e5ce96687e29

UML Activity, Sequence, State and Class diagrams are saved in the UML_Diagrams folder.

All tests pass and events all emitted.
Project is complete and running. When testing the contract on Rinkeby, use a UPC higher than 2 as previous ones have passed the processItem stage.

When completing the smart comtracts, the modifiers have been added as per the Rubric.
The security could be made tighter by replacing the only<Actor> modifier with the verifyCaller modifier and check the caller is the Actor listed.
This would only work if there is only one address with the Actor. However, the Actor business may have a few employees that could need access, 
  dependant on the size of the project; in this case, the only<Actor> modifier would suffice.
 
There would also need to be a definitive way for Actors to be added. Maybe by the previous owner before passing ownership over.
As it stands, only the contract owner can utilise the methods. Although, I added the originalFarmerID passed in the harvestItem method so that address 
  would be able to use the remainder of the Farmer methods.

