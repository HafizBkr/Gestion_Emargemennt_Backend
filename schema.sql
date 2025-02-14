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
