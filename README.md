# RealEstate App

A full-stack real estate application that allows users to list and view properties. Sellers can add their properties, and potential buyers can browse through the available listings.

## Features

- User authentication (login, signup)
- Sellers can list or delete properties
- Buyers can browse properties by different filters
- Users can save favorite properties into their account

## Tech Stack

- **Frontend**: React, TypeScript
- **Backend**: Node.js, Express.js, Sequelize
- **Database**: MySQL
- **Styling**: TailwindCSS

## Requirements

- Node.js + npm
- MySQL

## Setup Instructions

Clone the repository:

```bash
git clone https://github.com/AlexEXE19/lexstateco.git
cd lexstateco
```

Create the .env file inside the 'server' directory with following fields:

PORT=5000
DB_HOST=localhost
DB_USER=<your-db-username>
DB_PASSWORD=<your-db-password>
DB_NAME=<your-db-name>

Install the dependancies and run the dev script for the dev server:

```bash
npm install
npm run dev
```

Have fun!
