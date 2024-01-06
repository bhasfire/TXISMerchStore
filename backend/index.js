require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const sheets = google.sheets('v4');

const app = express();
app.use(cors()); // Use CORS to allow requests from your React app
const port = process.env.PORT || 3001;

async function authenticateWithGoogle() {
  const auth = new google.auth.GoogleAuth({
    keyFile: './keys/googlesheetskey.json', // Ensure the path is correct
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const client = await auth.getClient();
  google.options({ auth: client });
}

app.get('/api/products', async (req, res) => {
  await authenticateWithGoogle();

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID; // Replace with your actual spreadsheet ID
  const range = 'Sheet1'; // Replace with your actual range

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
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const range = 'Sheet1';
  
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
    

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
