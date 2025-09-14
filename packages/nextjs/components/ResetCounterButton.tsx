"use client";

import { useScaffoldMultiWriteContract, createContractCall } from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark/useDeployedContractInfo";
import useScaffoldStrkBalance from "~~/hooks/scaffold-stark/useScaffoldStrkBalance";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useAccount } from "~~/hooks/useAccount";
import {uint256} from "starknet";

const DECIMALS = 18n;
const PAYMENT_TOKENS = 1n; // single source for cost in STRK units
const PAYMENT_AMOUNT = uint256.bnToUint256(PAYMENT_TOKENS * 10n ** DECIMALS);

export const ResetCounterButton = ({counter}: {counter: any}) => {

	const {connectedAddress}=useAccount();
	const {data: owner}=useScaffoldReadContract({
	  contractName: "CounterContract",
	  functionName: "owner",
	});
	const ownerAddress = owner?.toString();
    	const {data: strkBalance} = useScaffoldStrkBalance({address: connectedAddress});

	const {data: counterContract} = useDeployedContractInfo("CounterContract");
	const counterAddress = counterContract?.address;
	const isZero = counter == 0;
	
	// check user balance
	const hasEnoughBalance = (strkBalance ?? 0n) >= PAYMENT_TOKENS * 10n ** DECIMALS;


	const resetCall = {
	contractName: "CounterContract",
	functionName: "reset_counter",
	args: [],
	};

	let calls: any[] = [];
	  
	calls = [
	    createContractCall("Strk", "approve", [counterAddress, PAYMENT_AMOUNT]),
	    resetCall,
	];
	
	const {sendAsync, status} = useScaffoldMultiWriteContract({calls});
	const isBusy = status === "pending";
	const handleResetCounter = async () => {
	  try {
	  await sendAsync();
	  } catch (e) {
	    console.error("Error resetting counter", e);
	  }
	};
console.log(isBusy);
console.log(isZero);
console.log(hasEnoughBalance);

  return (
  <button
    className="btn btn-warning btn-sm"
    onClick={handleResetCounter}
    disabled={isBusy || isZero}
    title="Pays STRK and resets the counter"
  >
    {isBusy ? "Resetting..." : "Reset"}
  </button>
  );
};

