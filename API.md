# `simple-message-project/API`

The following API usage examples assume [httpie](https://httpie.io/) but `curl` or `wget` works just as well

### Healthcheck

```shell
http GET 'http://localhost:4000/ping'
```

### Users

#### List all users

```shell
http GET 'http://localhost:4000/api/users'
```

#### Get user by id

```shell
http GET 'http://localhost:4000/api/users/1'
```

#### Create new user

```shell

```
