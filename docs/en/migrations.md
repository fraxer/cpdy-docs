---
outline: deep
---

# Database migrations

As the databases of applications that manage data are developed and maintained, the structures of the databases used evolve, as does the source code of the applications. For example, when developing an application, a new table may be needed in the future; already after the application is deployed in production mode (production), it may also be found that a certain index should be created to improve query performance; and so on. Due to the fact that changing the structure of a database often requires changing the source code, cpdy supports the so-called database migration capability, which allows you to track changes in databases using database migration terms, which are a version control system along with the source code.

Cpdy provides a set of command line migration tools that allow you to:

* Create new migrations.
* Apply migrations.
* Cancel migrations.

All of these tools are available through the migrate program, which is compiled with cpdy. This section describes how to perform various tasks using these tools.

> Migrations can not only change the database schema, but also bring the data in line with the new schema.

## Create migrations

To create a new migration, run the following command:

```bash
migrate s1 create create_users_table /path/config.json
```

* s1 is the name of the server to which the migration is being applied.
* create - command to create a new migration.
* create_users_table - migration name.
* /path/config.json - path to the configuration file.

The above command will create a new handler in the `migrations/s1` directory with the file name `2023-07-01_20-00-00_create_users_table.c`. The file contains a code template to apply the migration and rollback:

```C
#include <stdlib.h>
#include <stdio.h>

#include "dbquery.h"
#include "dbresult.h"

const char* db() { return ""; }

int up(dbinstance_t* dbinst) {
    dbresult_t result = dbquery(dbinst, "");

    if (!dbresult_ok(&result)) {
        printf("%s\n", dbresult_error_message(&result));
        dbresult_free(&result);
        return -1;
    }

    dbresult_free(&result);

    return 0;
}

int down(dbinstance_t* dbinst) {
    dbresult_t result = dbquery(dbinst, "");

    if (!dbresult_ok(&result)) {
        printf("%s\n", dbresult_error_message(&result));
        dbresult_free(&result);
        return -1;
    }

    dbresult_free(&result);

    return 0;
}
```

In the migration class, you must write code in the up() method when you make changes to the database structure. You can also write code in the down() method to undo the changes made by up() . The up method is called to update the database with the given migration, and the down() method is called to roll back the database changes. The following code shows how the migration class can be implemented to create the news table:

```C
#include <stdlib.h>
#include <stdio.h>

#include "dbquery.h"
#include "dbresult.h"

const char* db() { return "postgresql"; }

int up(dbinstance_t* dbinst) {
    dbresult_t result = dbquery(dbinst,
        "CREATE TABLE news"
        "("
            "id    bigserial     NOT NULL PRIMARY KEY, "
            "name  varchar(100)  NOT NULL DEFAULT '', "
            "text  text          NOT NULL DEFAULT '' "
        ")"
    );

    if (!dbresult_ok(&result)) {
        printf("%s\n", dbresult_error_message(&result));
        dbresult_free(&result);
        return -1;
    }

    dbresult_free(&result);
    return 0;
}

int down(dbinstance_t* dbinst) {
    dbresult_t result = dbquery(dbinst, "DROP TABLE news");

    if (!dbresult_ok(&result)) {
        printf("%s\n", dbresult_error_message(&result));
        dbresult_free(&result);
        return -1;
    }

    dbresult_free(&result);
    return 0;
}
```

> Not all migrations are reversible. For example, if the up() method removes a row from a table, you may no longer be able to return that row to the down() method.


## Apply migrations

To update the database to the latest structure, you must apply all new migrations using the following command:

```bash
migrate s1 up /path/config.json

# specify all to explicitly apply all migrations
migrate s1 up all /path/config.json
```

* s1 is the name of the server to which the migration is being applied.
* up - command to apply the migration.
* all - the number of migrations to apply. In this case, everything.
* /path/config.json - path to the configuration file.

You can apply migrations individually by explicitly specifying the number of migrations to run per call to `migrate`.

```bash
migrate s1 up 1 /path/config.json;
migrate s1 up 3 /path/config.json;
```

For each migration that was successfully performed, this command will insert a row into the database table named migration, recording the successful migration. This allows the migration tool to identify which migrations have been applied and which have not.

> The migration tool will automatically create the migration table in the database specified in the configuration file.

Migrations can only be applied to specific databases. To do this, each database has a `migration` property in the configuration file. Set to `true` to run migrations for the selected database.

```json
"databases": {
    "postgresql": [
        {
            ...
            "migration": true
        }
    ],
    ...
}
```

## Cancel migrations

To undo (roll back) one or more migrations that were previously applied, you need to run the following command:

```bash
migrate s1 down /path/config.json;
migrate s1 down 2 /path/config.json;
migrate s1 down all /path/config.json;
```

> Not all migrations are reversible. If you try to rollback such migrations, an error will occur and the entire rollback process will stop.

