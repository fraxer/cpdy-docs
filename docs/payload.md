---
outline: deep
---

# Получение данных от клиента

Cpdy предоставляет несколько методов для извлечения данных из запроса.

### payload

`char*(*payload)(struct http1request*);`

Извлекает все доступные данные из тела запроса в виде строки.

Возвращает указатель типа `char` на динамически выделенную память.

После работы с данными обязательно освободите память.

```C
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

### payloadf

`char*(*payloadf)(struct http1request*, const char*);`

Извлекает данные по ключу из тела запроса в виде строки. Используется при кодировании данных типа `multipart/form-data` и `application/x-www-form-urlencoded`.

Возвращает указатель типа `char` на динамически выделенную память.

После работы с данными обязательно освободите память.

```C
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

    response->data(response, "Payload processed");

    failed:

    if (data) free(data);
    if (text) free(text);
}
```

### payload_file

`http1_payloadfile_t(*payload_file)(struct http1request*);`

Извлекает все доступные данные из тела запроса и оборачивает их в структуру `http1_payloadfile_t`.

Возвращает структуру `http1_payloadfile_t`. В структуре есть поле `name` для хранения название файла, метод `save` для сохранения файла в директорию с указанным названием файла и метод `read` для извлечения содержимого файла в виде строки.

Метод `read` выделяет динамическую память для хранения строки, поэтому необходимо освобождать память по указателю.

```C
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

### payload_filef

`http1_payloadfile_t(*payload_filef)(struct http1request*);`

Извлекает данные по ключу из тела запроса и оборачивает их в структуру `http1_payloadfile_t`. Используется при кодировании данных типа `multipart/form-data`.

Возвращает структуру `http1_payloadfile_t`. В структуре есть поле `name` для хранения название файла, метод `save` для сохранения файла в директорию с указанным названием файла и метод `read` для извлечения содержимого файла в виде строки.

Метод `read` выделяет динамическую память для хранения строки, поэтому необходимо освобождать память по указателю.

```C
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

### payload_json

`jsondoc_t*(*payload_json)(struct http1request*);`

Извлекает все доступные данные из тела запроса и создает json-документ `jsondoc_t`.

Возвращает указатель типа `jsondoc_t`.

После работы с json-документом необходимо освобождать память.

```C
#include "http1.h"
#include "json.h"

void post(http1request_t* request, http1response_t* response) {
    jsondoc_t* document = request->payload_json(request);

    if (!json_ok(document)) {
        response->data(response, json_error(document));
        goto failed;
    }

    jsontok_t* object = json_root(document);
    if (!json_is_object(object)) {
        response->data(response, "is not object");
        goto failed;
    }

    json_object_set(object, "mykey", json_create_string(document, "Hello"));

    response->header_add(response, "Content-Type", "application/json");

    response->data(response, json_stringify(document));

    failed:

    json_free(document);
}
```

### payload_jsonf

`jsondoc_t*(*payload_jsonf)(struct http1request*, const char*);`

Извлекает данные по ключу из тела запроса и создает json-документ `jsondoc_t`. Используется при кодировании данных типа `multipart/form-data`.

Возвращает указатель типа `jsondoc_t`.

После работы с json-документом необходимо освобождать память.

```C
#include "http1.h"
#include "json.h"

void post(http1request_t* request, http1response_t* response) {
    jsondoc_t* document = request->payload_jsonf(request, "myjson");

    if (!json_ok(document)) {
        response->data(response, json_error(document));
        goto failed;
    }

    jsontok_t* object = json_root(document);
    if (!json_is_object(object)) {
        response->data(response, "is not object");
        goto failed;
    }

    json_object_set(object, "mykey", json_create_string(document, "Hello"));

    response->header_add(response, "Content-Type", "application/json");

    response->data(response, json_stringify(document));

    failed:

    json_free(document);
}
```

