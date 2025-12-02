require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple in-memory notifications store (demo only)
const notifications = [];

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_SECRET = process.env.PAYPAL_SECRET || '';
const PAYPAL_ENV = process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

app.use(express.json());
app.use(express.static(path.join(__dirname)));

async function getAccessToken() {
    const res = await fetch(`${PAYPAL_ENV}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });
    if (!res.ok) throw new Error('Failed to get access token');
    const data = await res.json();
    return data.access_token;
}

app.get('/api/config', (req, res) => {
    res.json({ clientId: PAYPAL_CLIENT_ID, env: process.env.PAYPAL_ENV || 'sandbox' });
});

app.post('/api/create-order', async (req, res) => {
    try {
        const { price } = req.body || {}; const amount = (price || 100).toFixed ? Number(price) : 100;
        const token = await getAccessToken();
        const orderRes = await fetch(`${PAYPAL_ENV}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [{ amount: { currency_code: 'USD', value: String(amount) } }]
            })
        });
        const order = await orderRes.json();
        res.json(order);
    } catch (err) {
        console.error(err); res.status(500).json({ error: err.message });
    }
});

app.post('/api/capture-order', async (req, res) => {
    try {
        const { orderID } = req.body || {};
        if (!orderID) return res.status(400).json({ error: 'orderID required' });
        const token = await getAccessToken();
        const capRes = await fetch(`${PAYPAL_ENV}/v2/checkout/orders/${orderID}/capture`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        const cap = await capRes.json();
        // In production, verify capture status, store transaction in DB, and issue subscription server-side
        res.json(cap);
    } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

// webhook endpoint (simple logger). Configure a webhook in PayPal dashboard and set WEBHOOK_ID to verify.
app.post('/webhook', express.raw({ type: '*/*' }), (req, res) => {
    console.log('Webhook received');
    // TODO: verify webhook signature using PayPal SDK and WEBHOOK_ID before processing
    res.status(200).send('OK');
});

// Notification endpoint: receives client-side reports (e.g., failed bot check)
app.post('/api/notify', (req, res) => {
    try {
        const payload = req.body || {};
        const note = {
            receivedAt: new Date().toISOString(),
            ip: req.ip,
            userAgent: req.get('User-Agent') || '',
            payload
        };
        notifications.push(note);
        console.log('Notification received:', note);
        // In production, persist to a DB or forward to alerting/analytics
        res.status(200).json({ status: 'ok' });
    } catch (err) {
        console.error('Failed to handle notification', err);
        res.status(500).json({ error: 'failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`PayPal env: ${process.env.PAYPAL_ENV || 'sandbox'}`);
});
