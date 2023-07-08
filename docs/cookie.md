---
outline: deep
---

# Cookie

Куки позволяют сохранять пользовательские данные между запросами. Cpdy инкапсулирует куки в структуру `http1_cookie_t`, что дает возможность обращаться к ним через метод `cookie` и дает дополнительное удобство в работе.

## Чтение cookie

Получить куки из текущего запроса можно следующим образом:

```C
void get(http1request_t* request, http1response_t* response) {
    const char* token = request->cookie(request, "token");

    if (token == NULL) {
        response->data(response, "Token not found");
        return;
    }

    response->data(response, token);
}
```

## Отправка cookie

Отправить куку конечному пользователю можно через добавление заголовка `Set-Cookie`:

```C
void get(http1request_t* request, http1response_t* response) {
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

    response->data(response, "Token successfully added");
}
```
