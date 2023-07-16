---
outline: deep
title: WebSockets получение данных от клиента
description: Cpdy предоставляет методы для извлечения данных по протоколу WebSockets как есть или в json-формате
---

# Получение данных от клиента

Cpdy предоставляет несколько методов для извлечения данных из запроса.

### payload

`char*(*payload)(struct websocketsrequest*);`

Извлекает все доступные данные из тела запроса в виде строки.

Возвращает указатель типа `char` на динамически выделенную память.

После работы с данными обязательно освободите память.

```C
#include "websockets.h"

void post(websocketsrequest_t* request, websocketsresponse_t* response) {
    char* payload = request->payload(request);

    if (payload == NULL) {
        response->text(response, "Payload not found");
        return;
    }

    response->text(response, payload);

    free(payload);
}
```

### payload_json

`jsondoc_t*(*payload_json)(struct websocketsrequest*);`

Извлекает все доступные данные из тела запроса и создает json-документ `jsondoc_t`.

Возвращает указатель типа `jsondoc_t`.

После работы с json-документом необходимо освобождать память.

```C
#include "websockets.h"
#include "json.h"

void post(websocketsrequest_t* request, websocketsresponse_t* response) {
    jsondoc_t* document = request->payload_json(request);

    if (!json_ok(document)) {
        response->text(response, json_error(document));
        goto failed;
    }

    jsontok_t* object = json_root(document);
    if (!json_is_object(object)) {
        response->text(response, "is not object");
        goto failed;
    }

    json_object_set(object, "mykey", json_create_string(document, "Hello"));

    response->text(response, json_stringify(document));

    failed:

    json_free(document);
}
```
