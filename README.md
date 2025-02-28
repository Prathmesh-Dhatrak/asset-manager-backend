# Asset Manager Backend

<p align='center'>
  <img src='public/favicon.svg' alt='Asset Manager Backend' width='120'/>
</p>

<p align='center'>
A Node.js backend for an asset management system with user authentication
</p>

<p align='center'>
  <strong>Frontend Repository:</strong> <a href="https://github.com/Prathmesh-Dhatrak/asset-management-system">https://github.com/Prathmesh-Dhatrak/asset-management-system</a><br>
  <strong>Backend Repository:</strong> <a href="https://github.com/Prathmesh-Dhatrak/asset-manager-backend">https://github.com/Prathmesh-Dhatrak/asset-manager-backend</a>
</p>

## Features

- User authentication (register, login, get current user)
- Asset management (create, read, update, delete)
- Asset filtering, searching, and sorting
- JSON file-based storage
- JWT authentication
- Input validation

## Tech Stack

- Node.js & Express
- TypeScript
- JWT for authentication
- File-based storage (JSON)
- API endpoints for frontend integration

## Project Structure

```
src/
├── config/         # Application configuration
├── controllers/    # Request handlers
├── data/           # JSON data storage
├── middleware/     # Express middleware
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── app.ts          # Express application setup
└── server.ts       # Server entry point
```

## Prerequisites

- Node.js (>=18)
- Yarn or npm

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/Prathmesh-Dhatrak/asset-manager-backend.git
cd asset-manager-backend
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=24h
NODE_ENV=development
```

4. Start the development server:

```bash
yarn dev
```

5. Build for production:

```bash
yarn build
```

6. Start the production server:

```bash
yarn start
```

## API Endpoints

### Authentication

| Method | Endpoint              | Description        | Request Body          | Response               |
|--------|----------------------|--------------------|----------------------|------------------------|
| POST   | /api/auth/register   | Create new user    | CreateUserDTO        | AuthResponse           |
| POST   | /api/auth/login      | Authenticate user  | LoginDTO             | AuthResponse           |
| GET    | /api/auth/me         | Get current user   | -                    | UserDTO                |

### Asset Management

| Method | Endpoint             | Description         | Request Body         | Response               |
|--------|---------------------|--------------------|--------------------|------------------------|
| GET    | /api/assets          | Get all user assets | Query params       | Asset[]                |
| GET    | /api/assets/:id      | Get asset by ID    | -                  | Asset                  |
| POST   | /api/assets          | Create new asset   | CreateAssetDTO     | Asset                  |
| PUT    | /api/assets/:id      | Update asset       | UpdateAssetDTO     | Asset                  |
| DELETE | /api/assets/:id      | Delete asset       | -                  | { success: true }      |

## Authentication

All endpoints except `/api/auth/register` and `/api/auth/login` require authentication.

To authenticate, include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Data Models

### User

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  password: string; // Hashed password
  createdAt: Date;
  updatedAt: Date;
}
```

### Asset

```typescript
interface Asset {
  id: string;
  userId: string;
  name: string;
  type: 'real_estate' | 'stock' | 'cryptocurrency' | 'vehicle' | 'other';
  value: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Deployment

This backend application can be deployed on platforms like Render, Heroku, or any other service that supports Node.js applications.

Make sure to set the following environment variables on your deployment platform:
- `PORT`
- `JWT_SECRET`
- `JWT_EXPIRATION`
- `NODE_ENV`

MIT

## Author

Prathmesh Dhatrak - [prathmesh101dhatrak@gmail.com](mailto:prathmesh101dhatrak@gmail.com)