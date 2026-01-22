let decryptedKey;

chrome.storage.local.get("wallet", res => {
  if (res.wallet) {
    document.getElementById("lockScreen").classList.remove("hidden");
  } else {
    document.getElementById("setupScreen").classList.remove("hidden");
  }
});

document.getElementById("createWallet").onclick = async () => {
  const pwd = document.getElementById("newPassword").value;
  const walletObj = ethers.Wallet.createRandom();

  document.getElementById("mnemonicWords").innerText =
    walletObj.mnemonic.phrase;

  const encrypted = await encrypt(walletObj.privateKey, pwd);
  chrome.storage.local.set({ wallet: encrypted });

  document.getElementById("setupScreen").classList.add("hidden");
  document.getElementById("mnemonicScreen").classList.remove("hidden");
};

document.getElementById("confirmMnemonic").onclick = async () => {
  document.getElementById("mnemonicScreen").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
};

document.getElementById("unlockBtn").onclick = async () => {
  const pwd = document.getElementById("unlockPassword").value;
  chrome.storage.local.get("wallet", async res => {
    try {
      decryptedKey = await decrypt(res.wallet, pwd);
      document.getElementById("lockScreen").classList.add("hidden");
      document.getElementById("dashboard").classList.remove("hidden");
      loadWallet(decryptedKey);
    } catch {
      document.getElementById("lockMsg").innerText = "Wrong password";
    }
  });
};

document.getElementById("network").onchange = e => {
  currentNetwork = e.target.value;
  loadWallet(decryptedKey);
};

document.getElementById("sendTx").onclick = async () => {
  const to = document.getElementById("to").value;
  const amt = document.getElementById("amount").value;

  const tx = await wallet.sendTransaction({
    to,
    value: ethers.utils.parseEther(amt)
  });

  document.getElementById("txStatus").innerText = tx.hash;
  txHistory.push(tx.hash);
  document.getElementById("txHistory").innerHTML += `<li>${tx.hash}</li>`;
};

document.getElementById("copyAddress").onclick = () => {
  navigator.clipboard.writeText(wallet.address);
  alert("Address copied");
};
