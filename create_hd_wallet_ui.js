import { createHDWallet } from './createHDWalletM49.js';

const createWalletBtn = document.getElementById('createWalletBtn');
const walletInfoDiv = document.getElementById('walletInfo');
const spinner = document.getElementById('spinner');

createWalletBtn.addEventListener('click', () => {
    walletInfoDiv.innerHTML = '';
    spinner.style.display = 'block';

    try {
        const wallet = createHDWallet();
        walletInfoDiv.innerHTML = `
            <p><strong>Mnemonic (Seed Phrase):</strong> ${wallet.mnemonic}</p>
            <p><strong>Derived Address:</strong> ${wallet.address}</p>
            <p><strong>Derived Private Key (WIF):</strong> ${wallet.privateKey}</p>
        `;
    } catch (error) {
        console.error('Error creating wallet:', error);
        walletInfoDiv.innerHTML = "Error creating wallet. Please try again.";
    } finally {
        spinner.style.display = 'none';
    }
});
