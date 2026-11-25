-- Création de la base et des tables (LAB 6 + table users du LAB 7)
DROP DATABASE IF EXISTS lab_product;
CREATE DATABASE lab_product CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lab_product;

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category_id INT,
  CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- LAB 7 : utilisateurs (étape 6)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('USER', 'ADMIN') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LAB 7, exercice 3 : journal des tentatives de connexion échouées
CREATE TABLE login_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100),
  ip VARCHAR(45),
  reason VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
