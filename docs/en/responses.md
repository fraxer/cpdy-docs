---
outline: deep
description: Forming a server response, setting a status code, adding response headers, redirects, sending a file
---

# Responses

When the application finishes processing the request, it generates a response object and sends it to the user. The response object contains data such as the HTTP status code, HTTP headers, and the response body. The ultimate goal of developing a Web application is to create response objects for various requests.

In most cases, you will be dealing with the `response` application component, which is a `http1response_t` structure.

## Status code

The first thing you do when building a response is determine if the request was successfully processed. This is done by setting the `status_code` property to a value that can be one of the valid HTTP status codes. For example, to indicate that a request was successfully processed, you can set the status code value to 200:

```C
void get(http1request_t* request, http1response_t* response) {
    response->statusCode = 200;
    response->data(response, "Ok");
}
```

However, in most cases an explicit setting is not required, since the default value of `status_code` is 200. If you need to indicate that a request has failed, you can return a standard response:

```C
void get(http1request_t* request, http1response_t* response) {
    int error = 1;
    if (error) {
        response->def(response, 500);
        return;
    }

    response->data(response, "Ok");
}
```

Full list of [HTTP codes](/http-codes)

## HTTP headers

You can send HTTP headers by working with the headers collection of the `response` component:

```C
void get(http1request_t* request, http1response_t* response) {
    // add a Content-Type header. Content-Type headers already present will NOT be overwritten.
    response->header_add(response, 'Content-Type', 'text/plain');

    response->data(response, "Ok");
}
```

## Response body

Most responses should have a body containing what you want to show users.

If you already have a formatted string for the body, you can pass it to the `data` method of the `response` component

```C
void get(http1request_t* request, http1response_t* response) {
    response->data(response, "Hello world!");
}
```

If your data needs to be formatted before being sent to end users, you should set the `Content-type` header.

```C
void get(http1request_t* request, http1response_t* response) {
    response->header_add(response, 'Content-Type', 'application/json');

    response->data(response, "{\"message\": \"This is json\"}");
}
```

## Browser redirect

The browser redirect is based on sending the Location HTTP header.

You can redirect the user's browser to a URL by calling the `redirect` method. This method uses the specified URL as the value of the Location header and returns a response.

```C
void get(http1request_t* request, http1response_t* response) {
    response->redirect(response, "/new-page", 301);
}
```

In code outside of action methods, you must manually set the `Location` header and call the `data` method immediately after it. So you can be sure that the answer will be correctly formed.

## Sending files

Like browser redirection, file upload is another feature based on specific HTTP headers. Cpdy provides a `file` method for handling file upload tasks.
The `file` method sends an existing file stream to the client as a file.

```C
void get(http1request_t* request, http1response_t* response) {
    response->file(response, "/path/image.jpg");
}
```

To make sure that no unwanted content is added to the response, you do not need to call the `data` method when calling the `file` method.

## Sending a response

The content of the response is not sent to the user until the `data` or `file` methods are called. To send a response, you must call one of these methods at the end of the handler, otherwise the client will never wait for a response.
