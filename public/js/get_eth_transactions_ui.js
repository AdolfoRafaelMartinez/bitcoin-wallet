document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ethTransactionsForm');
    const output = document.getElementById('output');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        output.textContent = ''; // Clear previous output

        const address = document.getElementById('address').value;

        try {
            const response = await fetch('/get-eth-transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ address })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }
            
            if (data.result && data.result.transactions.length > 0) {
                output.textContent = JSON.stringify(data.result.transactions, null, 2);
            } else {
                output.textContent = 'No transactions found for this address.';
            }

        } catch (error) {
            console.error('Error fetching transactions:', error);
            output.textContent = `An error occurred: ${error.message}`;
        }
    });
});