import { useEffect, useState } from 'react';
import axios from 'axios';

interface Nft {
  contract: string;
  tokenId: string;
  name: string;
  image: string;
  description: string;
  benefits?: NftBenefit[];
}

interface NftBenefit {
  id: number;
  short_title: string;
  long_title: string;
  short_description: string;
  long_description: string;
  thumbnail: string;
  contract_address: string;
  token_id: string | null; // Nullable to support collection-wide benefits
  valid_from: string;
  valid_to: string;
  url: string;
  action_date: string;
}

const NftCollectionPage = () => {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNftsWithBenefits = async () => {
      try {
        setLoading(true);

        const collectionAddress = '0xBC4CA0EdA7647A8ab7c2061c2e118A18a936f13D'; 

        const response = await axios.get(
          `http://localhost:3001/api/nfts-with-benefits-by-collection/${collectionAddress}?limit=5`
        );

        setNfts(response.data);
      } catch (err) {
        console.error('Error fetching NFTs with benefits:', err);
        setError('Failed to load NFTs with benefits');
      } finally {
        setLoading(false);
      }
    };

    loadNftsWithBenefits();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>NFT Collection with Benefits</h1>
      {nfts.length === 0 ? (
        <p>No NFTs available in this collection.</p>
      ) : (
        <ul>
          {nfts.map((nft) => (
            <li key={nft.tokenId}>
              <h2>{nft.name}</h2>
              <img src={nft.image} alt={nft.name} />
              <p>{nft.description}</p>
              {nft.benefits && nft.benefits.length > 0 && (
                <div>
                  <h3>Benefits:</h3>
                  <ul>
                    {nft.benefits.map((benefit) => (
                      <li key={benefit.id}>
                        <h4>{benefit.short_title}</h4>
                        <p>{benefit.short_description}</p>
                        <img src={benefit.thumbnail} alt={benefit.short_title} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NftCollectionPage;
