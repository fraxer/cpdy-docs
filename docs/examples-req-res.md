---
outline: deep
---

# Примеры запросов

## GET

**Маршрут**

```json
// config.json
"/get": {
    "GET": ["/var/www/server/build/exec/handlers/libindexpage.so", "get"]
}
```

**Запрос**

```curl
curl http://example.com/get \
    -X GET
```

**Обработчик**

```C
// handlers/indexpage.c
#include "http1.h"

void get(http1request_t* request, http1response_t* response) {
    response->data(response, "Hello world!");
}
```

## POST payload

**Маршрут**

```json
"/post": {
    "POST": ["/var/www/server/build/exec/handlers/libindexpage.so", "post"]
}
```

**Запрос**

```curl
curl http://example.com/post \
    -X POST \
    -H 'Content-Type: text/plain' \
    -d 'Hello world'
```

**Обработчик**

```C
// handlers/indexpage.c
#include "http1.h"

void post(http1request_t* request, http1response_t* response) {
    char* payload = request->payload(request);

    if (payload == NULL) {
        response->data(response, "Payload not found");
        return;
    }

    response->data(response, payload);

    free(payload);
}
```

## POST payloadf

**Маршрут**

```json
"/post": {
    "POST": ["/var/www/server/build/exec/handlers/libindexpage.so", "post"]
}
```

**Запрос**

```curl
curl http://example.com/post \
    -X POST \
    -F mydata=data \
    -F mytext=text
```

**Обработчик**

```C
// handlers/indexpage.c
#include "http1.h"

void post(http1request_t* request, http1response_t* response) {
    char* data = request->payloadf(request, "mydata");
    char* text = request->payloadf(request, "mytext");

    if (data == NULL) {
        response->data(response, "Data not found");
        goto failed;
    }

    if (text == NULL) {
        response->data(response, "Text not found");
        goto failed;
    }

    response->data(response, text);

    failed:

    if (data) free(data);
    if (text) free(text);
}
```

## POST payload_file

**Маршрут**

```json
"/post": {
    "POST": ["/var/www/server/build/exec/handlers/libindexpage.so", "post"]
}
```

**Запрос**

```curl
curl http://example.com/post \
    -X POST \
    -H 'Content-Type: text/plain' \
    --data-binary @/path/file.txt
```

**Обработчик**

```C
// handlers/indexpage.c
#include "http1.h"

void post(http1request_t* request, http1response_t* response) {
    http1_payloadfile_t payloadfile = request->payload_file(request);

    if (!payloadfile.ok) {
        response->data(response, "file not found");
        return;
    }

    if (!payloadfile.save(&payloadfile, "files", "file.txt")) {
        response->data(response, "Error save file");
        return;
    }

    char* data = payloadfile.read(&payloadfile);

    response->data(response, data);

    free(data);
}
```

## POST payload_filef

**Маршрут**

```json
"/post": {
    "POST": ["/var/www/server/build/exec/handlers/libindexpage.so", "post"]
}
```

**Запрос**

```curl
curl http://example.com/post \
    -X POST \
    -F myfile=@/path/file.txt
```

**Обработчик**

```C
// handlers/indexpage.c
#include "http1.h"

void post(http1request_t* request, http1response_t* response) {
    http1_payloadfile_t payloadfile = request->payload_filef(request, "myfile");

    if (!payloadfile.ok) {
        response->data(response, "file not found");
        return;
    }

    const char* filenameFromPayload = NULL;
    if (!payloadfile.save(&payloadfile, "files", filenameFromPayload)) {
        response->data(response, "Error save file");
        return;
    }

    char* data = payloadfile.read(&payloadfile);

    response->data(response, data);

    free(data);
}
```

## POST payload_json

**Маршрут**

```json
"/post": {
    "POST": ["/var/www/server/build/exec/handlers/libindexpage.so", "post"]
}
```

**Запрос**

```curl
curl http://example.com/post \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{ "key": "value" }'
```

**Обработчик**

```C
// handlers/indexpage.c
#include "http1.h"

void post(http1request_t* request, http1response_t* response) {
    jsondoc_t* document = request->payload_json(request);

    if (!json_ok(document)) {
        response->data(response, json_error(document));
        json_free(document);
        return;
    }

    jsontok_t* object = json_root(document);
    if (!json_is_object(object)) {
        response->data(response, "is not object");
        return;
    }

    json_object_set(object, "mykey", json_create_string(document, "Hello"));

    response->header_add(response, "Content-Type", "application/json");

    response->data(response, json_stringify(document));

    json_free(document);
}
```

## POST payload_jsonf

**Маршрут**

```json
"/post": {
    "POST": ["/var/www/server/build/exec/handlers/libindexpage.so", "post"]
}
```

**Запрос**

```curl
curl http://example.com/post \
    -X POST \
    -F myjson='{ "key": "value" }'
```

**Обработчик**

```C
// handlers/indexpage.c
#include "http1.h"

void post(http1request_t* request, http1response_t* response) {
    jsondoc_t* document = request->payload_jsonf(request, "myjson");

    if (!json_ok(document)) {
        response->data(response, json_error(document));
        json_free(document);
        return;
    }

    jsontok_t* object = json_root(document);
    if (!json_is_object(object)) {
        response->data(response, "is not object");
        return;
    }

    json_object_set(object, "mykey", json_create_string(document, "Hello"));

    response->header_add(response, "Content-Type", "application/json");

    response->data(response, json_stringify(document));

    json_free(document);
}
```

## Query

**Маршрут**

```json
// config.json
"/query": {
    "GET": ["/var/www/server/build/exec/handlers/libindexpage.so", "query"]
},
"^/users/{id|\\d+}$": {
    "GET": ["/var/www/server/build/exec/handlers/libindexpage.so", "user"]
},
"^/params/{param1|\\d+}/{param2|[a-zA-Z0-9]+}$": {
    "GET": ["/var/www/server/build/exec/handlers/libindexpage.so", "params"]
}
```

**Запрос**

```curl
curl http://example.com/query?param=text \
    -X GET
```

```curl
curl http://example.com/users/123 \
    -X GET
```

```curl
curl http://example.com/params/100/param_value \
    -X GET
```

**Обработчик**

```C
// handlers/indexpage.c
#include "http1.h"

void query(http1request_t* request, http1response_t* response) {
    const char* data = request->query(request, "param");

    if (data) {
        response->data(response, data);
        return;
    }

    response->data(response, "Param not found");
}

void user(http1request_t* request, http1response_t* response) {
    const char* data = request->query(request, "id");

    if (data) {
        response->data(response, data);
        return;
    }

    response->data(response, "User Id not found");
}

void params(http1request_t* request, http1response_t* response) {
    const char* param1 = request->query(request, "param1");
    const char* param2 = request->query(request, "param2");

    if (param1 == NULL) {
        response->data(response, "Param1 not found");
        return;
    }

    if (param2 == NULL) {
        response->data(response, "Param2 not found");
        return;
    }

    response->data(response, param1);
}
```

## Чтение cookie

**Маршрут**

```json
"/cookie": {
    "GET": ["/var/www/server/build/exec/handlers/libindexpage.so", "cookie"]
}
```

**Запрос**

```curl
curl http://example.com/cookie \
    -X GET
```

**Обработчик**

```C
// handlers/indexpage.c
#include "http1.h"

void cookie(http1request_t* request, http1response_t* response) {
    const char* token = request->cookie(request, "token");

    if (token == NULL) {
        response->data(response, "Token not found");
        return;
    }

    response->data(response, token);
}
```

## Установка cookie

**Маршрут**

```json
"/set_cookie": {
    "GET": ["/var/www/server/build/exec/handlers/libindexpage.so", "set_cookie"]
}
```

**Запрос**

```curl
curl http://example.com/set_cookie \
    -X GET
```

**Обработчик**

```C
// handlers/indexpage.c
#include "http1.h"

void set_cookie(http1request_t* request, http1response_t* response) {
    response->cookie_add(response, (cookie_t){
        .name = "token",
        .value = "token_value",
        .minutes = 60,
        .path = "/",
        .domain = ".example.com"
        .secure = 1,
        .http_only = 1,
        .same_site = "Lax"
    });

    response->cookie_add(response, (cookie_t){
        .name = "timestamp",
        .value = "123456789",
        .minutes = 60
    });

    response->data(response, "Cookie added");
}
```

## Редирект

**Маршрут**

```json
"/old-resource": {
    "GET": ["/var/www/server/build/exec/handlers/libindexpage.so", "redirect"]
}
```

**Запрос**

```curl
curl http://example.com/old-resource \
    -X GET
```

**Обработчик**

```C
// handlers/indexpage.c
#include "http1.h"

void redirect(http1request_t* request, http1response_t* response) {
    response->redirect(response, "/new-resource", 301);
}
```

## Стандартный ответ

**Маршрут**

```json
"/default": {
    "GET": ["/var/www/server/build/exec/handlers/libindexpage.so", "def"]
}
```

**Запрос**

```curl
curl http://example.com/default \
    -X GET
```

**Обработчик**

```C
// handlers/indexpage.c
#include "http1.h"

void def(http1request_t* request, http1response_t* response) {
    response->def(response, 401);
}
```

## Чтение заголовков

**Маршрут**

```json
"/header": {
    "GET": ["/var/www/server/build/exec/handlers/libindexpage.so", "header"]
}
```

**Запрос**

```curl
curl http://example.com/header \
    -X GET
```

**Обработчик**

```C
// handlers/indexpage.c
#include "http1.h"

void header(http1request_t* request, http1response_t* response) {
    http1_header_t* header_host = request->header(request, "Host");

    if (header_host) {
        response->data(response, header_host->value);
        return;
    }

    response->data(response, "header Host not found");
}
```

## Установка заголовков

**Маршрут**

```json
"/set_header": {
    "GET": ["/var/www/server/build/exec/handlers/libindexpage.so", "set_header"]
}
```

**Запрос**

```curl
curl http://example.com/set_header \
    -X GET
```

**Обработчик**

```C
// handlers/indexpage.c
#include "http1.h"

void set_header(http1request_t* request, http1response_t* response) {
    response->header_add(response, "Content-Type", "text/plain");

    response->data(response, "Response with custom header");
}
```

## Отправка файла

**Маршрут**

```json
// config.json
"/file": {
    "GET": ["/var/www/server/build/exec/handlers/libindexpage.so", "file"]
}
```

**Запрос**

```curl
curl http://example.com/file \
    -X GET
```

**Обработчик**

```C
// handlers/indexpage.c
#include "http1.h"

void file(http1request_t* request, http1response_t* response) {
    response->file(response, "/files/file.txt");
}
```

## WebSocket соединение

**Маршрут**

```json
// config.json
"/wss": {
    "GET": ["/var/www/server/build/exec/handlers/libindexpage.so", "wss"]
}
```

**Запрос**

```js
const socket = new WebSocket("wss://example.com/wss");
```

**Обработчик**

```C
// handlers/indexpage.c
#include "http1.h"
#include "websockets.h"

void wss(http1request_t* request, http1response_t* response) {
    switch_to_websockets(request, response);
}
```

## WebSocket запрос

**Маршрут**

```json
// config.json
"/wss_request": {
    "GET": ["/var/www/server/build/exec/handlers/libwsindexpage.so", "wss_request"]
}
```

**Запрос**

```js
const socket = new WebSocket("wss://example.com/wss");

socket.onopen = (event) => {
	socket.send("GET /wss_request {\"key\": \"value\"}");
};
```

**Обработчик**

```C
// handlers/wsindexpage.c
#include "websockets.h"

void wss_request(websocketsrequest_t* request, websocketsresponse_t* response) {
    const char* data = "Empty payload";

    if (request->payload)
        data = request->payload;

    response->text(response, data);
}
```

## WebSocket query

**Маршрут**

```json
// config.json
"/wss_query": {
    "GET": ["/var/www/server/build/exec/handlers/libwsindexpage.so", "wss_query"]
}
```

**Запрос**

```js
const socket = new WebSocket("wss://example.com/wss");

socket.onopen = (event) => {
	socket.send("GET /wss_query?q=text");
};
```

**Обработчик**

```C
// handlers/wsindexpage.c
#include "websockets.h"

void wss_query(websocketsrequest_t* request, websocketsresponse_t* response) {
    const char* data = request->query(request, "q");

    if (!data)
        data = "Empty query";

    response->text(response, data);
}
```
