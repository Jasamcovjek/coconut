let checkoutTotalUSD = 0;
let playerIGN = "";
let timerInterval;

// DODAJ SVOJE ADRESE OVDJE
const walletAddresses = {
    'BTC': 'bc1qqzuee3n26k9l5wj3c3e8sxmn57uxvym8e8qdqx',
    'ETH': '0xDEeeFFAEDf675F9dDE2F6B3F6e29a5d9F2BeD296',
    'LTC': 'LUi4re3Tuq9bqSRDhRPMXHF7q4gV9fDVLT',
    'USDT': '0xDEeeFFAEDf675F9dDE2F6B3F6e29a5d9F2BeD296',
    'SOL': '5UFzyHkkz6LdRevmU5VAb7z1dBSMx4BiRneKxLmNWxKo',
    'TRX': 'TMfoxvunFtVfRJweAre27nzePBVBKjDKNd',
    'BNB': '0xDEeeFFAEDf675F9dDE2F6B3F6e29a5d9F2BeD296',
    'XRP': 'rwsi9tv1bnhbtPa6iNadKVScs2UUviL3Hi',
    'DOGE': 'DHdTLbnaV1gVduzRBgsxF85KtEkKzwrLJp',
    'ADA': 'addr1qxmnvf0cfe6t8d3lesk0dcqcchzzpdsn2hh43qw5nsa25v9hxcjlsnn5kwmrlnpv7msp33wyyzmpx400tzqaf8p64gcqfu88y3'
};

// Množenje cijene u karticama
document.querySelectorAll('.qty-btn').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.key-card');
        const base = parseFloat(card.dataset.basePrice);
        const mult = parseInt(this.dataset.mult);
        
        card.querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        card.querySelector('.price').innerText = `$${(base * mult).toFixed(2)}`;
    });
});

function hideAll() {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    clearInterval(timerInterval);
}

function goBack(id) { hideAll(); document.getElementById(id).classList.add('active'); }

function addToCart(btn) {
    const card = btn.closest('.key-card');
    checkoutTotalUSD = parseFloat(card.querySelector('.price').innerText.replace('$', ''));
    hideAll();
    document.getElementById('view-username').classList.add('active');
}

function goToCryptoSelect() {
    const user = document.getElementById('mc-username').value.trim();
    if (!user) { document.getElementById('error-msg').style.display = 'block'; return; }
    playerIGN = user;
    document.getElementById('checkout-total-display').innerText = `$${checkoutTotalUSD.toFixed(2)}`;
    hideAll();
    document.getElementById('view-crypto-select').classList.add('active');
}

async function generatePayment(coinId, symbol) {
    hideAll();
    document.getElementById('view-payment').classList.add('active');
    
    // UI Setup
    document.getElementById('crypto-symbol').innerText = symbol;
    document.getElementById('usd-equivalent').innerText = checkoutTotalUSD.toFixed(2);
    document.getElementById('display-ign').innerText = playerIGN;
    const addr = walletAddresses[symbol] || "Address not set";
    document.getElementById('wallet-address').innerText = addr;

    try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
        const data = await res.json();
        const price = data[coinId].usd;
        const amount = (checkoutTotalUSD / price).toFixed(6);
        
        document.getElementById('crypto-amount').innerText = amount;
        
        // Generiraj QR Kod koristeći besplatni API
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${addr}`;
        document.getElementById('qr-image').src = qrUrl;

        startTimer(3600);
    } catch (e) {
        document.getElementById('crypto-amount').innerText = "Error";
    }
}

function startTimer(sec) {
    let t = sec;
    timerInterval = setInterval(() => {
        let m = Math.floor(t / 60);
        let s = t % 60;
        document.getElementById('payment-timer').innerText = `${m}:${s < 10 ? '0'+s : s}`;
        if (--t < 0) clearInterval(timerInterval);
    }, 1000);
}

function copyAddress() {
    const addr = document.getElementById('wallet-address').innerText;
    navigator.clipboard.writeText(addr);
    alert("Address copied to clipboard!");
}