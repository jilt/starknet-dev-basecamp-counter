"use client";

type Props = {value: any; isLoading?: boolean; error?: any};

export const CounterValue = ({value, isLoading, error}: Props) => {
	if(error) return <span className="text-error">failed</span>;

	if(isLoading || value === undefined) return <span>...</span>;
	return <span className="font-mono">Counter: {String(value)}</span>;
}
