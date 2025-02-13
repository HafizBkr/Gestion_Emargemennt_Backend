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
