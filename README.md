# 📊 Sales Dashboard App

<div align="center">

  ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
  ![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

  <br/>

  A full-stack **Sales Management Dashboard** built with React + Vite on the frontend and Express + Node.js on the backend, backed by MongoDB Atlas.

  **[🚀 Live Demo](#)** · **[🐛 Report Bug](https://github.com/vercerry07/sales1/issues)** · **[✨ Request Feature](https://github.com/vercerry07/sales1/issues)**

</div>

---

## ✨ Features

| Module | Features |
|---|---|
| 🔐 **Authentication** | Register, Login, JWT-based session, Protected routes |
| 📦 **Products** | Add, edit, delete products with stock and pricing |
| 👥 **Customers** | Manage customer records and contact info |
| 🧾 **Sales** | Create sales orders, track status, admin-only delete |
| 📊 **Dashboard** | Overview stats, revenue charts, recent activity |
| 🛡️ **Security** | Helmet, CORS, Rate limiting, HPP protection |
| 🎨 **UI/UX** | Responsive design, dark theme, smooth transitions |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — UI library
- **Vite 8** — Lightning-fast build tool
- **Recharts** — Beautiful data visualization charts
- **Lucide React** — Icon library
- **Vanilla CSS** — Custom design system

### Backend
- **Node.js + Express 5** — REST API server
- **MongoDB + Mongoose 9** — Database and ODM
- **JWT (jsonwebtoken)** — Authentication tokens
- **bcryptjs** — Password hashing
- **Zod** — Request validation
- **Winston** — Logging
- **Helmet + CORS + HPP** — Security middleware

---

## 📁 Project Structure

```
salesapp/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/           # Login & Register modals
│   │   │   ├── Dashboard/      # Overview & stats
│   │   │   ├── Products/       # Product list & modal
│   │   │   ├── Customers/      # Customer list & modal
│   │   │   ├── Sales/          # Sales list & detail modal
│   │   │   └── Layout/         # Navbar
│   │   ├── context/            # Auth context (global state)
│   │   ├── services/           # API call abstractions
│   │   └── main.jsx
│   └── package.json
│
└── server/                     # Express + Node.js backend
    ├── src/
    │   ├── controllers/        # Route handler logic
    │   ├── models/             # Mongoose schemas
    │   ├── routes/             # API route definitions
    │   ├── middlewares/        # Auth, error handler
    │   ├── services/           # Business logic layer
    │   ├── config/             # DB connection
    │   └── utils/              # Helpers & seed data
    └── package.json
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Create a new account |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |
| `GET` | `/api/auth/me` | Protected | Get current user info |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/products` | Protected | List all products |
| `POST` | `/api/products` | Protected | Create a product |
| `PUT` | `/api/products/:id` | Protected | Update a product |
| `DELETE` | `/api/products/:id` | Protected | Delete a product |

### Customers
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/customers` | Protected | List all customers |
| `POST` | `/api/customers` | Protected | Add a customer |
| `PUT` | `/api/customers/:id` | Protected | Update a customer |
| `DELETE` | `/api/customers/:id` | Protected | Delete a customer |

### Sales
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/sales` | Protected | List all sales |
| `POST` | `/api/sales` | Protected | Create a sale |
| `GET` | `/api/sales/:id` | Protected | Get sale details |
| `PATCH` | `/api/sales/:id/status` | Protected | Update sale status |
| `DELETE` | `/api/sales/:id` | Admin only | Delete a sale |

### Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/dashboard` | Protected | Get stats and overview |

---

## ⚙️ Environment Variables

### Server (`server/.env`)
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/sales_dashboard
PORT=5000
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/vercerry07/sales1.git
cd sales1
```

### 2. Setup and run the backend
```bash
cd server
npm install
# Create a .env file with the variables listed above
npm run dev
# Server runs on http://localhost:5000
```

### 3. Setup and run the frontend
```bash
cd client
npm install
# Create a .env file with VITE_API_URL=http://localhost:5000/api
npm run dev
# App runs on http://localhost:5173
```

### 4. (Optional) Seed sample data
```bash
cd server
npm run seed
```

---

## ☁️ Deployment

This app is designed for free-tier cloud deployment:

| Service | Platform | Notes |
|---------|----------|-------|
| **Frontend** | [Vercel](https://vercel.com) | Set `VITE_API_URL` to your Render backend URL |
| **Backend** | [Render](https://render.com) | Root dir = `server`, start cmd = `npm start` |
| **Database** | [MongoDB Atlas](https://cloud.mongodb.com) | Free M0 tier (512MB) |

> **Note:** Render free tier spins down after 15 minutes of inactivity. First request after sleep may take ~30 seconds.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open a pull request or file an issue.

1. Fork the project
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

Distributed under the ISC License.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/vercerry07">vercerry07</a>
</div>
