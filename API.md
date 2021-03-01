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
http --json POST 'http://localhost:4000/api/users' \
    'Content-Type':'application/json; charset=utf-8' \
    uuid="user123"
```

### Chats

#### Create a chat

```shell
http --json POST 'http://localhost:4000/api/chats' \
    'Content-Type':'application/json; charset=utf-8' \
    userId:=1 \
    recipientId:=2
```

#### Get chat by id

Includes messages associated between two in the chat upto 100 messages and younger than 30 days old

```shell
http --json GET 'http://localhost:4000/api/chats/1'
```

### Messages

#### List all messages

Includes all messages across all chats upto 100 messages and younger than 30 days old

```shell
http GET 'http://localhost:4000/api/all-messages'
```

#### Get message by id

```shell
http --json GET 'http://localhost:4000/api/messages/1'
```

#### Create a message

```shell
http --json POST 'http://localhost:4000/api/messages' \
    'Content-Type':'application/json; charset=utf-8' \
    content="hola!" \
    sendById:=1 \
    chatId:=1
```
