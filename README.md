# Texas Iron Spikes Merchandise Store

This project is an internal merchandise store for the Texas Iron Spikes organization. It features a simple web application that allows users to browse products, select sizes, and add them to a shopping cart.

## Features

- Browse available merchandise
- Filter products by size
- Add products to the shopping cart with size selection
- View cart and selected items

## Tech Stack

- **Frontend:** React, React Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** Google Sheets API
- **Authentication:** Firebase (planned)
- **Hosting:** Firebase Hosting (planned)

## Project Structure

- `frontend/`: Contains the React application for the user interface.
- `backend/`: Contains the Node.js/Express.js server that interfaces with the Google Sheets API to serve product data.
- `keys/`: (Note: This directory is not checked into version control for security reasons) Contains the service account key for the Google Sheets API.

## Local Development

Before starting, make sure you have [Node.js](https://nodejs.org/) installed on your system.

### Setting Up the Backend

1. Navigate to the `backend/` directory.
2. Install the dependencies with `npm install`.
3. Start the server with `npm start`.

### Setting Up the Frontend

1. Navigate to the `frontend/` directory.
2. Install the dependencies with `npm install`.
3. Start the React development server with `npm start`.

## Configuration

To configure the application for your use:

1. Update the `.env` file in the `backend/` directory with your Google Sheets API credentials.
2. Adjust the product data in your Google Sheets to match the format expected by the application.

## Contributing

We welcome contributions to the Texas Iron Spikes Merchandise Store. Please read our contribution guidelines before submitting a pull request.

## Contact

For any additional questions or comments, please contact the Texas Iron Spikes organization directly.

---

© 2024 Texas Iron Spikes Organization
