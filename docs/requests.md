---
outline: deep
---

# Запросы

Запросы, сделанные к приложению, представлены в виде структуры `http1request_t`, которая предоставляет информацию о параметрах HTTP-запроса - заголовки, cookie, метод и т.д.

## Параметры GET запроса

Чтобы получить параметры запроса, вы должны вызвать метод `query()` компонента `request`

```C
void get(http1request_t* request, http1response_t* response) {
    const char* data = request->query(request, "mydata");

    if (data) {
        response->data(response, data);
        return;
    }

    response->data(response, "data not found");
}
```

## Параметры POST, PUT, PATCH запросов

В отличие от GET параметров, параметры, которые были переданы через POST, PUT, PATCH и д.р. отправляются в теле запроса.

Доступ к ним осуществляется через методы:

* payloadf()
* payload_urlencoded()
* payload_filef()
* payload_jsonf()

```C
void post(http1request_t* request, http1response_t* response) {
    char* payload = request->payloadf(request, "mydata");

    if (!payload) {
        response->data(response, "field not found");
        return;
    }

    response->data(response, payload);

    free(payload);
}
```

Обработка входящих данных подробно описана в разделе [Получение данных от клиента](/payload)

## Методы запроса

Вы можете получить названия HTTP метода, используемого в текущем запросе, обратившись к свойству `request->method`.

Доступны следующие методы:

* ROUTE_GET
* ROUTE_POST
* ROUTE_PUT
* ROUTE_DELETE
* ROUTE_OPTIONS
* ROUTE_PATCH

```C
void get(http1request_t* request, http1response_t* response) {
    const char* data = request->method == ROUTE_GET ?
        "This is the get method" :
        "This is the not get method";

    response->data(response, data);
}
```

## URL запроса

Компонент `request` предоставляет три свойства для работы с url:

* uri - вернет относительный адрес ресурса `/resource.html?id=100&text=hello`.
* path - вернет путь до ресурса без параметров `/resource.html`.
* ext - вернет расширение из названия ресурса `html` или пустую строку.

Также вычисляется длина каждого свойства:

* uri_length
* path_length
* ext_length

```C
void get(http1request_t* request, http1response_t* response) {
    if (request->uri_length > 4096) {
        http1response_default_response(response, 414);
        return;
    }

    response->data(response, request->uri);
}
```

## HTTP заголовки

Вы можете получить информацию о HTTP заголовках с помощью методов

`request->header()` или `request->headern()`. Например,

```C
void get(http1request_t* request, http1response_t* response) {
    const http1_header_t* header_host = request->header(request, "Host");
    // size_t key_length = 4;
    // const http1_header_t* header_host = request->headern(request, "Host", key_length);

    if (header_host) {
        response->data(response, header_host->value);
        return;
    }

    response->data(response, "header Host not found");
}
```
