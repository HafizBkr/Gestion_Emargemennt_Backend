# Structure Backend - Système d'Émargement Universitaire

## 📁 Modèles de Données

### Département
```go
type Departement struct {
    ID              uuid.UUID
    Nom             string
    Code            string      // Code identifiant du département
    ResponsableID   uuid.UUID   // ID du chef de département
    Filieres        []Filiere   
    DateCreation    time.Time
    DateMiseAJour   time.Time
}
```

### Filière
```go
type Filiere struct {
    ID              uuid.UUID
    Nom             string
    Code            string      // Code de la filière
    DepartementID   uuid.UUID   
    Niveau          string      // L1, L2, L3, M1, M2...
    ResponsableID   uuid.UUID   // Responsable pédagogique
    Cours           []Cours    
    DateCreation    time.Time
    DateMiseAJour   time.Time
}
```

### Enseignant
```go
type Enseignant struct {
    ID              uuid.UUID
    Nom             string
    Prenom          string
    Email           string
    Telephone       string
    DepartementID   uuid.UUID
    Matieres        []Matiere
    DateCreation    time.Time
    DateMiseAJour   time.Time
}
```

### Matière
```go
type Matiere struct {
    ID              uuid.UUID
    Nom             string
    Code            string
    FiliereID       uuid.UUID
    EnseignantID    uuid.UUID
    Type            string      // CM, TD, TP
    VolumeHoraire   float64     
    Semestre        int
    DateCreation    time.Time
    DateMiseAJour   time.Time
}
```

### Séance
```go
type Seance struct {
    ID              uuid.UUID
    MatiereID       uuid.UUID
    EnseignantID    uuid.UUID
    SalleID         uuid.UUID
    HeureDebut      time.Time
    HeureFin        time.Time
    Type            string      // CM, TD, TP
    Statut          string      // Planifiée, En cours, Terminée, Annulée
    DateCreation    time.Time
    DateMiseAJour   time.Time
}
```

### Émargement
```go
type Emargement struct {
    ID              uuid.UUID
    SeanceID        uuid.UUID
    EnseignantID    uuid.UUID
    HeureSignature  time.Time
    HeureSortie     *time.Time
    DureeEffective  float64
    Localisation    *Localisation
    Statut          string      // Présent, Retard, Absent
    Commentaire     string
    DateCreation    time.Time
    DateMiseAJour   time.Time
}
```

## 🛠 Services

### Service d'Authentification
```go
type ServiceAuth interface {
    Connexion(email, motDePasse string) (*Token, error)
    Deconnexion(token string) error
    VerifierToken(token string) (*Claims, error)
    ChangerMotDePasse(userID uuid.UUID, ancienMDP, nouveauMDP string) error
}
```

### Service Enseignant
```go
type ServiceEnseignant interface {
    Creer(enseignant *Enseignant) error
    Modifier(enseignant *Enseignant) error
    Supprimer(id uuid.UUID) error
    ObtenirParID(id uuid.UUID) (*Enseignant, error)
    ObtenirTous() ([]Enseignant, error)
    ObtenirEmploisDuTemps(enseignantID uuid.UUID, date time.Time) ([]Seance, error)
}
```

### Service Émargement
```go
type ServiceEmargement interface {
    Signer(seanceID, enseignantID uuid.UUID, localisation *Localisation) error
    SignerSortie(seanceID, enseignantID uuid.UUID) error
    ObtenirStatistiques(enseignantID uuid.UUID) (*Statistiques, error)
    GenererRapport(enseignantID uuid.UUID, debut, fin time.Time) (*Rapport, error)
}
```

### Service Notification
```go
type ServiceNotification interface {
    EnvoyerWhatsApp(destinataire string, message string) error
    EnvoyerEmail(destinataire string, sujet string, corps string) error
    EnvoyerRappel(seanceID uuid.UUID) error
    NotifierAdmin(message string, niveau string) error
}
```

## 🗄️ Structure Base de Données

```sql
CREATE TABLE departements (
    id UUID PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    responsable_id UUID REFERENCES enseignants(id),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE filieres (
    id UUID PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    departement_id UUID REFERENCES departements(id),
    niveau VARCHAR(50) NOT NULL,
    responsable_id UUID REFERENCES enseignants(id),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE matieres (
    id UUID PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    filiere_id UUID REFERENCES filieres(id),
    enseignant_id UUID REFERENCES enseignants(id),
    type VARCHAR(50) NOT NULL,
    volume_horaire FLOAT NOT NULL,
    semestre INTEGER NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

# Schémas Complets de la Base de Données

## 👥 Gestion des Utilisateurs et Rôles

```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enseignants (
    id UUID PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(20),
    mot_de_passe VARCHAR(255) NOT NULL,
    role_id UUID REFERENCES roles(id),
    departement_id UUID REFERENCES departements(id),
    statut VARCHAR(50) DEFAULT 'actif',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enseignant_matieres (
    enseignant_id UUID REFERENCES enseignants(id),
    matiere_id UUID REFERENCES matieres(id),
    PRIMARY KEY (enseignant_id, matiere_id)
);
```

## 📚 Gestion des Séances

```sql
CREATE TABLE salles (
    id UUID PRIMARY KEY,
    numero VARCHAR(50) NOT NULL UNIQUE,
    capacite INTEGER,
    type VARCHAR(50),
    batiment VARCHAR(100),
    etage INTEGER,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE seances (
    id UUID PRIMARY KEY,
    matiere_id UUID REFERENCES matieres(id),
    enseignant_id UUID REFERENCES enseignants(id),
    salle_id UUID REFERENCES salles(id),
    date_seance DATE NOT NULL,
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    type VARCHAR(20) NOT NULL, -- CM, TD, TP
    statut VARCHAR(50) DEFAULT 'planifiee',
    commentaire TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_salle_creneau UNIQUE (salle_id, date_seance, heure_debut)
);
```

## ✍️ Gestion des Émargements

```sql
CREATE TABLE emargements (
    id UUID PRIMARY KEY,
    seance_id UUID REFERENCES seances(id),
    enseignant_id UUID REFERENCES enseignants(id),
    heure_signature TIMESTAMP NOT NULL,
    heure_sortie TIMESTAMP,
    duree_effective FLOAT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    statut VARCHAR(50) NOT NULL, -- Present, Retard, Absent
    signature_numerique TEXT,
    commentaire TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_emargement_seance UNIQUE (seance_id, enseignant_id)
);

CREATE TABLE motifs_absence (
    id UUID PRIMARY KEY,
    emargement_id UUID REFERENCES emargements(id),
    motif TEXT NOT NULL,
    justificatif_url TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📊 Gestion des Notifications

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    destinataire_id UUID REFERENCES enseignants(id),
    type VARCHAR(50) NOT NULL, -- email, whatsapp, système
    titre VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    statut VARCHAR(50) DEFAULT 'non_lu',
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_lecture TIMESTAMP
);

CREATE TABLE rappels_seance (
    id UUID PRIMARY KEY,
    seance_id UUID REFERENCES seances(id),
    delai_rappel INTEGER NOT NULL, -- minutes avant la séance
    type_notification VARCHAR(50) NOT NULL,
    statut VARCHAR(50) DEFAULT 'planifie',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📝 Tables de Journalisation

```sql
CREATE TABLE journal_modifications (
    id UUID PRIMARY KEY,
    table_concernee VARCHAR(50) NOT NULL,
    enregistrement_id UUID NOT NULL,
    utilisateur_id UUID REFERENCES enseignants(id),
    type_modification VARCHAR(50) NOT NULL, -- creation, modification, suppression
    anciennes_valeurs JSONB,
    nouvelles_valeurs JSONB,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE journal_connexions (
    id UUID PRIMARY KEY,
    enseignant_id UUID REFERENCES enseignants(id),
    date_connexion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    statut VARCHAR(50)
);
```

## 📈 Vues pour les Statistiques

```sql
CREATE VIEW vue_statistiques_presence AS
SELECT 
    e.id as enseignant_id,
    e.nom,
    e.prenom,
    COUNT(em.id) as total_seances,
    SUM(CASE WHEN em.statut = 'Present' THEN 1 ELSE 0 END) as seances_presentes,
    SUM(em.duree_effective) as total_heures_effectuees,
    AVG(CASE WHEN em.heure_signature > s.heure_debut 
        THEN EXTRACT(EPOCH FROM (em.heure_signature - s.heure_debut))/60 
        ELSE 0 END) as moyenne_retard_minutes
FROM enseignants e
LEFT JOIN emargements em ON e.id = em.enseignant_id
LEFT JOIN seances s ON em.seance_id = s.id
GROUP BY e.id, e.nom, e.prenom;

CREATE VIEW vue_occupation_salles AS
SELECT 
    s.id as salle_id,
    s.numero,
    date_trunc('month', se.date_seance) as mois,
    COUNT(se.id) as nombre_seances,
    SUM(EXTRACT(EPOCH FROM (se.heure_fin - se.heure_debut))/3600) as heures_occupation
FROM salles s
LEFT JOIN seances se ON s.id = se.salle_id
GROUP BY s.id, s.numero, date_trunc('month', se.date_seance);
```

## 🔑 Index Recommandés

```sql
-- Index pour optimiser les recherches fréquentes
CREATE INDEX idx_seances_date ON seances(date_seance);
CREATE INDEX idx_seances_enseignant ON seances(enseignant_id);
CREATE INDEX idx_emargements_seance ON emargements(seance_id);
CREATE INDEX idx_emargements_date ON emargements(heure_signature);
CREATE INDEX idx_notifications_destinataire ON notifications(destinataire_id, statut);
```

## 📱 Dépendances Principales

```go
// Dépendances principales
go get -u github.com/gin-gonic/gin            // Framework web
go get -u github.com/lib/pq                   // Driver PostgreSQL
go get -u github.com/golang-jwt/jwt/v4        // Gestion JWT
go get -u github.com/google/uuid              // Génération UUID
go get -u golang.org/x/crypto/bcrypt          // Hashage mots de passe

// Utilitaires
go get -u github.com/spf13/viper              // Configuration
go get -u github.com/rs/zerolog               // Logging
go get -u github.com/go-playground/validator  // Validation
```
