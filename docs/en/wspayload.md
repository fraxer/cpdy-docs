---
outline: deep
---

# Getting data from the client

Cpdy provides several methods for extracting data from a request.

### payload

`char*(*payload)(struct websocketsrequest*);`

Retrieves all available data from the request body as a string.

Returns a pointer of type `char` to dynamically allocated memory.

After working with the data, be sure to free the memory.

```C
#include "websockets.h"

void post(websocketsrequest_t* request, websocketsresponse_t* response) {
    char* payload = request->payload(request);

    if (payload == NULL) {
        response->text(response, "Payload not found");
        return;
    }

    response->text(response, payload);

    free(payload);
}
```

### payload_json

`jsondoc_t*(*payload_json)(struct websocketsrequest*);`

Extracts all available data from the request body and creates a json document `jsondoc_t`.

Returns a pointer of type `jsondoc_t`.

After working with the json document, you need to free the memory.

```C
#include "websockets.h"
#include "json.h"

void post(websocketsrequest_t* request, websocketsresponse_t* response) {
    jsondoc_t* document = request->payload_json(request);

    if (!json_ok(document)) {
        response->text(response, json_error(document));
        goto failed;
    }

    jsontok_t* object = json_root(document);
    if (!json_is_object(object)) {
        response->text(response, "is not object");
        goto failed;
    }

    json_object_set(object, "mykey", json_create_string(document, "Hello"));

    response->text(response, json_stringify(document));

    failed:

    json_free(document);
}
```
