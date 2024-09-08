"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const database_1 = __importDefault(require("../database"));
const router = express_1.default.Router();
const RESERVOIR_API_BASE_URL = 'https://api.reservoir.tools';
const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY;
const fetchNftsFromReservoir = (collectionAddress_1, ...args_1) => __awaiter(void 0, [collectionAddress_1, ...args_1], void 0, function* (collectionAddress, limit = 5) {
    try {
        const response = yield axios_1.default.get(`${RESERVOIR_API_BASE_URL}/tokens/v5`, {
            headers: {
                'x-api-key': RESERVOIR_API_KEY,
            },
            params: {
                collection: collectionAddress,
                limit: limit.toString(),
            },
        });
        return response.data.tokens;
    }
    catch (error) {
        console.error('Error fetching NFTs from Reservoir:', error.message);
        throw new Error('Failed to fetch NFTs from Reservoir');
    }
});
router.get('/benefits', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collections = [
        '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e', // Doodles
    ];
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    try {
        const nftPromises = collections.map((collectionAddress) => fetchNftsFromReservoir(collectionAddress, limit));
        const nftResults = yield Promise.all(nftPromises);
        const nfts = nftResults.flat(1);
        const placeholders = collections.map(() => '?').join(',');
        const query = `SELECT * FROM collection_benefits WHERE contract_address IN (${placeholders})`;
        database_1.default.query(query, collections, (err, results) => {
            if (err) {
                console.error('Error fetching collection benefits:', err.message);
                return res.status(500).send('Error fetching collection benefits');
            }
            if (!Array.isArray(results)) {
                console.error('Invalid results format:', results);
                return res.status(500).send('Invalid results format');
            }
            const benefits = results.map((result) => ({
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
                image: nft.token.image || '/path/to/default-image.png',
                benefits: benefits.filter((benefit) => benefit.contract_address === nft.token.contract),
            }));
            res.json(combinedData);
        });
    }
    catch (error) {
        console.error('Error fetching NFTs and benefits:', error.message);
        res.status(500).send('Error fetching NFTs and benefits');
    }
}));
exports.default = router;
