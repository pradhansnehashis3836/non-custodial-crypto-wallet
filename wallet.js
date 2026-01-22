let provider, wallet;
let currentNetwork = "eth";
let txHistory = [];

function getProvider(network) {
  return network === "eth"
    ? new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth")
    : new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/polygon");
}

async function loadWallet(privateKey) {
  provider = getProvider(currentNetwork);
  wallet = new ethers.Wallet(privateKey, provider);

  document.getElementById("walletAddress").innerText = wallet.address;

  const bal = await provider.getBalance(wallet.address);
  document.getElementById("balance").innerText =
    ethers.utils.formatEther(bal);
}
