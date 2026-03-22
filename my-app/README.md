# SkillLoop Frontend

SkillLoop is a skill-sharing platform where users can offer skills (e.g. piano, coding, languages) and request exchanges with other users.

This repository contains the **React frontend**, which talks to the separate **Django REST API** backend.

---

## 🧱 Tech Stack

- **React** (Create React App)
- **React Router** for page navigation
- **Axios** for HTTP requests
- **Bootstrap** (via CDN or npm) for layout and basic styling
- Deployed on **Vercel**

Backend (separate repo):

- Django REST Framework
- dj-rest-auth + django-allauth for auth
- Deployed on Heroku (API)

---

## 🔗 API Integration

The app communicates with the SkillLoop API via a single base URL config.

Create this file:

**`src/api/config.js`**

```js
const API_BASE =
  process.env.REACT_APP_API_BASE ||
  'http://127.0.0.1:8000'; // Local dev fallback

export default API_BASE;

🚀 Running the Project Locally

1. Clone this repository

git clone <your-frontend-repo-url>
cd <your-frontend-folder>


2. Install dependencies

npm install

3. Create a .env file (optional but recommended)

In the project root:

REACT_APP_API_BASE=http://127.0.0.1:8000

4. Start the dev server

npm start

The app runs at:

http://localhost:3000

Make sure your Django API is running at http://127.0.0.1:8000

📄 Main Pages (MVP)

Planned pages:

1. Home – overview of SkillLoop, call-to-action to sign up / log in

2. Register – registration form that posts to /dj-rest-auth/registration/

3. Login – login form that posts to /dj-rest-auth/login/

4. Dashboard / My Skills – list skills for the logged-in user (future)

5. Browse Skills – view all available skills (future)

6. Skill Exchanges – view and create exchange requests (future)

7. Contact – contact form that posts to /api/contact/

🧪 Basic Flow (MVP)

1. User registers via the frontend (POST to /dj-rest-auth/registration/).

2. User logs in and receives a token (POST /dj-rest-auth/login/).

3. Token is stored in the browser (e.g. localStorage).

4. Authenticated requests (skills, exchanges) include:

Authorization: Token <user-token>

🌍 Deployment (Vercel)

1. Push this repo to GitHub.

2. In Vercel:

    - Import the repository

    - Set Environment variable:
        REACT_APP_API_BASE = https://your-backend-url

    - Deploy
    