---
outline: deep
---

# Маршрутизация

Маршрутизация применяется в запросах для протоколов HTTP и WebSockets. Правила описания маршрутов для обоих протоколов одинаковые.

```json
...
"http": {
    "routes": {
        // Путь до ресурса
        "/": {
            // Доступные методы взаимодействия с ресурсом
            "GET": [
                // Путь до разделяемого файла с обработчиками для ресурса
                "/var/www/server/build/exec/handlers/libindexpage.so",
                // Название метода (функции), который будет вызван запросом
                "get"
            ],
            "POST": ["/var/www/server/build/exec/handlers/libindexpage.so", "post"]
        },
        "/admin/users": {
            "GET": ["/var/www/server/build/exec/handlers/libindexpage.so", "users_list"],
        },
        "/admin/users/{id|\\d+}": {
            "PATCH": ["/var/www/server/build/exec/handlers/libindexpage.so", "users_update"]
        },
        "^/managers/{name|[a-z]+}$": {
            "PATCH": ["/var/www/server/build/exec/handlers/libindexpage.so", "managers_update"]
        },
        "/wss": {
            "GET": ["/var/www/server/build/exec/handlers/libindexpage.so", "websocket"]
        }
    },
    ...
},
"websockets": {
    "routes": {
        "/": {
            "GET": ["/var/www/server/build/exec/handlers/libwsindexpage.so", "get"],
            "POST": ["/var/www/server/build/exec/handlers/libwsindexpage.so", "post"],
            "PATCH": ["/var/www/server/build/exec/handlers/libwsindexpage.so", "path"],
            "DELETE": ["/var/www/server/build/exec/handlers/libwsindexpage.so", "delete"]
        }
    }
},
...
```

Путь до ресурса может быть указан точным значением `/admin/users` или псевдо-регулярным выражением `/admin/users/{id|\\d+}`.

Шаблонные параметры можно извлечь с помощью метода `query`, например:

```C
const char* id = request->query(request, "id");
```
