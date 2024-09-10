import express from 'express';
import cors from 'cors';
import nftRoutes from './routes/nftBenefits';

const app = express();
app.use(cors());
app.use(express.json()); 

const port = process.env.PORT || 3001;

app.use('/api', nftRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
