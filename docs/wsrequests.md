---
outline: deep
title: WebSockets запросы
description: Обработка данных по протоколу WebSockets, описание формата запроса к серверу
---

# WebSockets

Веб-сокеты это продвинутая технология, позволяющая открыть постоянное двунаправленное сетевое соединение между браузером пользователя и сервером. С помощью его API вы можете отправить сообщение на сервер и получить ответ без выполнения http запроса, причём этот процесс будет событийно-управляемым.

## Запросы

Запросы, сделанные к приложению, представлены в виде структуры `websocketsrequest_t`, которая предоставляет информацию о параметрах WebSocket-запроса - метод, тип, ресурс, данные и т.д.

Формат запроса: `[method] [path] [payload]`.

Метод, путь и полезная нагрузка разделяются одним пробелом, например:

```
GET /
GET /users?id=100
POST /users {"id": 100, "name":"Alex"}
PATCH /users/100 {"name":"Alen"}
DELETE /users/100
```

## Параметры GET запроса

Чтобы получить параметры запроса, вы должны вызвать метод `query()` компонента `websocketsrequest`

```C
void get(websocketsrequest_t* request, websocketsresponse_t* response) {
    const char* data = request->query(request, "mydata");

    if (data) {
        response->text(response, data);
        return;
    }

    response->text(response, "Data not found");
}
```

## Данные POST и PATCH запросов

Данные, которые были переданы через POST и PATCH отправляются в теле запроса.

Доступ к ним осуществляется через методы:

* payload()
* payload_json()

```C
void post(websocketsrequest_t* request, websocketsresponse_t* response) {
    char* payload = request->payload(request);

    if (!payload) {
        response->text(response, "Payload not found");
        return;
    }

    response->text(response, payload);

    free(payload);
}
```

## Методы запроса

Вы можете получить названия HTTP метода, используемого в текущем запросе, обратившись к свойству `request->method`.

Доступны следующие методы:

* ROUTE_GET
* ROUTE_POST
* ROUTE_PATCH
* ROUTE_DELETE

```C
void get(websocketsrequest_t* request, websocketsresponse_t* response) {
    const char* data = request->method == ROUTE_GET ?
        "This is the get method" :
        "This is the not get method";

    response->text(response, data);
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
