import express from 'express';
import axios from 'axios';
import db from '../database';
import type { Benefit } from '../types/benefit';
import { fetchNftsFromReservoir } from '../services/reservoirService';


const router = express.Router();

router.get('/benefits', async (req, res) => {
  const collections = [
    '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e', // Doodles
  ];
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

  try {
    const nftPromises = collections.map((collectionAddress) =>
      fetchNftsFromReservoir(collectionAddress, limit)
    );
    const nftResults = await Promise.all(nftPromises);

    const nfts = nftResults.flat(1);

    const placeholders = collections.map(() => '?').join(',');
    const query = `SELECT * FROM collection_benefits WHERE contract_address IN (${placeholders})`;
    
    db.query(query, collections, (err: any, results: any) => {
      if (err) {
        console.error('Error fetching collection benefits:', err.message);
        return res.status(500).send('Error fetching collection benefits');
        
      }

      if (!Array.isArray(results)) {
        console.error('Invalid results format:', results);
        return res.status(500).send('Invalid results format');
      }

      const benefits: Benefit[] = results.map((result: any) => ({
        _id: result._id,
        short_title: result.short_title,
        long_title: result.long_title,
        short_description: result.short_description,
        long_description: result.long_description,
        thumbnail: result.thumbnail,
        contract_address: result.contract_address,
        token_id: result.token_id,
        valid_from: result.valid_from,
        valid_to: result.valid_to,
        url: result.url,
        action_date: result.action_date,
      }));

      console.log('Benefits fetched:', benefits);

      // Combine NFTs with their associated benefits
      const combinedData = nfts.map((nft) => ({
        contract: nft.token.contract,
        tokenId: nft.token.tokenId,
        name: nft.token.name || 'Unknown NFT', 
        description: nft.token.description || 'No description available', 
        rarity: nft.token.rarity,
        rarityRank: nft.token.rarityRank,
        image: nft.token.image || '/path/to/default-image.png',
        benefits: benefits.filter(
          (benefit) => benefit.contract_address === nft.token.contract
        ),
      }));

      res.json(combinedData);
    });
  } catch (error: any) {
    console.error('Error fetching NFTs and benefits:', error.message);
    res.status(500).send('Error fetching NFTs and benefits');
  }
});

export default router;
