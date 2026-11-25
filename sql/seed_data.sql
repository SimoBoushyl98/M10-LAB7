-- Données de test
USE lab_product;

INSERT INTO categories (name) VALUES ('Électronique'), ('Livres'), ('Vêtements');

INSERT INTO products (name, price, category_id) VALUES
('Smartphone', 699.99, 1),
('Roman', 14.99, 2),
('T-shirt', 19.99, 3);

-- Compte ADMIN créé directement en SQL (étape 18) : on ne peut pas s'inscrire en ADMIN via l'API.
-- Mot de passe : Admin@123 (hash bcrypt généré avec bcrypt.hash('Admin@123', 10))
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@test.com', '$2b$10$YolCpt8O9i3Ygfi1DnecSeAHXtdi3RK/.kSqUEyLolNS76OY3IMdq', 'ADMIN');
