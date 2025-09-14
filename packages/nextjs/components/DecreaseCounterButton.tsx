"use client";

import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";

export const DecreaseCounterButton = ({counter}: {counter: any}) => {
    const {sendAsync, status} = useScaffoldWriteContract({
        contractName: "CounterContract",
        functionName: "decrease_counter",
        args: [],
    });

    const valueNum = counter ? Number(counter) : 0;


    const isBusy = status === "pending";
    const isDisabled = isBusy || counter === undefined || valueNum <= 0; 

    return (
        <button
            className="btn btn-primary btn-sm"
            onClick={() => sendAsync()}
            disabled={isDisabled} // Removed the space around the equals sign
            title={valueNum <= 0 ? "Counter is already 0" : undefined }
        >
        {isBusy ? "Decreasing..." : "-1"}
        </button>
    
    );
};
