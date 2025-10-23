# 🎬 Strapi Cineverse

![App Screenshot](./docs/screenshot.png)  
*React front-end connected to Strapi API*  

## 📖 About the project
**Strapi Cinema** is a full-stack application to manage and browse movie-related content (films, directors, actors).  
It combines a **Strapi headless CMS backend** with a **React front-end** to centralize, manage, and expose data from **The Movie Database (TMDb)** or manually created entries.

---

## 🚀 Features

### 🖥️ Front-end (React)
- 🔐 Secure login with authentication (JWT)
- 🔍 Dynamic search bar (movies, actors, directors)
- 🎞️ Detailed pages for:
  - Movies (title, description, release date, trailer, cast, etc.)
  - Actors & Directors (bio, filmography, key information)
- ▶️ Integrated trailers
- 📱 Responsive UI (desktop, tablet, mobile)
- ⚡ Real-time API consumption from Strapi (REST)

### 🛠️ Back-end (Strapi)
- 📦 Headless API secured with token-based authentication
- 🗃️ Data models: **Movie, Actor, Director**
- 🔗 Relations:  
  - A movie → one director  
  - A movie → multiple actors
- 🌍 Automatic import from **TMDb** via a custom button in Strapi Admin
- ✍️ Manual creation (movies, actors, directors) via admin interface
- 🛡️ Roles & permissions management

### ✨ Work in progress
- ⭐ **Favorites management** (save movies/actors to a personal list)

## ⚙️ Installation

### Requirements
- Node.js ≥ 18
- npm or yarn
- TMDb API key ([get it here](https://www.themoviedb.org/documentation/api))

### 1. Clone the repository
```bash
git clone https://github.com/your-org/strapi-cinema.git
cd strapi-cinema
```

### 2. Backend (Strapi)
```bash
cd backend
cp .env.example .env   # add your TMDb key + DB config
npm install
npm run develop
```
API available at `http://localhost:1337`.

### 3. Frontend (React)
```bash
cd frontend
cp .env.example .env   # configure Strapi API URL
npm install
npm start
```
App available at `http://localhost:3000`.

---

## 📂 Repository structure
```
.
├── src/          # Strapi project (API + admin)
├── frontend/         # React application
├── docs/             # Screenshots, personas
└── README.md
```

---

## 👥 Authors
- [@Alexis-NM](https://github.com/Alexis-NM)  
- [@AlineCoatanoan](https://github.com/AlineCoatanoan)  
- [@JulieNonnon](https://github.com/JulieNonnon)  
- [@tuirz](https://github.com/tuirz)  

---

## 📜 License
This project is released under the **MIT License**.  
