---
outline: deep
---

# Ответы

В большинстве случаев вам придется иметь дело с компонентом приложения `response`, который представляет собой структуру `websocketsresponse_t`.

## Отправка ответа

Содержимое ответа не отправляется пользователю до вызова методов `text`, `binary` или `file`. Чтобы отправить ответ небходимо вызвать в конце обработчика один из этих методов, иначе клиент никогда не дождется ответа.

Протокол Websockets позволяет передавать и принимать данные в текстовом и бинарном форматах.

Прием и передача данных всегда должны быть в одном формате.

Текстовый формат

```C
void get(websocketsrequest_t* request, websocketsresponse_t* response) {
    response->text(response, "{\"message\": \"This is json\"}");
}
```

Бинарный формат

```C
void get(websocketsrequest_t* request, websocketsresponse_t* response) {
    response->binary(response, "Text in binary format");
}
```

## Отправка файлов

Cpdy предоставляет метод `file` для решения задач по отправке файлов по протоколу WebSockets.
Файл отправляется клиенту в бинарном формате.

```C
void get(websocketsrequest_t* request, websocketsresponse_t* response) {
    response->file(response, "/path/image.jpg");
}
```

Чтобы быть уверенным, что к ответу не будет добавлено никакое нежелательное содержимое, при вызове метода `file` не нужно вызывать метод `text` или `binary`.
