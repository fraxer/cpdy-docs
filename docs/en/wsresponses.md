---
outline: deep
---

# Responses

In most cases, you will be dealing with the `response` application component, which is a `websocketsresponse_t` structure.

## Sending a response

The content of the response is not sent to the user until the `text`, `binary`, or `file` methods are called. To send a response, you must call one of these methods at the end of the handler, otherwise the client will never wait for a response.

The Websockets protocol allows you to send and receive data in text and binary formats.

Receiving and transmitting data must always be in the same format.

Text format

```C
void get(websocketsrequest_t* request, websocketsresponse_t* response) {
    response->text(response, "{\"message\": \"This is json\"}");
}
```

Binary format

```C
void get(websocketsrequest_t* request, websocketsresponse_t* response) {
    response->binary(response, "Text in binary format");
}
```

## Sending files

Cpdy provides the `file` method for solving the problems of sending files using the WebSockets protocol.
The file is sent to the client in binary format.

```C
void get(websocketsrequest_t* request, websocketsresponse_t* response) {
    response->file(response, "/path/image.jpg");
}
```

To be sure that no unwanted content is added to the response, when calling the `file` method, you do not need to call the `text` or `binary` method.
