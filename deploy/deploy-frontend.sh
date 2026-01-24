#!/bin/bash

# Script para desplegar el frontend
# Ejecutar desde el directorio del proyecto: bash deploy/deploy-frontend.sh
# Requiere que se pase la IP pública o dominio como argumento

set -e

PROJECT_DIR="/home/ec2-user/MentoriaLearn"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Obtener IP pública o dominio
if [ -z "$1" ]; then
    echo "Uso: bash deploy/deploy-frontend.sh <IP_PUBLICA_O_DOMINIO>"
    echo "Ejemplo: bash deploy/deploy-frontend.sh 54.123.45.67"
    exit 1
fi

SERVER_URL="$1"

echo "=========================================="
echo "Desplegando Frontend de MentoriaLearn"
echo "=========================================="
echo "URL del servidor: $SERVER_URL"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "$FRONTEND_DIR/package.json" ]; then
    echo "Error: No se encontró package.json en $FRONTEND_DIR"
    exit 1
fi

cd "$FRONTEND_DIR"

# Actualizar URL de la API
echo "Actualizando configuración de API..."
API_FILE="src/services/api.js"

if [ -f "$API_FILE" ]; then
    # Crear backup
    cp "$API_FILE" "$API_FILE.backup"
    
    # Actualizar URLs
    sed -i "s|http://localhost:8080|http://${SERVER_URL}:8080|g" "$API_FILE"
    
    echo "✓ URLs actualizadas en $API_FILE"
else
    echo "Advertencia: No se encontró $API_FILE"
fi

# Instalar dependencias
echo "Instalando dependencias..."
npm install

# Compilar para producción
echo "Compilando para producción..."
npm run build

# Verificar que el build se creó
if [ ! -d "build" ]; then
    echo "Error: No se pudo crear el directorio build"
    exit 1
fi

# Configurar Nginx
echo "Configurando Nginx..."
NGINX_CONF="/etc/nginx/conf.d/mentoria.conf"

sudo tee "$NGINX_CONF" > /dev/null << EOF
server {
    listen 80;
    server_name ${SERVER_URL};
    
    root ${FRONTEND_DIR}/build;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Proxy para el backend
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location /auth {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location /cursos {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location /inscripciones {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Verificar configuración de Nginx
echo "Verificando configuración de Nginx..."
if sudo nginx -t; then
    echo "✓ Configuración de Nginx válida"
else
    echo "✗ Error en la configuración de Nginx"
    exit 1
fi

# Reiniciar Nginx
echo "Reiniciando Nginx..."
sudo systemctl restart nginx

# Verificar estado
if sudo systemctl is-active --quiet nginx; then
    echo "✓ Frontend desplegado correctamente"
    echo ""
    echo "Tu aplicación está disponible en: http://${SERVER_URL}"
    echo ""
    echo "Ver logs de Nginx con: sudo tail -f /var/log/nginx/error.log"
    echo "Ver estado con: sudo systemctl status nginx"
else
    echo "✗ Error al iniciar Nginx"
    echo "Ver logs con: sudo journalctl -u nginx -n 50"
    exit 1
fi
