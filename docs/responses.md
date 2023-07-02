---
outline: deep
---

# Ответы

Когда приложение заканчивает обработку запроса, оно генерирует объект ответа и отправляет его пользователю. Объект ответа содержит такие данные, как HTTP-код состояния, HTTP-заголовки и тело ответа. Конечная цель разработки Web-приложения состоит в создании объектов ответа на различные запросы.

В большинстве случаев вам придется иметь дело с компонентом приложения `response`, который представляет собой структуру `http1response_t`.

## Код состояния

Первое, что вы делаете при построении ответа, — определяете, был ли успешно обработан запрос. Это реализуется заданием свойству `status_code` значения, которое может быть одним из валидных HTTP-кодов состояния. Например, чтобы показать, что запрос был успешно обработан, вы можете установить значение кода состояния равным 200:

```C
void get(http1request_t* request, http1response_t* response) {
    response->statusCode = 200;
    response->data(response, "Ok");
}
```

Однако в большинстве случаев явная установка не требуется так как значение `status_code` по умолчанию равно 200. Если вам нужно показать, что запрос не удался, вы можете отдавть стандартный ответ:

```C
void get(http1request_t* request, http1response_t* response) {
    int error = 1;
    if (error) {
        response->default(response, 500);
        return;
    }

    response->data(response, "Ok");
}
```

Полный список [HTTP-кодов](/http-codes)

## HTTP-заголовки

Вы можете отправлять HTTP-заголовки, работая с коллекцией заголовков компонента `response`:

```C
void get(http1request_t* request, http1response_t* response) {
    // добавить заголовок Content-Type. Уже имеющиеся Content-Type-заголовки НЕ будут перезаписаны.
    response->header_add(response, 'Content-Type', 'text/plain');

    response->data(response, "Ok");
}
```

## Тело ответа

Большинство ответов должны иметь тело, содержащее то, что вы хотите показать пользователям.

Если у вас уже имеется отформатированная строка для тела, вы можете передать её в метод `data` компонента `response`

```C
void get(http1request_t* request, http1response_t* response) {
    response->data(response, "Hello world!");
}
```

Если ваши данные перед отправкой конечным пользователям нужно привести к определённому формату, вам следует установить заголовок `Content-type`.

```C
void get(http1request_t* request, http1response_t* response) {
    response->header_add(response, 'Content-Type', 'application/json');

    response->data(response, "{\"message\": \"This is json\"}");
}
```

## Перенаправление браузера

Перенаправление браузера основано на отправке HTTP-заголовка Location.

Вы можете перенаправить браузер пользователя на URL-адрес, вызвав метод `redirect`. Этот метод использует указанный URL-адрес в качестве значения заголовка Location и возвращает ответ.

```C
void get(http1request_t* request, http1response_t* response) {
    response->redirect(response, "/new-page", 301);
}
```

В коде, находящемся вне методов действий, следует вручную установить заголовок `Location` и непосредственно после него вызвать метод `data`. Так можно быть уверенным, что ответ будет корректно сформирован.

## Отправка файлов

Как и перенаправление браузера, отправка файлов является ещё одной возможностью, основанной на определённых HTTP-заголовках. Cpdy предоставляет метод `file` для решения задач по отправке файлов.
Метод `file` отправляет клиенту существующий файловый поток как файл.

```C
void get(http1request_t* request, http1response_t* response) {
    response->file(response, "/path/image.jpg");
}
```

Чтобы быть уверенным, что к ответу не будет добавлено никакое нежелательное содержимое, при вызове метода `file` не нужно вызывать метод `data`.

## Отправка ответа

Содержимое ответа не отправляется пользователю до вызова методов `data` или `file`. Чтобы отправить ответ небходимо вызвать в конце обработчика один из этих методов, иначе клиент никогда не дождется ответа.