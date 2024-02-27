const hre = require("hardhat");

const EP_ADDR = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"

async function main() {
  const code = await hre.ethers.provider.getCode(EP_ADDR);

  console.log(code);

  // const ep = await hre.ethers.deployContract("EntryPoint");

  // await ep.waitForDeployment();

  // console.log(`EP deployed to ${ep.target}`
  // );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
