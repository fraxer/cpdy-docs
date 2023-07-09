---
outline: deep
---

# Getting data from the client

Cpdy provides several methods for extracting data from a request.

### payload

`char*(*payload)(struct http1request*);`

Retrieves all available data from the request body as a string.

Returns a pointer of type `char` to dynamically allocated memory.

After working with the data, be sure to free the memory.

```C
#include "http1.h"

void post(http1request_t* request, http1response_t* response) {
    char* payload = request->payload(request);

    if (payload == NULL) {
        response->data(response, "Payload not found");
        return;
    }

    response->data(response, payload);

    free(payload);
}
```

### payloadf

`char*(*payloadf)(struct http1request*, const char*);`

Retrieves data by key from the request body as a string. Used when encoding `multipart/form-data` and `application/x-www-form-urlencoded` data.

Returns a pointer of type `char` to dynamically allocated memory.

After working with the data, be sure to free the memory.

```C
#include "http1.h"

void post(http1request_t* request, http1response_t* response) {
    char* data = request->payloadf(request, "mydata");
    char* text = request->payloadf(request, "mytext");

    if (data == NULL) {
        response->data(response, "Data not found");
        goto failed;
    }

    if (text == NULL) {
        response->data(response, "Text not found");
        goto failed;
    }

    response->data(response, "Payload processed");

    failed:

    if (data) free(data);
    if (text) free(text);
}
```

### payload_file

`http1_payloadfile_t(*payload_file)(struct http1request*);`

Extracts all available data from the request body and wraps it in a `http1_payloadfile_t` structure.

Returns the `http1_payloadfile_t` structure. The structure has a `name` field for storing the name of the file, a `save` method for saving the file to a directory with the specified file name, and a `read` method for extracting the contents of the file as a string.

The `read` method allocates dynamic memory to store the string, so you need to deallocate the memory at the pointer.

```C
#include "http1.h"

void post(http1request_t* request, http1response_t* response) {
    http1_payloadfile_t payloadfile = request->payload_file(request);

    if (!payloadfile.ok) {
        response->data(response, "file not found");
        return;
    }

    if (!payloadfile.save(&payloadfile, "files", "file.txt")) {
        response->data(response, "Error save file");
        return;
    }

    char* data = payloadfile.read(&payloadfile);

    response->data(response, data);

    free(data);
}
```

### payload_filef

`http1_payloadfile_t(*payload_filef)(struct http1request*);`

Extracts data by key from the request body and wraps it in a `http1_payloadfile_t` structure. Used when encoding `multipart/form-data` data.

Returns the `http1_payloadfile_t` structure. The structure has a `name` field for storing the name of the file, a `save` method for saving the file to a directory with the specified file name, and a `read` method for extracting the contents of the file as a string.

The `read` method allocates dynamic memory to store the string, so you need to deallocate the memory at the pointer.

```C
#include "http1.h"

void post(http1request_t* request, http1response_t* response) {
    http1_payloadfile_t payloadfile = request->payload_filef(request, "myfile");

    if (!payloadfile.ok) {
        response->data(response, "file not found");
        return;
    }

    const char* filenameFromPayload = NULL;
    if (!payloadfile.save(&payloadfile, "files", filenameFromPayload)) {
        response->data(response, "Error save file");
        return;
    }

    char* data = payloadfile.read(&payloadfile);

    response->data(response, data);

    free(data);
}
```

### payload_json

`jsondoc_t*(*payload_json)(struct http1request*);`

Extracts all available data from the request body and creates a json document `jsondoc_t`.

Returns a pointer of type `jsondoc_t`.

After working with the json document, you need to free the memory.

```C
#include "http1.h"
#include "json.h"

void post(http1request_t* request, http1response_t* response) {
    jsondoc_t* document = request->payload_json(request);

    if (!json_ok(document)) {
        response->data(response, json_error(document));
        goto failed;
    }

    jsontok_t* object = json_root(document);
    if (!json_is_object(object)) {
        response->data(response, "is not object");
        goto failed;
    }

    json_object_set(object, "mykey", json_create_string(document, "Hello"));

    response->header_add(response, "Content-Type", "application/json");

    response->data(response, json_stringify(document));

    failed:

    json_free(document);
}
```

### payload_jsonf

`jsondoc_t*(*payload_jsonf)(struct http1request*, const char*);`

Extracts data by key from the request body and creates a json document `jsondoc_t`. Used when encoding `multipart/form-data` data.

Returns a pointer of type `jsondoc_t`.

After working with the json document, you need to free the memory.

```C
#include "http1.h"
#include "json.h"

void post(http1request_t* request, http1response_t* response) {
    jsondoc_t* document = request->payload_jsonf(request, "myjson");

    if (!json_ok(document)) {
        response->data(response, json_error(document));
        goto failed;
    }

    jsontok_t* object = json_root(document);
    if (!json_is_object(object)) {
        response->data(response, "is not object");
        goto failed;
    }

    json_object_set(object, "mykey", json_create_string(document, "Hello"));

    response->header_add(response, "Content-Type", "application/json");

    response->data(response, json_stringify(document));

    failed:

    json_free(document);
}
```

