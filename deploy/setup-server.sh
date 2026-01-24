#!/bin/bash

# Script de configuración inicial del servidor EC2
# Ejecutar como: sudo bash setup-server.sh

set -e

echo "=========================================="
echo "Configurando servidor para MentoriaLearn"
echo "=========================================="

# Detectar el sistema operativo
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo "No se pudo detectar el sistema operativo"
    exit 1
fi

echo "Sistema operativo detectado: $OS"

# Actualizar sistema
echo "Actualizando sistema..."
if [ "$OS" == "amzn" ] || [ "$OS" == "amazon" ]; then
    dnf update -y
elif [ "$OS" == "ubuntu" ]; then
    apt update && apt upgrade -y
fi

# Instalar Java 21
echo "Instalando Java 21..."
if [ "$OS" == "amzn" ] || [ "$OS" == "amazon" ]; then
    dnf install -y java-21-amazon-corretto-devel
elif [ "$OS" == "ubuntu" ]; then
    apt install -y openjdk-21-jdk
fi

# Instalar Maven
echo "Instalando Maven..."
if [ "$OS" == "amzn" ] || [ "$OS" == "amazon" ]; then
    dnf install -y maven
elif [ "$OS" == "ubuntu" ]; then
    apt install -y maven
fi

# Instalar Node.js
echo "Instalando Node.js..."
if [ "$OS" == "amzn" ] || [ "$OS" == "amazon" ]; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    dnf install -y nodejs
elif [ "$OS" == "ubuntu" ]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

# Instalar MySQL
echo "Instalando MySQL..."
if [ "$OS" == "amzn" ] || [ "$OS" == "amazon" ]; then
    dnf install -y mysql-server
    systemctl start mysqld
    systemctl enable mysqld
elif [ "$OS" == "ubuntu" ]; then
    apt install -y mysql-server
    systemctl start mysql
    systemctl enable mysql
fi

# Instalar Nginx
echo "Instalando Nginx..."
if [ "$OS" == "amzn" ] || [ "$OS" == "amazon" ]; then
    dnf install -y nginx
elif [ "$OS" == "ubuntu" ]; then
    apt install -y nginx
fi

systemctl start nginx
systemctl enable nginx

# Configurar firewall
echo "Configurando firewall..."
if [ "$OS" == "amzn" ] || [ "$OS" == "amazon" ]; then
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --permanent --add-port=8080/tcp
    firewall-cmd --reload
elif [ "$OS" == "ubuntu" ]; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 8080/tcp
    ufw --force enable
fi

# Verificar instalaciones
echo ""
echo "=========================================="
echo "Verificando instalaciones..."
echo "=========================================="
java -version
echo ""
mvn -version
echo ""
node --version
npm --version
echo ""
mysql --version
echo ""
nginx -v
echo ""

echo "=========================================="
echo "Configuración del servidor completada!"
echo "=========================================="
echo ""
echo "Próximos pasos:"
echo "1. Configurar MySQL (crear base de datos y usuario)"
echo "2. Subir el código del proyecto"
echo "3. Compilar y desplegar backend y frontend"
echo ""
echo "Para configurar MySQL, ejecuta:"
echo "sudo mysql -u root -p"
echo ""
echo "Luego ejecuta:"
echo "CREATE DATABASE MentoriaCertus;"
echo "CREATE USER 'MentoriaCertus'@'localhost' IDENTIFIED BY 'kaly1234';"
echo "GRANT ALL PRIVILEGES ON MentoriaCertus.* TO 'MentoriaCertus'@'localhost';"
echo "FLUSH PRIVILEGES;"
echo "EXIT;"
