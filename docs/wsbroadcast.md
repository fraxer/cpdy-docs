---
outline: deep
title: WebSockets широковещание
description: Широковещательная рассылка сообщений по протоколу WebSockets
---

# Широковещание

Возможность передачи данных в режиме реального времени с серверов клиентам является требованием для многих современных веб-приложений и мобильных приложений. Когда на сервере обновляются некоторые данные, сообщение обычно отправляется через соединение WebSocket для обработки клиентом. WebSockets предоставляют более эффективную альтернативу постоянному опросу сервера вашего приложения на предмет изменений данных, которые должны быть отражены в вашем пользовательском интерфейсе.

Основная концепция трансляции проста: клиенты подключаются к именованным каналам на внешнем интерфейсе, в то время как ваше приложение транслирует события на эти каналы на внутреннем интерфейсе. Эти события могут содержать любые дополнительные данные, которые вы хотите сделать доступными во внешнем интерфейсе.


## Канал

Канал представляет собой группу соединений/клиентов для получения/отправки сообщений.

Структура канала содержит в себе:
* название канала
* список соединений

Каждому соединению прикрепляется:
* структура идентификации
* обработчик ответа

Структура идентификации нужна для отправки сообщения определенным клиентам в канале.\
Обработчик ответа формирует тело сообщения перед отправкой.

## Конфигурация маршрутов

```json
"servers": {
    "s1": {
        ...
        "websockets": {
            "default": ["/var/www/server/build/exec/handlers/libwsindexpage.so", "default_"],
            "routes": {
                "/channel-join": {
                    "GET": ["/var/www/server/build/exec/handlers/libwsindexpage.so", "channel_join"]
                },
                "/channel-leave": {
                    "GET": ["/var/www/server/build/exec/handlers/libwsindexpage.so", "channel_leave"]
                },
                "/channel-send-message": {
                    "POST": ["/var/www/server/build/exec/handlers/libwsindexpage.so", "channel_send"]
                }
            }
        },
        ...
    }
}
```

## Сервер

### Канал
Метод `broadcast_add` создаёт канал и добавляет в него указатель на соединение, данные о структуре идентификации соединения и функцию обработчика ответа.\
Если сообщения в канале будут рассылаться всем клиентам, то формировать структуру идентификации соединения не нужно.

```C
void channel_join(websocketsrequest_t* request, websocketsresponse_t* response) {
    broadcast_id_t* id = NULL;
    broadcast_add("my_broadcast_name", request->connection, id, mybroadcast_send_data);
    response->data(response, "done");
}
```

Метод `broadcast_remove` исключает клиента из канала.

```C
void channel_leave(websocketsrequest_t* request, websocketsresponse_t* response) {
    broadcast_remove("my_broadcast_name", request->connection);
    response->data(response, "done");
}
```

### Обработчик ответа

Обработчик для формирования структуры ответа `websocketsresponse_t`. 

```C
void mybroadcast_send_data(response_t* response, const char* data, size_t size) {
    websocketsresponse_t* wsresponse = (websocketsresponse_t*)response;
    wsresponse->textn(wsresponse, data, size);
}
```

### Структура идентификации

Базовая структура идентификации соединения:

```C
typedef struct broadcast_id {
    void(*free)(struct broadcast_id*);
} broadcast_id_t;
```

Для структуры необходимо выделить память из кучи, чтобы планировщик мог корректно идентифицировать соединения.\
Освобождение пямяти происходит автоматически, когда соединение закрывается или клиент покидает канал.\
Для освобождения памяти в структуре присутствует коллбек `free`. Для каждой структуры необходимо реализовать свой коллбек для корректного освобождения памяти.

На основе базовой структуры нужно сформировать собственную структуру.

```C
// broadcasting/mybroadcast.h
typedef struct mybroadcast_id {
    broadcast_id_t base;
    int user_id;
    int project_id;
} mybroadcast_id_t;

mybroadcast_id_t* mybroadcast_id_create();
void mybroadcast_id_free(void*);

// broadcasting/mybroadcast.c
mybroadcast_id_t* mybroadcast_id_create() {
    mybroadcast_id_t* st = malloc(sizeof * st);
    if (st == NULL) return NULL;

    st->base.free = mybroadcast_id_free;
    st->user_id = 1;
    st->project_id = 2;

    return st;
}

void mybroadcast_id_free(void* id) {
    mybroadcast_id_t* my_id = id;
    if (id == NULL) return;

    my_id->user_id = 0;
    my_id->project_id = 0;

    free(my_id);
}
```

Создадим канал и прикрепим к соединению структуру идентификации

```C
void channel_join(websocketsrequest_t* request, websocketsresponse_t* response) {
    broadcast_id_t* id = mybroadcast_id_create();
    if (id == NULL) {
        response->data(response, "out of memory");
        return;
    }

    broadcast_add("my_broadcast_name", request->connection, id, mybroadcast_send_data);
    response->data(response, "done");
}
```

### Рассылка сообщений

Для рассылки данных используются методы `broadcast_send_all` и `broadcast_send`.
Метод `broadcast_send_all` рассылает данные всем получателям.

```C
void channel_send(websocketsrequest_t* request, websocketsresponse_t* response) {
    const char* data = "text data";
    size_t length = strlen(data);

    broadcast_send_all("my_broadcast_name", request->connection, data, length);
    response->data(response, "done");
}
```


Метод `broadcast_send` рассылает данные получателям, сравнивая структуры идентификации.

```C
mybroadcast_id_t* mybroadcast_compare_id_create() {
    mybroadcast_id_t* st = malloc(sizeof * st);
    if (st == NULL) return NULL;

    st->base.free = mybroadcast_id_free;
    st->user_id = 1;
    st->project_id = 0;

    return st;
}

int mybroadcast_compare(void* sourceStruct, void* targetStruct) {
    mybroadcast_id_t* sd = sourceStruct;
    mybroadcast_id_t* td = targetStruct;

    return sd->user_id == td->user_id;
}

void channel_send(websocketsrequest_t* request, websocketsresponse_t* response) {
    const char* data = "text data";
    size_t length = strlen(data);
    mybroadcast_id_t* id = mybroadcast_compare_id_create();
    if (id == NULL) {
        response->data(response, "out of memory");
        return;
    }

    broadcast_send("my_broadcast_name", request->connection, data, length, id, mybroadcast_compare);
    response->data(response, "done");
}
```

## Клиент

### Установка соединения

Подключитесь к серверу и отправьте запрос к ресурсу `channel-join` на присоединение к каналу.

```js
let socket = new WebSocket("wss://cpdy.io/wss", "resource");
socket.onopen = (event) => {
    socket.send("GET /channel-join")
}
socket.onmessage = (event) => {
    console.log(event.data)
}
```

Теперь вы будете получать сообщения, поступающие в канал.

### Отправка сообщения

Для отправки сообщения необходимо отправить запрос к ресурсу\
`channel-send-message` с полезной нагрузкой.

```js
socket.send("POST /channel-send-message new message")
```

Клиент, который отправляет сообщение не будет получать сообщение из канала.