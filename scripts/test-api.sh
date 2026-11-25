#!/usr/bin/env bash
# Tests de l'authentification et de l'autorisation avec curl (étapes 18 et 19)
# Avant : base réinitialisée (sql/create_database.sql + sql/seed_data.sql) et serveur lancé (npm run dev)

API=http://localhost:3000/api
JSON="Content-Type: application/json"

test_api() {
  echo
  echo "=== $1"
  echo "\$ curl $2"
  eval curl -s -o /tmp/resp.json -w "'%{http_code}'" $2 > /tmp/code.txt
  cat /tmp/resp.json; echo
  echo "HTTP $(cat /tmp/code.txt)"
}

# récupère le champ "token" de la dernière réponse
get_token() { sed -E 's/.*"token":"([^"]+)".*/\1/' /tmp/resp.json; }

echo "########## 1. Inscription et connexion"
test_api "1. Inscription de alice" "-X POST $API/auth/register -H '$JSON' -d '{\"username\":\"alice\",\"email\":\"alice@test.com\",\"password\":\"alice123\"}'"
test_api "2. Inscription en double (409)" "-X POST $API/auth/register -H '$JSON' -d '{\"username\":\"alice\",\"email\":\"alice@test.com\",\"password\":\"alice123\"}'"
test_api "3. Inscription invalide (400)" "-X POST $API/auth/register -H '$JSON' -d '{\"username\":\"al\",\"email\":\"pas-un-email\",\"password\":\"123\"}'"
test_api "4. Login avec un mauvais mot de passe (401)" "-X POST $API/auth/login -H '$JSON' -d '{\"email\":\"alice@test.com\",\"password\":\"faux\"}'"
test_api "5. Login de alice (USER)" "-X POST $API/auth/login -H '$JSON' -d '{\"email\":\"alice@test.com\",\"password\":\"alice123\"}'"
USER_TOKEN=$(get_token)
test_api "6. Login de admin (ADMIN, créé en SQL)" "-X POST $API/auth/login -H '$JSON' -d '{\"email\":\"admin@test.com\",\"password\":\"Admin@123\"}'"
ADMIN_TOKEN=$(get_token)
test_api "7. Profil de alice (GET /me)" "$API/auth/me -H \"Authorization: Bearer \$USER_TOKEN\""

echo; echo "########## 2. Protection des routes produits"
FAKE_TOKEN="${USER_TOKEN%?}x"
test_api "8. Produits sans token (401)" "$API/products"
test_api "9. Produits avec un token modifié (401)" "$API/products -H \"Authorization: Bearer \$FAKE_TOKEN\""
test_api "10. USER lit les produits (200)" "$API/products -H \"Authorization: Bearer \$USER_TOKEN\""
test_api "11. USER crée un produit (403)" "-X POST $API/products -H '$JSON' -H \"Authorization: Bearer \$USER_TOKEN\" -d '{\"name\":\"Casque audio\",\"price\":59.99,\"category_id\":1}'"
test_api "12. ADMIN crée un produit (201)" "-X POST $API/products -H '$JSON' -H \"Authorization: Bearer \$ADMIN_TOKEN\" -d '{\"name\":\"Casque audio\",\"price\":59.99,\"category_id\":1}'"
test_api "13. ADMIN modifie le produit (200)" "-X PUT $API/products/4 -H '$JSON' -H \"Authorization: Bearer \$ADMIN_TOKEN\" -d '{\"name\":\"Casque audio Pro\",\"price\":79.99,\"category_id\":1}'"
test_api "14. USER supprime un produit (403)" "-X DELETE $API/products/4 -H \"Authorization: Bearer \$USER_TOKEN\""
test_api "15. ADMIN supprime le produit (204)" "-X DELETE $API/products/4 -H \"Authorization: Bearer \$ADMIN_TOKEN\""
test_api "16. USER crée une catégorie (403)" "-X POST $API/categories -H '$JSON' -H \"Authorization: Bearer \$USER_TOKEN\" -d '{\"name\":\"Sport\"}'"
test_api "17. USER fait une recherche (200)" "'$API/products/search?maxPrice=100&sort=price' -H \"Authorization: Bearer \$USER_TOKEN\""

echo; echo "########## 3. Exercices"
sleep 1   # pour que le nouveau token ait une date (iat) différente
test_api "18. Ex 1 : refresh du token de alice (200)" "-X POST $API/auth/refresh -H \"Authorization: Bearer \$USER_TOKEN\""
NEW_TOKEN=$(get_token)
test_api "19. Le nouveau token fonctionne (200)" "$API/auth/me -H \"Authorization: Bearer \$NEW_TOKEN\""
test_api "20. Ex 3 : USER lit le journal des logins (403)" "$API/auth/login-logs -H \"Authorization: Bearer \$USER_TOKEN\""
test_api "21. Ex 3 : ADMIN lit le journal des logins (200)" "$API/auth/login-logs -H \"Authorization: Bearer \$ADMIN_TOKEN\""
test_api "22. Inscription de bob" "-X POST $API/auth/register -H '$JSON' -d '{\"username\":\"bob\",\"email\":\"bob@test.com\",\"password\":\"bob12345\"}'"
test_api "23. Login de bob" "-X POST $API/auth/login -H '$JSON' -d '{\"email\":\"bob@test.com\",\"password\":\"bob12345\"}'"
BOB_TOKEN=$(get_token)
test_api "24. Ex 2 : bob supprime son compte (204)" "-X DELETE $API/auth/me -H \"Authorization: Bearer \$BOB_TOKEN\""
test_api "25. Le token de bob ne marche plus (401)" "$API/products -H \"Authorization: Bearer \$BOB_TOKEN\""
