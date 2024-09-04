import axios from 'axios';

const RESERVOIR_API_BASE_URL = 'https://api.reservoir.tools';
const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY; 

// Function to fetch NFTs from a specific collection
export const fetchNftsFromCollection = async (collectionAddress: string, limit: number = 5) => {
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
  } catch (error: any) {
    console.error('Error fetching NFTs from Reservoir:', error.message);
    throw new Error('Failed to fetch NFTs from Reservoir');
  }
};
