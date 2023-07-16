---
outline: deep
description: Processing http requests, extracting cookies and request parameters, processing payloads, working with headers
---

# Requests

Requests made to an application are represented as a `http1request_t` structure that provides information about the HTTP request parameters - headers, cookie, method, etc.

## GET request parameters

To get query parameters, you must call the `query()` method of the `request` component

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

## Parameters of POST, PUT, PATCH requests

Unlike GET parameters, parameters that were passed via POST, PUT, PATCH, etc. sent in the body of the request.

They are accessed through methods:

* payloadf()
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

Processing of incoming data is described in detail in the section [Receiving data from the client](/payload)

## Request methods

You can get the name of the HTTP method used in the current request by accessing the `request->method` property.

The following methods are available:

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

## Request URL

The `request` component provides three properties for working with urls:

* uri - will return the relative address of the resource `/resource.html?id=100&text=hello`.
* path - will return the path to the resource without parameters `/resource.html`.
* ext - will return the extension from the resource name `html` or an empty string.

The length of each property is also calculated:

* uri_length
* path_length
* ext_length

```C
void get(http1request_t* request, http1response_t* response) {
    if (request->uri_length > 4096) {
        response->def(response, 414);
        return;
    }

    response->data(response, request->uri);
}
```

## HTTP headers

You can get information about HTTP headers using the methods

`request->header()` or `request->headern()`. For example,

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
