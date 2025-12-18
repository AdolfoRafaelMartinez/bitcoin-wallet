import { createHDWallet } from './createHDWalletM49.js';
const createWalletBtn = document.getElementById('createWalletBtn');
const walletInfoDiv = document.getElementById('walletInfo');
const spinner = document.getElementById('spinner');

createWalletBtn.addEventListener('click', () => {
    walletInfoDiv.innerHTML = '';
    spinner.style.display = 'block';

    try {
        const wallet = createHDWallet();
        let childKeysHtml = '';
        wallet.childKeys.forEach(key => {
            childKeysHtml += `
                <hr>
                <div>
                    <p><strong>Path:</strong> ${key.path}</p>
                    <p><strong>Address:</strong> ${key.address}</p>
                    <p><strong>Private Key (WIF):</strong> ${key.privateKey}</p>
                </div>
            `;
        });
        walletInfoDiv.innerHTML = `
            <p><strong>mnemonic:</strong> ${wallet.mnemonic}</p>
            <p><strong>seed:</strong> (Base64) ${wallet.seed.toBase64()}</p>
            <p><strong>network:</strong> ${(wallet.network.messagePrefix.toLowerCase().includes("bitcoin")) ? "bitcoin test" : "unknown"}</p>
            <p><strong>root:</strong> (Base64) ${wallet.root.chainCode.toBase64()}</p>
            ${childKeysHtml}
            <hr>
        `;
    } catch (error) {
        console.error('Error creating wallet:', error);
        walletInfoDiv.innerHTML = "Error creating wallet. Please try again.";
    } finally {
        spinner.style.display = 'none';
    }
});
