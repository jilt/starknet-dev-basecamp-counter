"use client";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-stark/useScaffoldEventHistory";

// A helper to format long hex strings for display
const formatHash = (hash: string) => {
  if (!hash || typeof hash !== "string" || hash.length < 10) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

export const CounterChangedEvents = () => {
  const {
    data: events,
    isLoading,
    error,
  } = useScaffoldEventHistory({
    contractName: "CounterContract",
    eventName: "CounterChanged",
    fromBlock:0n,
    watch:true,
    format:true, // Ensures event data is parsed into a readable format
  });

  if(error) return <div className="text-error">{error.message}</div>;

  if (isLoading && !events) {
    return (
      <div className="flex flex-col items-center justify-center mt-8">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-2">Loading historical events...</p>
      </div>
    );
  }

  // Determine if we should use real events or sample data
  const hasRealEvents = events && events.length > 0;

  // Sample data to display when no real events are found.
  const sampleEvents = [
    {
      log: { transaction_hash: "0x0000000000000000000000000000000000000000000000000000000000000004" },
      parsedArgs: {
        caller: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
        old_value: 10,
        new_value: 0,
        reason: { Reset: {} },
      },
    },
    {
      log: { transaction_hash: "0x0000000000000000000000000000000000000000000000000000000000000003" },
      parsedArgs: {
        caller: "0x0185a44c6d35868657746516a820a531413808a9d7858994344551a35016e024",
        old_value: 9,
        new_value: 10,
        reason: { Increase: {} },
      },
    },
    {
      log: { transaction_hash: "0x0000000000000000000000000000000000000000000000000000000000000002" },
      parsedArgs: {
        caller: "0x0185a44c6d35868657746516a820a531413808a9d7858994344551a35016e024",
        old_value: 10,
        new_value: 9,
        reason: { Decrease: {} },
      },
    },
    {
      log: { transaction_hash: "0x0000000000000000000000000000000000000000000000000000000000000001" },
      parsedArgs: {
        caller: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
        old_value: 0,
        new_value: 42,
        reason: { Set: {} },
      },
    },
  ];

  // Use real events if available, otherwise use sample data.
  const eventsToDisplay = hasRealEvents ? events : sampleEvents;

  // Reverse events to show the latest first in the timeline
  const reversedEvents = [...(eventsToDisplay || [])].reverse();

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h2 className="font-semibold text-2xl mb-6 text-center">Counter History</h2>
      <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
        {reversedEvents.map((event: any, idx: number) => {
          const parsed = event.parsedArgs || {};
          const caller = parsed.caller ?? "?";
          const old_value = parsed.old_value ?? "?";
          const new_value = parsed.new_value ?? "?";
          const reasonKey = parsed.reason ? Object.keys(parsed.reason)[0] : "Unknown";
          const transaction_hash = event.log?.transaction_hash ?? "";

          return (
            <li key={`${transaction_hash}-${idx}`}>
              <div className="timeline-middle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className={`mb-10 ${idx % 2 === 0 ? "timeline-start md:text-end" : "timeline-end"}`}>
                <div className="text-lg font-black text-primary">{reasonKey}</div>
                <p className="my-1">
                  Value changed from <strong>{String(old_value)}</strong> to <strong>{String(new_value)}</strong>.
                </p>
                <div className="text-sm opacity-70">
                  Caller: <span className="font-mono" title={String(caller)}>{formatHash(String(caller))}</span>
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Tx:{" "}
                  <a href={`https://starkscan.co/tx/${transaction_hash}`} target="_blank" rel="noopener noreferrer" className="link link-hover font-mono" title={transaction_hash}>
                    {formatHash(transaction_hash)}
                  </a>
                </div>
              </div>
              {idx < reversedEvents.length - 1 && <hr />}
            </li>
          );
        })}
      </ul>
      {!hasRealEvents && (
        <div className="text-center mt-4 p-2 rounded-lg bg-warning text-warning-content font-semibold">
          Warning: sample data, no events found.
        </div>
      )}
    </div>
  );
};
