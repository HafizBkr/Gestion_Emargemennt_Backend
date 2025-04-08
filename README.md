# Faculty Attendance System

A comprehensive digital attendance management system for universities, allowing professors to sign in/out and administrators to track teaching hours accurately.

##  Project Overview

The Faculty Attendance System is a modern solution designed to replace traditional paper-based attendance tracking in academic institutions. The system streamlines the process of recording professor attendance, managing teaching schedules, and generating reports for administrative purposes.

##  System Architecture

This project uses a Node.js/Express.js backend with a PostgreSQL database. The architecture follows a standard MVC pattern with clear separation of concerns:

```
├── app.js                  # Express application setup
├── config/                 # Configuration files
├── controllers/            # Business logic handlers
├── middlewares/            # Authentication and validation middleware
├── models/                 # Data models
├── routes/                 # API endpoints
├── services/               # External services integration
├── validators/             # Input validation
└── server.js               # Entry point
```

##  Data Models

The system is built around the following core data models:

- **Admin**: System administrators with full access rights
- **Professeur**: Faculty members who use the system to record attendance
- **Departement**: Academic departments that organize professors and courses
- **Domain**: Fields of study
- **Fillieres**: Specific educational programs
- **Niveau**: Educational levels (L1, L2, L3, M1, M2)
- **Specialite**: Academic specializations
- **Programes**: Course schedules
- **Seance**: Individual teaching sessions
- **Salles**: Classrooms and lecture halls
- **Emargement**: Attendance records
- **Annee**: Academic years

##  Authentication & Authorization

The system implements JWT-based authentication with two distinct roles:

1. **Administrators**: Full access to all system features including reporting, management, and configuration
2. **Professors**: Limited access to personal attendance records, schedules, and session management

##  Key Features

### For Professors
- Digital sign-in and sign-out for teaching sessions
- Personal dashboard with upcoming schedule
- History of teaching sessions and hours
- Automatic calculations of teaching load
- Notifications for upcoming sessions

### For Administrators
- Comprehensive management of academic entities
- Real-time monitoring of professor attendance
- Customizable reports and statistics
- User management and access control
- Academic year and semester configuration

##  API Endpoints

Pour une documentation complète des endpoints API, veuillez consulter les fichiers dans le dossier `/routes`. Chaque fichier correspond à une ressource spécifique du système:

- `admin.routes.js` - Gestion des administrateurs
- `anees.routes.js` - Gestion des années académiques
- `departement.routes.js` - Gestion des départements
- `domain.routes.js` - Gestion des domaines d'études
- `emmargement.routes.js` - Gestion des émargements
- `fillieres.routes.js` - Gestion des filières
- `niveau.routes.js` - Gestion des niveaux d'études
- `professeur.routes.js` - Gestion des professeurs
- `programes.routes.js` - Gestion des programmes
- `salles.routes.js` - Gestion des salles
- `seance.routes.js` - Gestion des séances
- `specialite.routres.js` - Gestion des spécialités

Voici quelques exemples d'endpoints principaux:

### Authentication
- `POST /api/auth/login` - Authentifier les utilisateurs
- `POST /api/auth/logout` - Terminer la session utilisateur

### Gestion des émargements
- `POST /api/emargement/signin` - Enregistrer le début d'une séance
- `PUT /api/emargement/signout/:id` - Enregistrer la fin d'une séance
- `GET /api/emargement/professeur/:id` - Obtenir l'historique des présences d'un professeur
- `GET /api/emargement/export` - Exporter les données d'émargement

##  Technical Implementation

### Backend Technologies
- **Node.js & Express.js**: Server-side application framework
- **PostgreSQL**: Relational database management system
- **JSON Web Tokens**: Secure authentication
- **Bcrypt**: Password hashing
- **Sequelize**: ORM for database interaction

### Integration Services
- Email notifications via Gmail
- WhatsApp notifications via Twilio API

##  Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Configure environment variables based on `.env.sample`
4. Initialize the database using `schema.sql`
5. Generate admin user with `node generate-admin-hash.js`
6. Start the server with `npm start`

##  Environment Configuration

Create a `.env` file based on the provided `.env.sample`:

```
DB_USER=postgres
DB_PASSWORD=hafiz
DB_HOST=localhost
DB_PORT=5432
DB_NAME=emargement
DB_SSLMODE=disable
PORT=3000
JWT_SECRET=JKDSCNKSDJNLKASSJHDHJSAKJNC

GMAIL_USER=
GMAIL_PASS=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=
```

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

