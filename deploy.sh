#!/bin/bash

# Configuración de colores para los mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Preparando el frontend para socialrankbolivia.com/noticias...${NC}"

# 1. Instalar dependencias
echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
npm install

# 2. Construir la aplicación
echo -e "${YELLOW}🔨 Construyendo la aplicación...${NC}"
npm run build

# 3. Crear la estructura de carpetas para producción
echo -e "${YELLOW}📋 Preparando archivos para producción...${NC}"
rm -rf dist
mkdir -p dist/noticias

# 4. Copiar archivos construidos
cp -r out/* dist/noticias/

# 5. Crear archivo .htaccess
echo -e "${YELLOW}📝 Creando archivo .htaccess...${NC}"
cat > dist/noticias/.htaccess << EOL
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /noticias/
    
    # Si el archivo o directorio existe, úsalo directamente
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    
    # Para todas las rutas, redirige a index.html
    RewriteRule . index.html [L]
</IfModule>

# Habilitar CORS
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>

# Comprimir archivos
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Caché del navegador
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType text/x-javascript "access plus 1 month"
    ExpiresByType application/x-shockwave-flash "access plus 1 month"
    ExpiresByType image/x-icon "access plus 1 year"
    ExpiresDefault "access plus 2 days"
</IfModule>

# Prevenir listado de directorios
Options -Indexes

# Forzar HTTPS
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
EOL

echo -e "${GREEN}✅ Frontend preparado para producción${NC}"
echo -e "${YELLOW}📂 Los archivos para subir están en la carpeta 'dist/noticias'${NC}"
echo -e "${YELLOW}ℹ️  Recuerda:${NC}"
echo -e "1. Subir el contenido de 'dist/noticias' a la carpeta 'public_html/noticias' en el servidor"
echo -e "2. Verificar que la URL https://socialrankbolivia.com/noticias funciona correctamente"
