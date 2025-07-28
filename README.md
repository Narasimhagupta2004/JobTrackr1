JobTrackr


A full-stack job application tracking platform that helps users manage job applications, track statuses, upload resumes & job descriptions, and gain insights into their application process.

🌐 Live Demo
🔗 JobTrackr on Render

(Best viewed on desktop for full functionality)

🚀 Features
User Authentication

JWT-based secure login & registration.

Protected routes for authenticated users only.

Job Management

Add, edit, and delete job applications.

Track job status: Applied, Interview, Rejected, or Offer.

Upload Resume & Job Description (JD) PDFs.

Dashboard & Analytics

View all job applications in a clean dashboard.

Status-based filtering & statistics.

Profile Management

View user details from JWT.

🛠 Tech Stack
Frontend:

React.js

Material UI

React Router DOM

Axios

Backend:

Node.js

Express.js

MongoDB (Mongoose)

Multer (for file uploads)

JWT (for authentication)

📂 Project Structure
bash
Copy
Edit
JobTrackr/
│── backend/
│   ├── controllers/      # Business logic (auth, jobs)
│   ├── models/           # Mongoose schemas
|   |--services/          # Email service
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & upload middleware
│   └── server.js         # App entry point
│
│── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, ProtectedRoute, etc.
│   │   ├── pages/        # Login, Register, Dashboard, JobForm, Profile
│   │   ├── App.jsx       # Routes
│   │   └── main.jsx      # Entry point
│   └── vite.config.js
│
└── README.md
⚡ Getting Started
1️⃣ Clone the repository
bash
Copy
Edit
git clone https://github.com/yourusername/jobtrackr.git
cd jobtrackr
2️⃣ Backend Setup
bash
Copy
Edit
cd backend
npm install
Create .env file in backend:

ini
Copy
Edit
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
Run backend:

bash
Copy
Edit
npm start
3️⃣ Frontend Setup
bash
Copy
Edit
cd frontend
npm install
Run frontend:

bash
Copy
Edit
npm run dev
🌐 API Endpoints
Auth
Method	Endpoint	Description
POST	/api/auth/register	Register a user
POST	/api/auth/login	Login a user

Jobs (Protected)
Method	Endpoint	Description
POST	/api/jobs	Create job application
GET	/api/jobs	Get all jobs
GET	/api/jobs/:id	Get single job
PUT	/api/jobs/:id	Update job
DELETE	/api/jobs/:id	Delete job

📸 Screenshots (Optional)
(Add screenshots of Dashboard, Add Job, and Profile for GitHub/placements appeal)

💡 Future Enhancements
Resume keyword suggestions based on Job Description.

Email reminders for upcoming deadlines.

Analytics with charts (success rate, application sources).

Cloud storage for resumes & job descriptions.

📜 License
This project is licensed under the MIT License.

