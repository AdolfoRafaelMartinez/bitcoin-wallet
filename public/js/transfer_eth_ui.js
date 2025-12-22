document.getElementById('transferButton').addEventListener('click', async () => {
    const senderPrivateKey = document.getElementById('senderPrivateKey').value;
    const recipientAddress = document.getElementById('recipientAddress').value;
    const amount = document.getElementById('amount').value;
    const spinner = document.getElementById('spinner');
    const resultDiv = document.getElementById('result');

    spinner.style.display = 'block';
    resultDiv.innerHTML = '';

    try {
        const response = await fetch('/transfer-eth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ senderPrivateKey, recipientAddress, amount }),
        });

        const result = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = `Transaction sent! Transaction Hash: ${result.txHash}. Waiting for confirmation...`;

            // Start polling for transaction receipt
            const interval = setInterval(async () => {
                try {
                    const receiptResponse = await fetch(`/get-transaction-receipt/${result.txHash}`);
                    const receiptResult = await receiptResponse.json();

                    if (receiptResponse.ok && receiptResult.receipt) {
                        if (receiptResult.receipt.blockNumber) {
                            clearInterval(interval);
                            resultDiv.innerHTML = `Transaction confirmed in block: ${receiptResult.receipt.blockNumber}.<br>Transaction Hash: ${result.txHash}`;
                            spinner.style.display = 'none';
                        } else {
                            resultDiv.innerHTML = `Transaction in mempool. Waiting for confirmation...<br>Transaction Hash: ${result.txHash}`;
                        }
                    } else if (!receiptResponse.ok) {
                        // Stop polling on error, but keep the initial message
                        clearInterval(interval);
                        // The server might be temporarily unavailable, or the transaction might have been dropped.
                        // We leave the user with the transaction hash to check manually.
                    }
                } catch (error) {
                    // Stop polling on error
                    clearInterval(interval);
                }
            }, 5000); // Poll every 5 seconds

        } else {
            resultDiv.innerHTML = `Error: ${result.error}`;
            spinner.style.display = 'none';
        }
    } catch (error) {
        resultDiv.innerHTML = `Error: ${error.message}`;
        spinner.style.display = 'none';
    }
});