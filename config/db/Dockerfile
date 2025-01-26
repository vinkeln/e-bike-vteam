# Använd den senaste MariaDB-basen
FROM mariadb:latest

# Kopiera din konfigurationsfil till containern
COPY my.cnf /etc/mysql/my.cnf

# Ställ in miljövariabler för MariaDB
ENV MYSQL_ROOT_PASSWORD=P@ssw0rd
ENV MYSQL_DATABASE=elsparkcykel
ENV MYSQL_USER=dbadm
ENV MYSQL_PASSWORD=P@ssw0rd

# Exponera port 3306 för anslutningar
EXPOSE 3306

# Starta MariaDB-servern
CMD ["mysqld"]
