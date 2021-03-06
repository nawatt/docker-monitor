[![Docker Automated build](https://img.shields.io/docker/automated/mhdsyrwan/docker-monitor.svg?maxAge=2592000)](https://hub.docker.com/r/mhdsyrwan/docker-monitor/)
[![node 6.4.0](https://img.shields.io/badge/node-v6.4.0-yellow.svg?maxAge=2592000)](#)
[![](https://images.microbadger.com/badges/image/mhdsyrwan/docker-monitor.svg)](https://microbadger.com/images/mhdsyrwan/docker-monitor "Get your own image badge on microbadger.com")

# docker-webhooks
A docker-friendly NodeJS server that converts docker events stream into pubsub via registering webhooks.

# Why?
Sometimes you need to listen to specific container events but you can't keep an http stream open (which is the case in many non-event-based frameworks)

# How to use it
include it in your `docker-compose` file like the following:

```yaml
  version: 2
  volumes:
    dockerwebhooksdata:
      driver: local
  services:
    dockerwebhooks:
      volumes:
        - /var/run/docker.sock:/var/run/docker.sock:ro
        - dockerwebhooksdata:/var/app/data
      image: mhdsyrwan/docker-webhooks:latest
      environment:
        - PORT=8888
      expose:
        - '8888'
```

Then you can send it requests like:

## Registering a listener

**Request:**
```http
POST /listeners
Content-Type: application/json

{
  "hook_url" : "myapp:3000/my_path",
  "hook_method": "POST",
  "hook_name": "mydaemon_monitor",
  "hook_headers": {
    "Authorization": "Basic QWxhZGRpbjpPcGVuU2VzYW1l"
  },
  "app_name": "com.company.app",
  "filters": {
    "event": ["start"],
    "type": ["container"]
  }
}
```
**response**

```json
{
  "id": "5fe5d422-fa02-4a0b-b64e-76102d577b50",
  "hook_url" : "myapp:3000/my_path",
  "hook_method": "POST",
  "hook_name": "mydaemon_monitor",
  "app_name": "com.company.app",
  "filters": {
    "event": ["start"],
    "type": ["container"]
  }
}
```

When an event arrives, it will be sent to you on the `hook_url` you chose via the `hook_method` you chose.
### Why should i pass a hook_name-app_name pair?
When you pass `app_name`/`hook_name` you protect your call from redefining a predefined listener. So, in that case you'll get `200` instead of `201` as an http status code (it will also update other fields).

## Unregistering a listener

```http
DELETE /listeners/:id
```
where `id` is the `id` you get from the registration process.

## Listing listeners
```http
GET /listeners
```

## Querying for a specific listener
```http
GET /listeners/:id
```

# Development
This project is tested on a limited set of use cases. Bug-reporting, enhancements and questions are welcome via Github issues.

Currently, a test script `/test.js` is written casually. you can run the tests via `npm test`
