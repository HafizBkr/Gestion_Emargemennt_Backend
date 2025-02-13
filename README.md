# Faculty Attendance System

A digital attendance management system designed for universities, allowing professors to sign in/out and administrators to track teaching hours.

## 🎯 Features

### Professor Dashboard
- Real-time attendance tracking
- Personal schedule view (daily/weekly)
- Teaching hours counter
- Course history
- Generated attendance documents
- Pending notifications
- Personal statistics (hours per subject, per period)

### Admin Dashboard
- Global view of ongoing courses
- Real-time attendance status
- Professor status monitoring (teaching, finished, absent)
- Alerts for delays or missing attendance
- Administrative management tools
- Statistical reports and exports

## 🛠 Technical Stack

### Backend
- Language: Go
- Database: PostgreSQL
- Authentication: JWT
- API: RESTful architecture

### Frontend
- Framework: React
- UI Components: Shadcn/UI
- State Management: React Query
- Styling: TailwindCSS

## 📱 Key Features

### Attendance Management
- Digital sign-in/sign-out system
- Real-time hour tracking
- Automatic PDF generation
- WhatsApp notifications
- Geolocation verification (optional)

### Course Management
- Schedule creation and modification
- Room assignment
- Course type categorization (Lecture, Tutorial, Lab)
- Professor assignment
- Automatic hour calculation

### Notification System
- Course reminders (15 minutes before)
- Missing attendance alerts
- Weekly hour summaries
- Teaching quota alerts

## 🔐 Security Features
- Secure authentication
- Role-based access control
- Digital signatures
- Activity logging
- Data encryption

## 📊 Data Management
- Automated exports for payroll
- PDF attendance reports
- Statistical analysis
- Data backup system
- Excel/CSV exports

## 💻 API Endpoints

### Authentication
```
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
```

### Attendance
```
POST /api/v1/attendance/signin
POST /api/v1/attendance/signout
GET  /api/v1/attendance/history
```

### Courses
```
GET    /api/v1/courses/today
GET    /api/v1/courses/week
POST   /api/v1/courses
PUT    /api/v1/courses/{id}
DELETE /api/v1/courses/{id}
```

### Reports
```
GET /api/v1/reports/professor/{id}
GET /api/v1/reports/department
GET /api/v1/reports/export/pdf
GET /api/v1/reports/export/excel
```

## 📁 Project Structure

```
├── cmd/
│   └── server/
├── internal/
│   ├── models/
│   ├── handlers/
│   ├── services/
│   └── repositories/
├── pkg/
│   ├── notification/
│   ├── pdf/
│   └── whatsapp/
└── configs/
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Set up the database
5. Run migrations
6. Start the server

## 📝 Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=attendance_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
WHATSAPP_API_KEY=your_api_key

SERVER_PORT=8080
ENV=development
```

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE.md file for details
