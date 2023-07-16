---
outline: deep
description: Примеры работы с базами данных
---

# Примеры работы с базами данных

## PostgreSQL или MySQL

```C
// handlers/indexpage.c
#include "http1.h"
#include "db.h"

void db(http1request_t* request, http1response_t* response) {
    dbinstance_t dbinst = dbinstance(request->database_list(request), "postgresql");

    if (!dbinst.ok) {
        response->data(response, "db not found");
        return;
    }

    dbresult_t result = dbquery(&dbinst, "SELECT * FROM \"user\" LIMIT 3; SELECT * FROM \"news\";");

    if (!dbresult_ok(&result)) {
        response->data(response, dbresult_error_message(&result));
        goto failed;
    }

    do {
        for (int row = 0; row < dbresult_query_rows(&result); row++) {
            for (int col = 0; col < dbresult_query_cols(&result); col++) {
                const db_table_cell_t* field = dbresult_cell(&result, row, col);

                printf("%s | ", field->value);
            }
            printf("\n");
        }
        printf("\n");

        dbresult_row_first(&result);
        dbresult_col_first(&result);
    } while (dbresult_query_next(&result));

    response->data(response, "Done");

    failed:

    dbresult_free(&result);
}
```

```C
void db_field(http1request_t* request, http1response_t* response) {
    dbinstance_t dbinst = dbinstance(request->database_list(request), "mysql");

    if (!dbinst.ok) {
        response->data(response, "db not found");
        return;
    }

    dbresult_t result = dbquery(&dbinst, "select * from site limit 1;");

    if (!dbresult_ok(&result)) {
        response->data(response, dbresult_error_message(&result));
        goto failed;
    }

    if (dbresult_query_rows(&result) == 0) {
        response->data(response, "No results");
        goto failed;
    }

    db_table_cell_t* field = dbresult_field(&result, "domain");

    if (!field) {
        response->data(response, "Field domain not found");
        goto failed;
    }

    response->data(response, field->value);

    failed:

    dbresult_free(&result);
}
```

## Redis

```C
void db_redis(http1request_t* request, http1response_t* response) {
    dbinstance_t dbinst = dbinstance(request->database_list(request), "redis");

    if (!dbinst.ok) {
        response->data(response, "db not found");
        return;
    }

    // dbresult_t result = dbquery(&dbinst, "SET testkey testvalue");
    dbresult_t result = dbquery(&dbinst, "GET testkey");

    if (!dbresult_ok(&result)) {
        response->data(response, dbresult_error_message(&result));
        goto failed;
    }

    const db_table_cell_t* field = dbresult_field(&result, NULL);

    response->data(response, field->value);

    failed:

    dbresult_free(&result);
}
```
