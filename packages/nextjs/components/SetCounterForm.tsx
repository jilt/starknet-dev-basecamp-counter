"use client";

import {useMemo, useState} from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useAccount } from "~~/hooks/useAccount";

export const SetCounterForm = ({current}: {current: any}) => {
	const [value, setValue] = useState<string>(
		current !== undefined ? String(current) : 0,
	);
	
	const { sendAsync, status }=useScaffoldWriteContract({
	contractName: "CounterContract",
	functionName: "set_counter",
	args:[],
	}as any);

	const {address}=useAccount();
	const {data: owner}=useScaffoldReadContract({
	  contractName: "CounterContract",
	  functionName: "owner",
	});
     /**
     * Normalizes any input to a hexadecimal string representation.
     * This is crucial because different hooks can return addresses as BigInts, strings,
     * or even arrays. This function standardizes the format for reliable comparison.
     * @param input The value to normalize.
     * @returns A normalized hexadecimal string (e.g., "0x0123...") or undefined.
     */
    const normalizeToHex = (input: any): string | undefined => {
        if (input === undefined || input === null) return undefined;
        const raw: any = Array.isArray(input) ? input[0] : input;
        const s = String(raw);
        if (s.length === 0) return undefined;
        return s.startsWith("0x") ? s : `0x${BigInt(s).toString(16)}`;
    };

    const isOwner = useMemo(() => {
        // Normalize both the user's account address and the contract owner's address
        // to a consistent hex string format before comparison.
        const addrHex = normalizeToHex(address);
        const ownerHex = normalizeToHex(owner);

        // If either address is undefined, the comparison is impossible.
        if (!addrHex || !ownerHex) return false;

        // Compare the two normalized addresses as BigInts to avoid issues with
        // case sensitivity or leading zeros that can affect string comparison.
        try {
            return BigInt(addrHex) === BigInt(ownerHex);
        } catch {
            // Return false if conversion fails for any reason.
            return false;
        }
    }, [address, owner]);

	
	const isBusy = status ==="pending";
	const parsed = (() =>{
	  const n = Number(value);
	  if(!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) return undefined;
	  return n;
	})();
	
	return(
	
	<form
	  className="flex items-center gap-2"
	  onSubmit={(e) => {
	   e.preventDefault();
	   if(parsed == undefined) return;
	   sendAsync({args: [parsed] as any});
	  }}
	>
	  <input
	    className="input input bordered input-sm w-24"
	    type="number"
	    min={0}
	    step={1}
	    value={value}
	    onChange={(e) => setValue(e.target.value)}
	  />
	  <button
	    className="btn btn-accent btn-sm"
	    type="submit"
	    disabled={isBusy || parsed === undefined || !isOwner}
	    title={
		!isOwner
		? "Only the owner can set"
		: parsed == undefined 
  		  ? "Enter a non-negative integer"
		  : undefined
	    }
	  >
	    {isBusy ? "Setting...": "Set"}
	  </button>
	</form>	

);
};

