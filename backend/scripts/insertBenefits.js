const axios = require('axios');
const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' });

const RESERVOIR_API_BASE_URL = 'https://api.reservoir.tools';
const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY; // Load API key from environment variables

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
});

const insertCollectionBenefits = (collectionAddress, tokenId, shortTitle, longTitle, shortDescription, longDescription, validFrom, validTo, url, actionDate) => {
  const benefitQuery = `
    INSERT INTO collection_benefits (
      contract_address,
      token_id,
      short_title,
      long_title,
      short_description,
      long_description,
      valid_from,
      valid_to,
      url,
      action_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const benefitValues = [
    collectionAddress,
    tokenId,
    shortTitle,
    longTitle,
    shortDescription,
    longDescription,
    validFrom,
    validTo,
    url,
    actionDate
  ];

  db.query(benefitQuery, benefitValues, (err, result) => {
    if (err) {
      console.error('Error inserting collection-level benefit:', err.message);
    } else {
      console.log(`Inserted collection-level benefit for collection: ${collectionAddress}`);
    }
  });
};

const main = async () => {
  const collections = [
    {
      benefit: {
        contract_address: '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e',
        token_id: '67890',
        shortTitle: 'Doodles Community Perks',
        longTitle: 'Exclusive Access to Doodles Community Perks',
        shortDescription: 'Exclusive 20% off Travel Transfers via GetTransfer',
        longDescription: 'Enjoy a 20% discount on all travel transfers via GetTransfer for Doodles holders.',
        validFrom: '2024-06-01T00:00:00+00:00',
        validTo: '2024-12-31T00:00:00+00:00',
        url: 'the-miracle.io/doodles',
        actionDate: '2024-06-15T00:00:00+00:00'
      }
    }
  ];

  try {
    for (const collection of collections) {
      console.log(`Inserting collection-level benefits for collection: ${collection.benefit.contract_address}...`);
      insertCollectionBenefits(
        collection.benefit.contract_address,
        collection.benefit.token_id,
        collection.benefit.shortTitle,
        collection.benefit.longTitle,
        collection.benefit.shortDescription,
        collection.benefit.longDescription,
        collection.benefit.validFrom,
        collection.benefit.validTo,
        collection.benefit.url,
        collection.benefit.actionDate
      );
    }
  } catch (error) {
    console.error('Error during fetching and inserting process:', error.message);
  } finally {
    db.end();
  }
};

main();
