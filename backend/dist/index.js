"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const nftBenefits_1 = __importDefault(require("./routes/nftBenefits"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = process.env.PORT || 3001;
app.use('/api', nftBenefits_1.default);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
