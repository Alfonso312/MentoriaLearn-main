#!/bin/bash

# Script para desplegar el backend
# Ejecutar desde el directorio del proyecto: bash deploy/deploy-backend.sh

set -e

PROJECT_DIR="/home/ec2-user/MentoriaLearn"
BACKEND_DIR="$PROJECT_DIR/backend"

echo "=========================================="
echo "Desplegando Backend de MentoriaLearn"
echo "=========================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "$BACKEND_DIR/pom.xml" ]; then
    echo "Error: No se encontró pom.xml en $BACKEND_DIR"
    echo "Asegúrate de ejecutar este script desde el directorio raíz del proyecto"
    exit 1
fi

cd "$BACKEND_DIR"

# Compilar el proyecto
echo "Compilando proyecto..."
mvn clean package -DskipTests

# Verificar que el JAR se creó
if [ ! -f "target/mentoria-escolar-1.0.0.jar" ]; then
    echo "Error: No se pudo crear el JAR"
    exit 1
fi

# Crear archivo de configuración de producción si no existe
if [ ! -f "src/main/resources/application-prod.properties" ]; then
    echo "Creando archivo de configuración de producción..."
    cat > src/main/resources/application-prod.properties << EOF
server.port=8080

spring.datasource.url=jdbc:mysql://localhost:3306/MentoriaCertus?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=MentoriaCertus
spring.datasource.password=K@ly1234!
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

logging.level.com.mentoria=INFO
EOF
fi

# Crear servicio systemd si no existe
if [ ! -f "/etc/systemd/system/mentoria-backend.service" ]; then
    echo "Creando servicio systemd..."
    sudo tee /etc/systemd/system/mentoria-backend.service > /dev/null << EOF
[Unit]
Description=Mentoria Backend Service
After=network.target mysql.service

[Service]
Type=simple
User=ec2-user
WorkingDirectory=$BACKEND_DIR
ExecStart=/usr/bin/java -jar $BACKEND_DIR/target/mentoria-escolar-1.0.0.jar --spring.profiles.active=prod
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable mentoria-backend
fi

# Reiniciar el servicio
echo "Reiniciando servicio..."
sudo systemctl restart mentoria-backend

# Esperar un momento y verificar estado
sleep 5
if sudo systemctl is-active --quiet mentoria-backend; then
    echo "✓ Backend desplegado y corriendo correctamente"
    echo ""
    echo "Ver logs con: sudo journalctl -u mentoria-backend -f"
    echo "Ver estado con: sudo systemctl status mentoria-backend"
else
    echo "✗ Error al iniciar el backend"
    echo "Ver logs con: sudo journalctl -u mentoria-backend -n 50"
    exit 1
fi
