# Configuration
//TODO: UPDATE
## Secrets

Create two secrets for database passwords for the application, using following commands. First password will be used for the `root` user of the database. Second password will be used for the application defined user to access the database.

Replace `$password_length` with numeric value for ex. `32`

Replace `$secret_name` with string value for ex. `ncu_aw_db_root_password`

```sh
openssl rand -base64 $password_length | docker secret create $secret_name -
```

To see the list of created secrets along with other existing ones use follwing command:

```sh
docker secret ls
```

After generating both secrets update the `docker-compose.yml` secrets section with the names of generated secrets. For example:

```yml
secrets:
  secrets.json:
    file: ./secrets/secrets.json
  certificate.pfx:
    file: ./secrets/certificate.pfx
  db_root_password:
    file: ./secrets/db_root_password
  db_user_password:
    file: ./secrets/db_user_password
secrets:
  secrets.json:
    file: ./secrets/app/secrets.json
  certificate.pfx:
    file: ./secrets/app/certificate.pfx
  ncu_aw_db_root_password: 
    external: true
  ncu_aw_db_user_password: # Replace the name with user password secret
    external: true
```

Do not forget to also update secrets section for the `mariadb` service with new names:

```yml
services:
  # Other services...
    mariadb:
    # Other configuration...
    secrets:
      - ncu_aw_db_root_password # Replace the name with root password secret
      - ncu_aw_db_user_password # Replace the name with user password secret
```

Those names also need to be updated in the `/config/mariadb.env` file found in this project. Secret names are tied to the file name inside the container after it's creation, so they need an update as well. Path to the secret file stays the same under `/run/secrets/`. For example:

```env
TZ=Europe/Warsaw
MYSQL_DATABASE=ncuannualworksdb
MYSQL_USER=ncuawapp
MYSQL_PASSWORD_FILE=/run/secrets/ncu_aw_db_root_password # Replace the name with root password secret
MYSQL_ROOT_PASSWORD_FILE=/run/secrets/ncu_aw_db_user_password # Replace the name with user password secret
```