require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load product data
const products = JSON.parse(fs.readFileSync('products.json'));
const orders = JSON.parse(fs.readFileSync('orders.json', 'utf8') || '[]');

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Routes
app.get('/', (req, res) => {
  res.render('index', { products });
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).send('Product not found');
  res.render(`products/${product.id}`, { product });
});

app.get('/cart', (req, res) => {
  res.render('cart');
});

app.get('/checkout', (req, res) => {
  res.render('checkout');
});

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // in cents
      currency: 'usd'
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/process-order', async (req, res) => {
  const { name, email, address, paymentMethod } = req.body;
  const cart = JSON.parse(req.body.cart);
  
  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Create order
  const order = {
    id: `order_${Date.now()}`,
    date: new Date().toISOString(),
    customer: { name, email, address },
    items: cart,
    total,
    status: 'paid'
  };
  
  // Save order
  orders.push(order);
  fs.writeFileSync('orders.json', JSON.stringify(orders, null, 2));
  
  // Update inventory
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      product.inventory -= item.quantity;
    }
  });
  fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
  
  // Send confirmation email
  try {
    await sendConfirmationEmail(order);
    res.redirect(`/confirmation?orderId=${order.id}`);
  } catch (err) {
    console.error('Email error:', err);
    res.redirect(`/confirmation?orderId=${order.id}`);
  }
});

app.get('/confirmation', (req, res) => {
  const order = orders.find(o => o.id === req.query.orderId);
  if (!order) return res.status(404).send('Order not found');
  res.render('confirmation', { order });
});

// Helper function to send email
async function sendConfirmationEmail(order) {
  const mailOptions = {
    from: `Eden's Greenery <${process.env.EMAIL_USER}>`,
    to: order.customer.email,
    subject: `Your Eden's Greenery Order #${order.id.substring(6)}`,
    html: generateEmailContent(order)
  };
  
  return transporter.sendMail(mailOptions);
}

function generateEmailContent(order) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3a5a40;">Thank you for your order!</h1>
      <p>Your order #${order.id.substring(6)} has been received and is being processed.</p>
      
      <h2 style="color: #588157; margin-top: 30px;">Order Summary</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f1f1f1;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: right;">Price</th>
            <th style="padding: 10px; text-align: center;">Qty</th>
            <th style="padding: 10px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
            <td style="padding: 10px; text-align: right; font-weight: bold;">$${order.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      
      <h2 style="color: #588157; margin-top: 30px;">Shipping Information</h2>
      <p>${order.customer.name}<br>
      ${order.customer.address}<br>
      ${order.customer.email}</p>
      
      <p style="margin-top: 30px;">We'll notify you when your order ships. If you have any questions, please reply to this email.</p>
      
      <p style="margin-top: 40px; color: #888; font-size: 0.9em;">
        Eden's Greenery<br>
        123 Greenway Blvd, Plantville, PV 12345<br>
        (555) 123-4567
      </p>
    </div>
  `;
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});