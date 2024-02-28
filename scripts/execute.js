const hre = require("hardhat");

const FACTORY_NONCE = 1;
const FACTORY_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const EP_ADDR = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"

async function main() {
  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDR);

  // CREATE: hash(sender + nonce), [deployer = sender]
  // CREATE2: hash(0xFF + sender + bytecode + salt)

  const sender = await hre.ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NONCE
  })

  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  const [signer0] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();
//   const initCode = FACTORY_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2);
const initCode = "0x";

  console.log(sender);

  const Account = await hre.ethers.getContractFactory("Account");

//   await entryPoint.depositTo(sender, {
//     value: hre.ethers.parseEther("100")
//   });

  const userOP = {
    sender,
    nonce: await entryPoint.getNonce(sender, 0), 
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    callGasLimit: 200_000,
    verificationGasLimit: 200_000,
    preVerificationGas: 50_000,
    maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
    paymasterAndData: "0x",
    signature: "0x",
  }

  const tx = await entryPoint.handleOps([userOP], address0);
  const receipt = await tx.wait();
  console.log(receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
