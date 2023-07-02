---
outline: deep
---

# Файл конфигурации

## Секция main

### workers <Badge type="info" text="число"/>

Создаёт потоки для обработки соединений, чтения/записи данных между клиентом и сервером.

### threads <Badge type="info" text="число"/>

Создаёт потоки для обработки запросов и формирования тела ответа.

### reload <Badge type="info" text="soft | hard"/>

Режим перезагрузки. 

* `soft` - перезагрузка приложения с удержанием активных соединений.
* `hard` - перезагрузка приложения с принудительным закрытием соединений.

### read_buffer <Badge type="info" text="число"/>

Размер буфера для чтения и записи данных в сокет. Указывается в байтах.

### client_max_body_size <Badge type="info" text="число"/>

Максимальный размер загружаемого контента в байтах.

### tmp <Badge type="info" text="строка"/>

Путь до директории временных файлов.

### gzip <Badge type="info" text="массив строк"/>

Перечень mime-типов для сжатия. Если сжатие контента не требуется - оставьте поле пустым.

## Секция migrations

### source_directory <Badge type="info" text="строка"/>

Путь до директории с миграциями.

## Секция servers

В секции перечисляется список серверов.

### domains <Badge type="info" text="массив строк"/>

В перечне доменов можно указать полное имя домена или шаблон.

* `example.com`
* `*.example.com`
* `s(\\d+).example.com`
* `s(.*).example.com`

Символ (*) может указываться без точки только в начале или конце шаблона. Это было сделано для простоты указания поддоменов.

В остальных случаях шаблон задаётся как регулярное выражение.

### ip <Badge type="info" text="строка"/>

Ip-адрес сервера, например `127.0.0.1`

### port <Badge type="info" text="число"/>

Порт сервера. Обычно `80` или `443`.

### root <Badge type="info" text="строка"/>

Абсолютный путь до `webroot` директории, где находятся ваши страницы, скрипты, стили и т.д.

### index <Badge type="info" text="строка"/>

Поиск файла по умолчанию, если указана директория в качестве ресурса.

При запросе к ресурсу `https://example.com/directory` сервер сформирует адрес `https://example.com/directory/index.html`

### http <Badge type="info" text="объект"/>

В секции указан перечень маршрутов с прикрепленными к ним обработчиками и список редиректов.

#### routes <Badge type="info" text="объект"/>

Маршруты задаются в виде объектов.

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
            "POST": ["/var/www/server/build/exec/handlers/libindexpage.so", "post"],
            "DELETE": ["/var/www/server/build/exec/handlers/libindexpage.so", "delete"]
        },
        "/update": {
            "PATCH": ["/var/www/server/build/exec/handlers/libupdatepage.so", "patch"]
        }
        ...
    },
    ...
},
...
```

Путь до ресурса можно указать в виде регулярного выражения.

#### redirects <Badge type="info" text="объект"/>

Редиректы представлены в виде пары `существующий маршрут`: `новый маршрут`.

```json
{
    ...
    "redirects": {
        "/number/(\\d)/(\\d)": "/digit/{1}/{2}"
    },
    ...
}
```

Существующий маршрут - это шаблон регулярного выражения или точный путь к ресурсу.

Новый маршрут - путь к ресурсу с возможностью вставки группы символов из регулярного выражения.

Для этого используются фигурные скобки с номером группы `{1}`.

Номер группы начинается с `1`.

### websockets <Badge type="info" text="объект"/>

Структура секции такая же как в http.

### databases <Badge type="info" text="объект"/>

* ip <Badge type="info" text="общий"/> - ip-адрес сервера БД
* port <Badge type="info" text="общий"/> - порт
* user <Badge type="info" text="общий"/> - логин пользователя
* password <Badge type="info" text="общий"/> - пароль пользователя

* dbname <Badge type="info" text="postgresql, mysql"/> - название базы данных
* connection_timeout <Badge type="info" text="postgresql"/> - длительность ожидания в сек. перед установкой соединения.
* migration <Badge type="info" text="postgresql, mysql"/> - применять миграции для базы данных
* dbindex <Badge type="info" text="redis"/> - индекс базы данных

```json
...
"databases": {
    "postgresql": [
        {
            "ip": "127.0.0.1",
            "port": 5432,
            "dbname": "dbname",
            "user": "root",
            "password": "",
            "connection_timeout": 3,
            "migration": true
        }
    ],
    "mysql": [
        {
            "ip": "127.0.0.1",
            "port": 3306,
            "dbname": "dbname",
            "user": "root",
            "password": "",
            "migration": false
        }
    ],
    "redis": [
        {
            "ip": "127.0.0.1",
            "port": 6379,
            "dbindex": 0,
            "user": "",
            "password": ""
        }
    ],
},
...
```

### tls <Badge type="info" text="объект"/>

Для конфигурации защищенного соединения необходимо указать путь до сертификата, приватного ключа и перечислить шифры.

Если защищиенное соединение не требуется, то удалите секцию из конфигурационного файла.

#### fullchain <Badge type="info" text="строка"/>

Путь до сертификата или цепочки сертификатов.

#### private <Badge type="info" text="строка"/>

Путь до файла с приватным ключом.

#### ciphers <Badge type="info" text="строка"/>

Список шифров разделенных пробелами.

## Секция mimetypes

В секции указывается перечень mime-типов и соответствующие им расширения файлов.

## Пример файла

```json
{
    "main": {
        "workers": 1,
        "threads": 1,
        "reload": "hard",
        "read_buffer": 16384,
        "client_max_body_size": 110485760,
        "tmp": "/tmp",
        "gzip": [
            "text/plain",
            "text/html",
            "text/css",
            "application/javascript",
            "application/json"
        ]
    },
    "migrations": {
        "source_directory": "/var/www/server/migrations"
    },
    "servers": {
        "s1": {
            "domains": [
                "example1.com",
                "*.example1.com",
                "(a1|a2|a3).example1.com",
                "(.1|.*|a3).example1.com"
            ],
            "ip": "127.0.0.1",
            "port": 80,
            "root": "/var/www/www.example1.com/web",
            "index": "index.html",
            "http": {
                "routes": {
                    "/": {
                        "GET": ["/var/www/server/build/exec/handlers/libindexpage.so", "get"]
                    },
                    "/wss": {
                        "GET": ["/var/www/server/build/exec/handlers/libindexpage.so", "websocket"]
                    }
                },
                "redirects": {
                    "/section1/(\\d+)/section2/(\\d+)/section3": "/one/{1}/two/{2}/three",
                    "/one/\\d+/two/\\d+/three": "/",
                    "/user": "/persons",
                    "/user(.*)/(\\d)": "/user-{1}-{2}"
                }
            },
            "websockets": {
                "routes": {
                    "/": {
                        "GET": ["/var/www/server/build/exec/handlers/libwsindexpage.so", "echo"]
                    }
                }
            },
            "databases": {
                "postgresql": [
                    {
                        "ip": "127.0.0.1",
                        "port": 5432,
                        "dbname": "dbname",
                        "user": "root",
                        "password": "",
                        "connection_timeout": 3,
                        "migration": true
                    }
                ],
                "mysql": [
                    {
                        "ip": "127.0.0.1",
                        "port": 3306,
                        "dbname": "dbname",
                        "user": "root",
                        "password": "",
                        "migration": false
                    }
                ],
                "redis": [
                    {
                        "ip": "127.0.0.1",
                        "port": 6379,
                        "dbindex": 0,
                        "user": "",
                        "password": ""
                    }
                ]
            },
            "tls": {
                "fullchain": "/var/www/server/cert/fullchain.pem",
                "private": "/var/www/server/cert/privkey.pem",
                "ciphers": "TLS_AES_256_GCM_SHA384 ..."
            }
        },
        "s2": {
            "domains": [
                "example2.com:8080"
            ],
            "ip": "127.0.0.1",
            "port": 8080,
            "root": "/var/www/example2.com/web",
            "index": "index.html",
            "http": {
                "routes": {
                    "/": {
                        "GET": ["/var/www/server/build/exec/handlers/libindexpage.so", "index"]
                    }
                }
            }
        }
    },
    "mimetypes": {
        "text/plain": ["txt"],
        "text/html": ["html", "htm", "shtml"],
        "text/css": ["css"],
        "text/xml": ["xml"],
        "image/gif": ["gif"],
        "image/jpeg": ["jpeg", "jpg"],
        "application/json": ["json"],
        "application/javascript": ["js"],

        "image/png": ["png"],
        "image/svg+xml": ["svg", "svgz"],
        "image/tiff": ["tif", "tiff"],
        "image/vnd.wap.wbmp": ["wbmp"],
        "image/webp": ["webp"],
        "image/x-icon": ["ico"],
        "image/x-jng": ["jng"],
        "image/x-ms-bmp": ["bmp"],

        "audio/mpeg": ["mp3"],
        "audio/ogg": ["ogg"],
        "audio/x-m4a": ["m4a"],

        "video/mp4": ["mp4"],
        "video/mpeg": ["mpeg", "mpg"],
        "video/quicktime": ["mov"],
        "video/webm": ["webm"],
        "video/x-ms-wmv": ["wmv"],
        "video/x-msvideo": ["avi"]
    }
}
```