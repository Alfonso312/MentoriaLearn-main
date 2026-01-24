#!/bin/bash

# Script para actualizar el despliegue completo
# Ejecutar desde el directorio del proyecto: bash deploy/update-deployment.sh <IP_PUBLICA_O_DOMINIO>

set -e

if [ -z "$1" ]; then
    echo "Uso: bash deploy/update-deployment.sh <IP_PUBLICA_O_DOMINIO>"
    exit 1
fi

SERVER_URL="$1"
PROJECT_DIR="/home/ec2-user/MentoriaLearn"

echo "=========================================="
echo "Actualizando despliegue de MentoriaLearn"
echo "=========================================="
echo ""

cd "$PROJECT_DIR"

# Si se usa Git, hacer pull
if [ -d ".git" ]; then
    echo "Actualizando código desde Git..."
    git pull
    echo ""
fi

# Actualizar backend
echo "Actualizando backend..."
bash deploy/deploy-backend.sh
echo ""

# Actualizar frontend
echo "Actualizando frontend..."
bash deploy/deploy-frontend.sh "$SERVER_URL"
echo ""

echo "=========================================="
echo "Actualización completada!"
echo "=========================================="
echo ""
echo "Verificar servicios:"
echo "  Backend: sudo systemctl status mentoria-backend"
echo "  Nginx: sudo systemctl status nginx"
echo "  MySQL: sudo systemctl status mysql"
echo ""
