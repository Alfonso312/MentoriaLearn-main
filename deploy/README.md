# Scripts de Despliegue para AWS EC2

Este directorio contiene scripts automatizados para facilitar el despliegue de MentoriaLearn en AWS EC2.

## Scripts Disponibles

### 1. `setup-server.sh`
Configura el servidor EC2 con todas las dependencias necesarias.

**Uso:**
```bash
sudo bash deploy/setup-server.sh
```

**Instala:**
- Java 21
- Maven
- Node.js y npm
- MySQL
- Nginx

### 2. `deploy-backend.sh`
Compila y despliega el backend de Spring Boot.

**Uso:**
```bash
bash deploy/deploy-backend.sh
```

**Realiza:**
- Compila el proyecto con Maven
- Crea el archivo JAR
- Configura el servicio systemd
- Inicia el servicio del backend

### 3. `deploy-frontend.sh`
Compila y despliega el frontend de React.

**Uso:**
```bash
bash deploy/deploy-frontend.sh <IP_PUBLICA_O_DOMINIO>
```

**Ejemplo:**
```bash
bash deploy/deploy-frontend.sh 54.123.45.67
```

**Realiza:**
- Actualiza las URLs de la API
- Instala dependencias de npm
- Compila el proyecto para producción
- Configura Nginx para servir el frontend

### 4. `update-deployment.sh`
Actualiza el despliegue completo (backend + frontend).

**Uso:**
```bash
bash deploy/update-deployment.sh <IP_PUBLICA_O_DOMINIO>
```

**Ejemplo:**
```bash
bash deploy/update-deployment.sh 54.123.45.67
```

## Flujo de Despliegue Completo

1. **Conectarse a EC2**
   ```bash
   ssh -i mentoria-learn-key.pem ec2-user@TU_IP_PUBLICA
   ```

2. **Configurar el servidor (solo la primera vez)**
   ```bash
   sudo bash deploy/setup-server.sh
   ```

3. **Configurar MySQL**
   ```bash
   sudo mysql -u root -p
   ```
   ```sql
   CREATE DATABASE MentoriaCertus;
   CREATE USER 'MentoriaCertus'@'localhost' IDENTIFIED BY 'kaly1234';
   GRANT ALL PRIVILEGES ON MentoriaCertus.* TO 'MentoriaCertus'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Subir el código** (si no usas Git)
   ```bash
   # Desde tu máquina local
   scp -i mentoria-learn-key.pem -r . ec2-user@TU_IP_PUBLICA:/home/ec2-user/MentoriaLearn
   ```

5. **Desplegar backend**
   ```bash
   cd /home/ec2-user/MentoriaLearn
   bash deploy/deploy-backend.sh
   ```

6. **Desplegar frontend**
   ```bash
   bash deploy/deploy-frontend.sh TU_IP_PUBLICA
   ```

## Comandos Útiles

### Ver logs
```bash
# Backend
sudo journalctl -u mentoria-backend -f

# Nginx
sudo tail -f /var/log/nginx/error.log
```

### Reiniciar servicios
```bash
sudo systemctl restart mentoria-backend
sudo systemctl restart nginx
sudo systemctl restart mysql
```

### Ver estado de servicios
```bash
sudo systemctl status mentoria-backend
sudo systemctl status nginx
sudo systemctl status mysql
```

## Notas Importantes

- Todos los scripts deben ejecutarse desde el directorio raíz del proyecto (`/home/ec2-user/MentoriaLearn`)
- El script `setup-server.sh` requiere permisos de sudo
- Asegúrate de tener la IP pública o dominio correcto al ejecutar `deploy-frontend.sh`
- Si cambias la configuración de la base de datos, actualiza `application-prod.properties`

## Solución de Problemas

Si encuentras problemas:

1. Verifica los logs de los servicios
2. Asegúrate de que MySQL está corriendo
3. Verifica que los puertos están abiertos en el Security Group de EC2
4. Revisa los permisos de los archivos y directorios
