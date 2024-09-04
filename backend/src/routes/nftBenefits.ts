import express from 'express';
import db from '../database';
import { fetchNftsFromCollection } from '../services/reservoirService';

const router = express.Router();

router.get('/nfts-with-benefits/:collectionAddress', async (req, res) => {
  const { collectionAddress } = req.params;

  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

  try {
    const nfts = await fetchNftsFromCollection(collectionAddress, limit);

    const query = `SELECT * FROM nft_benefits WHERE contract_address = ?`;

    db.query(query, [collectionAddress], (err, benefits) => {
      if (err) {
        console.error('Error fetching NFT benefits:', err.message);
        return res.status(500).send('Error fetching NFT benefits');
      }

      const combinedData = nfts.map((nft: any) => ({
        ...nft,
        benefits: benefits // All benefits associated with the collection
      }));

      res.json(combinedData);
    });
  } catch (error: any) {
    console.error('Error fetching NFTs and benefits:', error.message);
    res.status(500).send('Error fetching NFTs and benefits');
  }
});

export default router;
