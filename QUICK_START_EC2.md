# Inicio Rápido - Despliegue en EC2

## Resumen de Pasos

### 1. Crear Instancia EC2 (5 minutos)
- Ve a AWS Console → EC2 → Launch Instance
- AMI: Amazon Linux 2023 o Ubuntu 22.04
- Tipo: t2.micro (gratis) o t2.small
- Security Group: Abre puertos 22, 80, 443, 8080
- Descarga el archivo .pem de la clave

### 2. Conectarse a EC2
```bash
chmod 400 mentoria-learn-key.pem
ssh -i mentoria-learn-key.pem ec2-user@TU_IP_PUBLICA
```

### 3. Configurar Servidor (una sola vez)
```bash
# Subir el proyecto (si no usas Git)
scp -i mentoria-learn-key.pem -r . ec2-user@TU_IP_PUBLICA:/home/ec2-user/MentoriaLearn

# En EC2, ejecutar:
cd /home/ec2-user/MentoriaLearn
sudo bash deploy/setup-server.sh
```

### 4. Configurar MySQL
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

### 5. Desplegar Backend
```bash
cd /home/ec2-user/MentoriaLearn
bash deploy/deploy-backend.sh
```

### 6. Desplegar Frontend
```bash
bash deploy/deploy-frontend.sh TU_IP_PUBLICA
```

### 7. ¡Listo!
Abre tu navegador en: `http://TU_IP_PUBLICA`

---

## Comandos Útiles

```bash
# Ver logs del backend
sudo journalctl -u mentoria-backend -f

# Reiniciar servicios
sudo systemctl restart mentoria-backend
sudo systemctl restart nginx

# Actualizar despliegue completo
bash deploy/update-deployment.sh TU_IP_PUBLICA
```

---

## Documentación Completa

Para más detalles, consulta: [DEPLOY_AWS_EC2.md](./DEPLOY_AWS_EC2.md)
