document.getElementById('getBalanceBtn').addEventListener('click', async () => {
    const address = document.getElementById('addressInput').value;
    const spinner = document.getElementById('spinner');
    const walletInfo = document.getElementById('walletInfo');

    if (!address) {
        alert('Please enter a Bitcoin address.');
        return;
    }

    spinner.style.display = 'block';
    walletInfo.innerHTML = '';

    try {
        const response = await fetch('/get-btc-balance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        walletInfo.innerHTML = `<p>Balance: ${data.balance} BTC</p>`;

    } catch (error) {
        console.error('Error fetching balance:', error);
        walletInfo.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    } finally {
        spinner.style.display = 'none';
    }
});