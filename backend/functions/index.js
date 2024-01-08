// require('dotenv').config();

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json()); // This line is added to parse JSON body

async function authenticateWithGoogle() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: functions.config().googlesheets.client_email,
      private_key: functions.config().googlesheets.private_key.replace(/\\n/g, '\n')
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const client = await auth.getClient();
  google.options({ auth: client });
}

// API ROUTES

app.get('/api/products', async (req, res) => {
  await authenticateWithGoogle();

  // const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID; // Replace with your actual spreadsheet ID
  const spreadsheetId = '19KqilIlsgKCdgABGcO8WWxnKO2KxHZy8i4Irtxbbiwc';
  const range = 'Inventory'; // Replace with your actual range

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (rows.length) {
      // Assuming the first row is the header
      const products = rows.slice(1).map((row) => ({
        id: row[0],
        name: row[1],
        price: row[2],
        description: row[3],
        imageUrl: row[4],
        sm_qty: row[5],
        md_qty: row[6],
        lg_qty: row[7],
        xl_qty: row[8]
        // ...map other properties...
      }));
      res.json(products);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error('The API returned an error: ' + err);
    res.status(500).send('Error occurred while fetching data');
  }
});

// Route for getting a single product by ID
app.get('/api/products/:id', async (req, res) => {
    await authenticateWithGoogle();
    const productId = req.params.id; // The ID from the URL
    const spreadsheetId = '19KqilIlsgKCdgABGcO8WWxnKO2KxHZy8i4Irtxbbiwc';
    const range = 'Inventory';
  
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
  
      // Find the product with the given ID
      const product = response.data.values.slice(1).find(row => row[0] === productId);
      if (product) {
        res.json({
          id: product[0],
          name: product[1],
          price: product[2],
          description: product[3],
          imageUrl: product[4],
          sm_qty: product[5],
          md_qty: product[6],
          lg_qty: product[7],
          xl_qty: product[8]
          // ...map other properties...
        });
      } else {
        res.status(404).send('Product not found');
      }
    } catch (err) {
      console.error('The API returned an error:', err);
      res.status(500).send('Error occurred while fetching product details');
    }
  });


// // Route to handle checkouts 
app.post('/api/submit-order', async (req, res) => {
    console.log('Received order submission:', req.body);

    await authenticateWithGoogle();
    const orderData = req.body;
    const spreadsheetId = '19KqilIlsgKCdgABGcO8WWxnKO2KxHZy8i4Irtxbbiwc';

    // Check inventory before processing the order
    try {
        const inventoryRange = 'Inventory!A:I';
        const inventoryResponse = await sheets.spreadsheets.values.get({ spreadsheetId, range: inventoryRange });
        const inventoryRows = inventoryResponse.data.values;
        const totalItems = orderData.products.reduce((total, item) => total + item.quantity, 0);

        for (const item of orderData.products) {
            const productRow = inventoryRows.find(row => row[0] === item.id);
            const sizeColumn = { 'S': 5, 'M': 6, 'L': 7, 'XL': 8 }[item.size];

            if (productRow && productRow[sizeColumn] && Number(productRow[sizeColumn]) < item.quantity) {
                // Insufficient stock for this item
                return res.status(400).send(`Insufficient stock for item ID ${item.id}, Size ${item.size}. Only ${productRow[sizeColumn]} available.`);
            }
        }

        // Process the order as all items have sufficient stock
        const orderValues = [
            [
                uuidv4(),
                orderData.customerName,
                orderData.products.map(p => `${p.id}-${p.name}-${p.size}-${p.quantity}`).join('; '),
                totalItems,
                orderData.subtotal,
                new Date().toLocaleDateString()
            ],
        ];

        // Append order data to Orders sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Orders!A:F',
            valueInputOption: 'USER_ENTERED',
            resource: { values: orderValues },
        });

        // Decrement quantities in Inventory sheet
        for (const item of orderData.products) {
            const productRow = inventoryRows.find(row => row[0] === item.id);
            const sizeColumn = { 'S': 5, 'M': 6, 'L': 7, 'XL': 8 }[item.size];
            productRow[sizeColumn] = (Number(productRow[sizeColumn]) - item.quantity).toString();

            // Update the product row in Inventory sheet
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `Inventory!A${inventoryRows.indexOf(productRow) + 1}:I${inventoryRows.indexOf(productRow) + 1}`,
                valueInputOption: 'USER_ENTERED',
                resource: { values: [productRow] },
            });
        }

        res.send('Order submitted successfully');
    } catch (err) {
        console.error('Error processing order:', err);
        res.status(500).send('Error occurred while processing order');
    }
});


exports.app = functions.https.onRequest(app);
