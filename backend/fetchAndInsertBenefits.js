const axios = require('axios');
const mysql = require('mysql2');
require('dotenv').config();

const RESERVOIR_API_BASE_URL = 'https://api.reservoir.tools';
const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY; // Load API key from environment variables

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
});

const fetchNftsFromCollection = async (collectionAddress, limit = 5) => {
  try {
    const response = await axios.get(`${RESERVOIR_API_BASE_URL}/tokens/v5`, {
      headers: {
        'x-api-key': RESERVOIR_API_KEY,
      },
      params: {
        collection: collectionAddress,
        limit: limit.toString(),
      },
    });

    return response.data.tokens;
  } catch (error) {
    console.error('Error fetching NFTs from Reservoir:', error.message);
    throw new Error('Failed to fetch NFTs from Reservoir');
  }
};

const insertBenefits = (nftData) => {
  nftData.forEach((nft) => {
    const benefitQuery = `
      INSERT INTO nft_benefits (
        short_title,
        long_title,
        short_description,
        long_description,
        thumbnail,
        contract_address,
        token_id,
        valid_from,
        valid_to,
        url,
        action_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const benefitValues = [
      'Exclusive Access',
      `Access to Private Events for Token #${nft.token.tokenId}`,
      'Get exclusive access to private events for NFT holders.',
      'Holders of this specific NFT receive access to exclusive events and early releases.',
      'https://themiracle.io/media/image.png',
      nft.token.contract,
      nft.token.tokenId,
      '2024-05-01T00:00:00+00:00',
      '2024-06-01T00:00:00+00:00',
      'https://example.com/details',
      '2024-05-15T00:00:00+00:00',
    ];

    db.query(benefitQuery, benefitValues, (err, result) => {
      if (err) {
        console.error('Error inserting NFT benefit:', err.message);
      } else {
        console.log(`Inserted benefit for NFT Token ID: ${nft.token.tokenId}`);
      }
    });
  });
};

// Main function to fetch NFTs and insert benefits
const main = async () => {
  const collectionAddress = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D';
  const limit = 5;

  try {
    console.log(`Fetching NFTs from collection: ${collectionAddress}`);
    const nfts = await fetchNftsFromCollection(collectionAddress, limit);

    console.log('nfts ', nfts);

    if (nfts.length === 0) {
      console.log('No NFTs found for this collection.');
      return;
    }

    console.log(`Fetched ${nfts.length} NFTs. Inserting benefits...`);
    insertBenefits(nfts);
  } catch (error) {
    console.error('Error during fetching and inserting process:', error.message);
  } finally {
    db.end(); 
  }
};

main();
