"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './HomePage.module.scss';

type Nft = {
  tokenId: string;
  name: string;
  description: string;
  rarity: string;
  rarityRank: string;
  image: string;
  benefits?: CollectionBenefit[];
};

type CollectionBenefit = {
  id: number;
  contract_address: string;
  token_id: string;
  short_title: string;
  long_title: string;
  short_description: string;
  long_description: string;
  thumbnail: string;
  valid_from: string;
  valid_to: string;
  url: string;
  action_date: string;
};

const HomePage: React.FC = () => {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNftData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/benefits?limit=5', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });

        setNfts(response.data);
      } catch (err) {
        console.error('Error fetching NFTs with benefits:', err);
        setError('Failed to load NFT data.');
      } finally {
        setLoading(false);
      }
    };

    fetchNftData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Benefits</h1>
      {nfts.length === 0 ? (
        <p>No NFTs available.</p>
      ) : (
        <ul>
          {nfts.map((nft) => (
            <li key={nft.tokenId} className={styles.nftItem}>
              <div className={styles.nftDetails}>
                <h2>{nft.name}</h2>
                <p>{nft.description}</p>
                <br />
                <p>Rarity: {nft.rarity}</p> 
                <p>Rarity Rank: {nft.rarityRank}</p> 
              </div>
              <div className={styles.benefitContainer}>
                {nft.benefits && nft.benefits.length > 0 && (
                  <div>
                    <ul>
                      {nft.benefits.map((benefit) => (
                        <li key={benefit.id} className={styles.benefitItem}>
                          <div>
                            <h4>{benefit.short_title}</h4>
                            <p>{benefit.short_description}</p>
                          </div>
                          <img
                            src={nft.image ? nft.image : './images/bored-ape-thumbnail.png'}
                            className={styles.benefitThumbnail}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;
