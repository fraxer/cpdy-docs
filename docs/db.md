---
outline: deep
description: Настройка подключения к базе данных, получение доступа к экземпляру базы данных и выполнение sql-запроса
---

# Создание подключения к базе данных

Для доступа к базе данных, вы сначала должны подключится к ней.

Создайте секцию в конфигурационном файле. Конфигурация позволяет указать несколько серверов.
Новые соединения будут равномерно распределяться на каждый сервер базы данных.

```json
"databases": {
    "postgresql": [
        {
            "ip": "127.0.0.1",
            "port": 5432,
            "dbname": "dbname",
            "user": "root",
            "password": "",
            "connection_timeout": 3,
            "migration": true
        }
    ],
    ...
}
```

Теперь вы можете получить доступ к подключению к БД с помощью выражения

```C
dbinstance_t dbinst = dbinstance(request->database_list(request), "postgresql");
```

Доступ к экземляру базы данных осуществляется через компонент `request`, т.к. для каждого сервера свой перечень баз данных.

> Фактическое соединение с базой данных будет установлено только при первом вызове метода `dbquery`.

## Выполнение SQL запросов

После создания экземпляра соединения, вы можете выполнить SQL запрос.

Следующий пример показывает способ получения данных из базы дынных:

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

> Данные всегда извлекаются как строки, даже если тип поля в базе данных является числовым.

PostgreSQL и MySQL поддерживают выполнение нескольких операторов в одном SQL-запросе как в примере выше.

Для перехода к следующему набору результатов используется метод `dbresult_query_next`.

## Привязка параметров

При создании команды из SQL запроса с параметрами, вы должны использовать привязку параметров, например,

```C
dbresult_t result = dbquery(&dbinst, "SELECT * FROM \"user\" WHERE id > %d AND name <> '%s'", 10, "Alex");
```

> Обязательно проверяйте параметры для предотвращения атак через SQL инъекции. 

В SQL запрос, вы можете встраивать один или несколько параметров. Полный список спецификаторов дотупен на странице описания функции [printf](https://cplusplus.com/reference/cstdio/printf/).

## Выполнение Не-SELECT запросов

INSERT, UPDATE, DELETE и другие операторы выполняются точно так же через метод `dbquery`, но могут не содержать данных для вывода.
