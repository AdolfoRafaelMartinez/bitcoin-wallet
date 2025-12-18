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
                <div>
                    <p><strong>Path:</strong> ${key.path}</p>
                    <p><strong>Address:</strong> ${key.address}</p>
                    <p><strong>Private Key (WIF):</strong> ${key.privateKey}</p>
                </div>
                <hr>
            `;
        });
        walletInfoDiv.innerHTML = `
            <p><strong>Seed Phrase:</strong> ${wallet.mnemonic}</p>
            <hr>
            <p><strong>Address:</strong> ${wallet.address}</p>
            <p><strong>Private Key (WIF):</strong> ${wallet.privateKey}</p>
            ${childKeysHtml}
        `;
    } catch (error) {
        console.error('Error creating wallet:', error);
        walletInfoDiv.innerHTML = "Error creating wallet. Please try again.";
    } finally {
        spinner.style.display = 'none';
    }
});
