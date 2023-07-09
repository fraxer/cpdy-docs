---
outline: deep
---

# Cookie

Cookies allow user data to be saved between requests. Cpdy encapsulates cookies in the `http1_cookie_t` structure, which makes it possible to access them through the `cookie` method and provides additional convenience in work.

## Get cookie

You can get cookies from the current request like this:

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

## Set cookie

You can send a cookie to an end user by adding a `Set-Cookie` header:

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
