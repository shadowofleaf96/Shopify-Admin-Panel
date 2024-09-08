# JoTiYa Admin Panel

<p align="center">
  <img src="https://github.com/shadowofleaf96/Shopify-Admin-Panel/blob/06f1a58c55965f418755e4badf59142b42e3fffe/client/public/LOGO_APP.webp" alt="JoTiYa Logo" width="120"/>
</p>

Welcome to JoTiYa, an open-source MERN (MongoDB, Express.js, React.js, Node.js) stack for a Shopify Admin Panel project. JoTiYa is designed to provide a foundation for building a robust and scalable Admin Panel for your Shopify Store.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Contributing](#contributing)

## Features

- **User Authentication**: Secure user authentication and authorization. (Completed)
- **Product Management**: Easily manage products, categories, variants... (Completed)
- **Order Management**: Track and manage customer orders efficiently. (Completed)
- **Users Management**: Manage admins and users. (Completed)
- **Dashboard Page**: See and analyze products, orders and sales. (Completed)
- **Export Data**: Seamless Export products and orders as CSV. (Completed)

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shadowofleaf96/Shopify-Admin-Panel.git
   ```

2. Change into the project directory:

   ```bash
   cd Shopify-Admin-Panel
   ```

3. Install server dependencies:

   ```bash
   cd server
   npm install
   ```

4. Install client dependencies:

   ```bash
   cd client
   npm install
   ```

5. Create a `.env` file in the project Frontend root and configure your environment variables:

   ``` env
   ##Frontend
   VITE_BACKEND_URL=http://localhost:3000
   VITE_FRONTEND_URL=http://localhost:5173
   ```

   ``` env
   ##Backend
    SHOPIFY_API_KEY=your Shopify api key
    SHOPIFY_API_SECRET=your Shopify api secret
    SHOPIFY_STORE_NAME=your Shopify store name
    SHOPIFY_ACCESS_TOKEN= your Shopify access token
    SECRET_ACCESS_TOKEN= your Shopify secret access token
    MONGODB_URI= your mongodb uri for user management
    PORT=3000
    SHOPIFY_URL=your Shopify URL
   ```

6. Start the development server:

   ```bash
   cd client
   npm run dev
   open another terminal window
   cd server
   npx nodemon
   ```

## Contributing

We welcome contributions from the community. If you find any bugs or have suggestions for improvement, please open an issue or submit a pull request.
