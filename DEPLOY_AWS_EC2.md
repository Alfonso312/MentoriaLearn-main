# Guía de Despliegue en AWS EC2

Esta guía te ayudará a desplegar tu aplicación MentoriaLearn en una instancia EC2 de AWS.

## Requisitos Previos

- Cuenta de AWS activa
- Acceso a la consola de AWS
- Cliente SSH instalado en tu máquina local
- Git instalado

---

## Paso 1: Crear una Instancia EC2

1. **Inicia sesión en AWS Console**
   - Ve a https://console.aws.amazon.com/
   - Inicia sesión con tus credenciales

2. **Navega a EC2**
   - Busca "EC2" en la barra de búsqueda
   - Haz clic en "EC2 Dashboard"

3. **Lanza una Instancia**
   - Haz clic en "Launch Instance"
   - Configura lo siguiente:
     - **Name**: `mentoria-learn-server`
     - **AMI**: Amazon Linux 2023 (o Ubuntu 22.04 LTS)
     - **Instance Type**: t2.micro (gratis) o t2.small (recomendado)
     - **Key Pair**: Crea uno nuevo o selecciona uno existente
       - Nombre: `mentoria-learn-key`
       - Tipo: RSA
       - Formato: .pem
       - **IMPORTANTE**: Descarga el archivo .pem y guárdalo en un lugar seguro

4. **Configurar Security Group**
   - Crea un nuevo security group o edita el existente
   - Agrega las siguientes reglas:
     - **SSH (22)**: Tu IP (o 0.0.0.0/0 para desarrollo)
     - **HTTP (80)**: 0.0.0.0/0
     - **HTTPS (443)**: 0.0.0.0/0
     - **Custom TCP (8080)**: 0.0.0.0/0 (para el backend)
     - **Custom TCP (3000)**: 0.0.0.0/0 (opcional, para desarrollo frontend)

5. **Configurar Storage**
   - 20 GB mínimo (gratis en tier gratuito)

6. **Launch Instance**
   - Revisa la configuración
   - Haz clic en "Launch Instance"

---

## Paso 2: Conectarse a la Instancia EC2

1. **Obtén la IP Pública**
   - En la consola de EC2, selecciona tu instancia
   - Copia la "Public IPv4 address"

2. **Conecta vía SSH**
   ```bash
   # Cambia los permisos del archivo .pem
   chmod 400 mentoria-learn-key.pem
   
   # Conéctate (reemplaza con tu IP pública)
   ssh -i mentoria-learn-key.pem ec2-user@TU_IP_PUBLICA
   
   # Si usas Ubuntu, el usuario es 'ubuntu' en lugar de 'ec2-user'
   ssh -i mentoria-learn-key.pem ubuntu@TU_IP_PUBLICA
   ```

---

## Paso 3: Configurar el Servidor

### 3.1 Actualizar el Sistema

```bash
# Para Amazon Linux 2023
sudo dnf update -y

# Para Ubuntu
sudo apt update && sudo apt upgrade -y
```

### 3.2 Instalar Java 21

```bash
# Para Amazon Linux 2023
sudo dnf install java-21-amazon-corretto-devel -y

# Para Ubuntu
sudo apt install openjdk-21-jdk -y

# Verificar instalación
java -version
```

### 3.3 Instalar Maven

```bash
# Para Amazon Linux 2023
sudo dnf install maven -y

# Para Ubuntu
sudo apt install maven -y

# Verificar instalación
mvn -version
```

### 3.4 Instalar Node.js y npm

```bash
# Para Amazon Linux 2023
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Para Ubuntu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version
npm --version
```

### 3.5 Instalar MySQL

```bash
# Para Amazon Linux 2023
sudo dnf install mysql-server -y
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Para Ubuntu
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql

# Configurar MySQL (ejecuta y sigue las instrucciones)
sudo mysql_secure_installation
```

### 3.6 Configurar Base de Datos MySQL

```bash
# Acceder a MySQL
sudo mysql -u root -p

# Dentro de MySQL, ejecuta:
CREATE DATABASE MentoriaCertus;
CREATE USER 'MentoriaCertus'@'localhost' IDENTIFIED BY 'kaly1234';
GRANT ALL PRIVILEGES ON MentoriaCertus.* TO 'MentoriaCertus'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3.7 Instalar Nginx (para servir el frontend)

```bash
# Para Amazon Linux 2023
sudo dnf install nginx -y

# Para Ubuntu
sudo apt install nginx -y

# Iniciar y habilitar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## Paso 4: Subir el Código a EC2

### Opción A: Usando Git (Recomendado)

1. **En tu máquina local, sube el código a GitHub/GitLab**
   ```bash
   cd /Users/jaar/Downloads/MentoriaLearn-main
   git init
   git add .
   git commit -m "Initial commit"
   # Crea un repositorio en GitHub y sigue las instrucciones
   ```

2. **En EC2, clona el repositorio**
   ```bash
   cd /home/ec2-user  # o /home/ubuntu
   git clone https://github.com/TU_USUARIO/MentoriaLearn.git
   cd MentoriaLearn
   ```

### Opción B: Usando SCP (Transferencia directa)

```bash
# Desde tu máquina local
cd /Users/jaar/Downloads/MentoriaLearn-main
scp -i mentoria-learn-key.pem -r . ec2-user@TU_IP_PUBLICA:/home/ec2-user/MentoriaLearn
```

---

## Paso 5: Configurar el Backend

1. **Navegar al directorio del backend**
   ```bash
   cd /home/ec2-user/MentoriaLearn/backend
   ```

2. **Compilar el proyecto**
   ```bash
   mvn clean package -DskipTests
   ```

3. **Crear archivo de configuración para producción**
   ```bash
   sudo nano src/main/resources/application-prod.properties
   ```
   
   Contenido:
   ```properties
   server.port=8080
   
   spring.datasource.url=jdbc:mysql://localhost:3306/MentoriaCertus?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.datasource.username=MentoriaCertus
   spring.datasource.password=kaly1234
   spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
   
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=false
   
   logging.level.com.mentoria=INFO
   ```

4. **Crear servicio systemd para el backend**
   ```bash
   sudo nano /etc/systemd/system/mentoria-backend.service
   ```
   
   Contenido:
   ```ini
   [Unit]
   Description=Mentoria Backend Service
   After=network.target mysql.service
   
   [Service]
   Type=simple
   User=ec2-user
   WorkingDirectory=/home/ec2-user/MentoriaLearn/backend
   ExecStart=/usr/bin/java -jar /home/ec2-user/MentoriaLearn/backend/target/mentoria-escolar-1.0.0.jar --spring.profiles.active=prod
   Restart=always
   RestartSec=10
   StandardOutput=journal
   StandardError=journal
   
   [Install]
   WantedBy=multi-user.target
   ```

5. **Iniciar el servicio**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable mentoria-backend
   sudo systemctl start mentoria-backend
   sudo systemctl status mentoria-backend
   ```

---

## Paso 6: Configurar el Frontend

1. **Navegar al directorio del frontend**
   ```bash
   cd /home/ec2-user/MentoriaLearn/frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Actualizar la URL de la API**
   ```bash
   # Editar el archivo api.js para usar la IP pública o dominio
   nano src/services/api.js
   ```
   
   Cambiar:
   ```javascript
   const API_URL = 'http://TU_IP_PUBLICA:8080';
   const AUTH_URL = 'http://TU_IP_PUBLICA:8080/auth';
   ```

4. **Compilar para producción**
   ```bash
   npm run build
   ```

5. **Configurar Nginx para servir el frontend**
   ```bash
   sudo nano /etc/nginx/conf.d/mentoria.conf
   ```
   
   Contenido:
   ```nginx
   server {
       listen 80;
       server_name TU_IP_PUBLICA;  # O tu dominio si lo tienes
       
       root /home/ec2-user/MentoriaLearn/frontend/build;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # Proxy para el backend
       location /api {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       location /auth {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       location /cursos {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       location /inscripciones {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Reiniciar Nginx**
   ```bash
   sudo nginx -t  # Verificar configuración
   sudo systemctl restart nginx
   ```

---

## Paso 7: Configurar Firewall

```bash
# Para Amazon Linux 2023 (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload

# Para Ubuntu (ufw)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp
sudo ufw enable
```

---

## Paso 8: Verificar el Despliegue

1. **Verificar que el backend está corriendo**
   ```bash
   curl http://localhost:8080
   sudo systemctl status mentoria-backend
   ```

2. **Verificar que Nginx está corriendo**
   ```bash
   sudo systemctl status nginx
   ```

3. **Acceder desde el navegador**
   - Abre tu navegador
   - Ve a: `http://TU_IP_PUBLICA`
   - Deberías ver tu aplicación funcionando

---

## Paso 9: Configurar Dominio (Opcional)

Si tienes un dominio:

1. **Configurar DNS**
   - Ve a tu proveedor de dominio
   - Crea un registro A apuntando a tu IP pública de EC2

2. **Actualizar configuración de Nginx**
   ```bash
   sudo nano /etc/nginx/conf.d/mentoria.conf
   # Cambiar server_name a tu dominio
   ```

3. **Actualizar frontend**
   ```bash
   cd /home/ec2-user/MentoriaLearn/frontend
   nano src/services/api.js
   # Cambiar las URLs a tu dominio
   npm run build
   sudo systemctl restart nginx
   ```

---

## Comandos Útiles

### Ver logs del backend
```bash
sudo journalctl -u mentoria-backend -f
```

### Reiniciar servicios
```bash
sudo systemctl restart mentoria-backend
sudo systemctl restart nginx
sudo systemctl restart mysql
```

### Actualizar código
```bash
cd /home/ec2-user/MentoriaLearn
git pull  # Si usas Git
cd backend
mvn clean package -DskipTests
sudo systemctl restart mentoria-backend
cd ../frontend
npm run build
sudo systemctl restart nginx
```

---

## Solución de Problemas

### El backend no inicia
```bash
# Ver logs
sudo journalctl -u mentoria-backend -n 50

# Verificar que MySQL está corriendo
sudo systemctl status mysql

# Verificar que el puerto 8080 está libre
sudo netstat -tulpn | grep 8080
```

### El frontend no carga
```bash
# Verificar logs de Nginx
sudo tail -f /var/log/nginx/error.log

# Verificar permisos
sudo chown -R ec2-user:ec2-user /home/ec2-user/MentoriaLearn/frontend/build
```

### Problemas de conexión a la base de datos
```bash
# Verificar que MySQL está corriendo
sudo systemctl status mysql

# Probar conexión
mysql -u MentoriaCertus -p MentoriaCertus
```

---

## Seguridad Adicional (Recomendado)

1. **Configurar SSL con Let's Encrypt**
   ```bash
   sudo dnf install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d tu-dominio.com
   ```

2. **Cambiar credenciales por defecto**
   - Cambia las contraseñas de MySQL
   - Usa variables de entorno para credenciales sensibles

3. **Configurar backups automáticos**
   - Usa AWS RDS para la base de datos (más seguro)
   - Configura snapshots de EC2

---

## Costos Estimados

- **EC2 t2.micro**: Gratis (tier gratuito) o ~$8-10/mes
- **Almacenamiento**: ~$2/mes por 20GB
- **Transferencia de datos**: Primeros 100GB gratis
- **Total estimado**: $0-15/mes (dependiendo del uso)

---

¡Felicitaciones! Tu aplicación debería estar funcionando en AWS EC2.
