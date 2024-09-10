# NFT Benefits Project

This project is a full-stack application that displays NFT benefits. It consists of a frontend built with Next.js and a backend built with Express.js and TypeScript. The backend connects to a MySQL database to fetch and insert NFT benefits.

This project is deployed on Platform.sh and can be accessed at https://main-bvxea6i-bko4llqsldvs2.ch-1.platformsh.site.

## Getting Started

### Prerequisites

- Node.js (>= 20.15.0)
- MySQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/nft-benefits.git
   cd nft-benefits
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Set up environment variables. Create a `.env` file in the root directory of `backend` and add the following variables:

   **Backend `.env`**:
   ```env
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   DB_PORT=your_db_port
   RESERVOIR_API_KEY=your_reservoir_api_key
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open [http://localhost:3002] in your browser to see the application.

### Database Setup

   ```bash
   cd backend/scripts
   node init.js
   ```

## Project Structure

### Frontend

- **Next.js** project located in the `frontend` directory.
- Main entry point: `frontend/src/app/page.tsx`
- Global styles: `frontend/src/app/globals.css`

### Backend

- **Express.js** server located in the `backend` directory.
- Main entry point: `backend/src/index.ts`
- Routes: `backend/src/routes/nftBenefits.ts`
- Database connection: `backend/src/database.ts`
- Scripts for database setup: `backend/scripts/createBenefitsTable.js`, `backend/scripts/insertBenefits.js`

## Learn More

To learn more about Next.js and Express.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Express.js Documentation](https://expressjs.com/) - learn about Express.js features and API.

## License

This project is licensed under the MIT License.