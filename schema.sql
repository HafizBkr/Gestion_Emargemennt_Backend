CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  

CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE admins ADD COLUMN role character varying(50) NOT NULL DEFAULT 'admin';


--Table Professeur 
CREATE TABLE professeurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),        -- Identifiant unique pour chaque professeur
    nom VARCHAR(100) NOT NULL,                            -- Nom du professeur
    email VARCHAR(100) UNIQUE NOT NULL,                   -- Adresse email, unique pour chaque professeur
    telephone VARCHAR(20),                                -- Numéro de téléphone du professeur
    titre VARCHAR(50) NOT NULL CHECK (titre IN ('Master', 'Doctorat', 'Ingénieur', 'Professeur')),  -- Titre académique
    role VARCHAR(20) DEFAULT 'normal' CHECK (role IN ('normal', 'responsable')),  -- Rôle (normal ou responsable)
    actif BOOLEAN DEFAULT TRUE,                           -- Statut actif/inactif du professeur
    date_creation TIMESTAMP DEFAULT NOW(),                -- Date de création du compte
    date_mise_a_jour TIMESTAMP DEFAULT NOW(),             -- Date de mise à jour du compte (sera mis à jour lors de la modification)
    mot_de_passe VARCHAR(255) NOT NULL,                   -- Mot de passe du professeur
    mot_de_passe_change BOOLEAN DEFAULT FALSE             -- Indicateur pour savoir si le mot de passe a été modifié
);


CREATE TABLE IF NOT EXISTS departements (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            nom VARCHAR(100) NOT NULL,
            code VARCHAR(50) UNIQUE NOT NULL,
            responsable_id UUID REFERENCES professeurs(id) ON DELETE SET NULL,
            actif BOOLEAN DEFAULT true,
            date_creation TIMESTAMP DEFAULT NOW(),
            date_mise_a_jour TIMESTAMP DEFAULT NOW()
        );


        -- Table des domaines
CREATE TABLE domaines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- Identifiant unique du domaine
    nom VARCHAR(100) UNIQUE NOT NULL               -- Nom du domaine (ex: Mathématiques, Informatique, etc.)
);

-- Table d'association entre professeurs et domaines (relation many-to-many)
CREATE TABLE professeur_domaine (
    professeur_id UUID NOT NULL,
    domaine_id UUID NOT NULL,
    PRIMARY KEY (professeur_id, domaine_id),
    FOREIGN KEY (professeur_id) REFERENCES professeurs(id) ON DELETE CASCADE,
    FOREIGN KEY (domaine_id) REFERENCES domaines(id) ON DELETE CASCADE
);


CREATE TABLE filieres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    departement_id UUID REFERENCES public.departements(id) ON DELETE CASCADE,
    actif BOOLEAN DEFAULT TRUE, -- Champ pour activer ou désactiver la filière
    date_creation TIMESTAMP DEFAULT NOW(),
    date_mise_a_jour TIMESTAMP DEFAULT NOW()
);


CREATE TABLE niveaux (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(50),
    description TEXT,
    filiere_id UUID REFERENCES filieres(id) ON DELETE CASCADE
);

-- Spécialités
CREATE TABLE specialites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(100),
    description TEXT,
    niveau_id UUID REFERENCES niveaux(id) ON DELETE CASCADE
);

CREATE TABLE programmes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    specialite_id UUID NOT NULL,
    matiere VARCHAR(255) NOT NULL,
    code_matiere VARCHAR(50) UNIQUE NOT NULL,
    nombre_credits INT CHECK (nombre_credits > 0),
    volume_horaire INT CHECK (volume_horaire > 0),
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (specialite_id) REFERENCES specialites(id) ON DELETE CASCADE
);


CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_programmes_timestamp
BEFORE UPDATE ON programmes
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();


CREATE TABLE salles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(100) NOT NULL UNIQUE,
    capacite INT CHECK (capacite > 0),
    equipements TEXT, -- Liste des équipements sous forme de texte (ex: "projecteur, tableau, climatisation")
    disponible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
