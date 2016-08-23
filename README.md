# docker-webhooks
A docker-friendly NodeJS server that converts docker events stream into pubsub via registering webhooks.

# Why?
Some times you need to listen to specific container events but you can't keep an open http stream open (which is the case in a lot of frameworks except for nodejs :D )

# How to use it
Clone the project into your project as a sub folder `./docker-webhooks` then include it in your `docker-compose` file like the following:

```yaml
  dockerwebhooks:
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:r
    build: ./docker-webhooks
    environment:
      - PORT=8888
    expose:
      - '8888'
```

Then you can send it requests like:

```http
POST /listeners

{
  "hook_url" : "myapp:3000/my_path",
  "hook_method": "POST",
  "app_name": "com.company.app",
  "filters": {
    ...
      use standard docker event filters here
    ...
  }
}
```

When an event arrives, it will be sent to you on the `hook_url` you chose via the `hook_method` you chose.
