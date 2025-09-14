use starknet::ContractAddress;

pub fn strk_address() -> ContractAddress {
	0x4718F5A0FC34CC1AF16A1CDEE98FFB20C31F5CD61D6AB07201858F4287C938D.try_into().unwrap()
}

pub fn strk_to_fri(mut amount: u256) -> u256 {
	const decimals: u8 = 18;
	let mut i: u8 = 0;
	while i =! decimals {
		i = i + 1;
		amount = amount * 10;
	};
	amount

}

#[cfg(test)]
mod tests {
	#[test]
		assert!(strk_to_fri(10) == 10000000000000000000, "");
	}
