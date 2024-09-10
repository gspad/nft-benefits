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
const database_1 = require("../database");
const reservoirService_1 = require("../services/reservoirService");
const router = express_1.default.Router();
router.get('/benefits', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collections = [
        '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e', // Doodles
    ];
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    try {
        const nftPromises = collections.map((collectionAddress) => (0, reservoirService_1.fetchNftsFromReservoir)(collectionAddress, limit));
        const nftResults = yield Promise.all(nftPromises);
        const nfts = nftResults.flat(1);
        const placeholders = collections.map(() => '?').join(',');
        const sql = `SELECT * FROM collection_benefits WHERE contract_address IN (${placeholders})`;
        const results = yield (0, database_1.query)(sql, collections);
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
            rarity: nft.token.rarity,
            rarityRank: nft.token.rarityRank,
            image: nft.token.image,
            benefits: benefits.filter((benefit) => benefit.contract_address === nft.token.contract),
        }));
        res.json(combinedData);
    }
    catch (error) {
        console.error('Error fetching NFTs and benefits:', error.message);
        res.status(500).send('Error fetching NFTs and benefits');
    }
}));
exports.default = router;
