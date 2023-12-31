---
outline: deep
description: Отслеживание изменений в структуре в базе данных, управление миграциями
---

# Миграции баз данных

В ходе разработки и ведения баз данных приложений, которые управляют данными, структуры используемых баз данных развиваются, как и исходный код приложений. Например, при разработке приложения, в будущем может оказаться необходимой новая таблица; уже после того, как приложение будет развернуто в рабочем режиме (продакшене), также может быть обнаружено, что для повышения производительности запросов должен быть создан определённый индекс; и так далее. В связи с тем, что изменение структуры базы данных часто требует изменение исходного кода, cpdy поддерживает так называемую возможность миграции баз данных, которая позволяет отслеживать изменения в базах данных при помощи терминов миграции баз данных, которые являются системой контроля версий вместе с исходным кодом.

Cpdy предоставляет набор инструментов для миграций из командной строки, которые позволяют:

* Создавать новые миграции.
* Применять миграции.
* Отменять миграции.

Все эти инструменты доступны через программу migrate, которая компилируется совместно с cpdy. В этом разделе описано, как выполнять различные задачи, используя эти инструменты.

> Миграции могут не только изменять схему базы данных, но и приводить данные в соответствие с новой схемой.

## Создание миграций

Чтобы создать новую миграцию, выполните следующую команду:

```bash
migrate s1 create create_users_table /path/config.json
```

* s1 - название сервера, к которому применяется миграция.
* create - команда на создание новой миграции.
* create_users_table - название миграции.
* /path/config.json - путь до конфигурационного файла.

Приведенная выше команда создаст новый обработчик в директории `migrations/s1` с именем файла `2023-07-01_20-00-00_create_users_table.c`. Файл содержит шаблон кода для применения миграции и отката:

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

В классе миграции, вы должны прописать код в методе up() когда делаете изменения в структуре базы данных. Вы также можете написать код в методе down(), чтобы отменить сделанные up() изменения. Метод up вызывается для обновления базы данных с помощью данной миграции, а метод down() вызывается для отката изменений базы данных. Следующий код показывает как можно реализовать класс миграции, чтобы создать таблицу news:

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

> Не все миграции являются обратимыми. Например, если метод up() удаляет строку из таблицы, возможно что у вас уже не будет возможности вернуть эту строку методом down().


## Применение Миграций

Для обновления базы данных до последней структуры, вы должны применить все новые миграции, используя следующую команду:

```bash
migrate s1 up /path/config.json

# укажите all для явного применения всех миграций
migrate s1 up all /path/config.json
```

* s1 - название сервера, к которому применяется миграция.
* up - команда на применение миграции.
* all - количество миграций, которое нужно применить. В данном случае все.
* /path/config.json - путь до конфигурационного файла.

Можно применять миграции по отдельности, указав явно количество миграций для выполнения за вызов `migrate`.

```bash
migrate s1 up 1 /path/config.json;
migrate s1 up 3 /path/config.json;
```

Для каждой миграции которая была успешно проведена, эта команда будет вставлять строку в таблицу базы данных с именем migration записав успешное проведение миграции. Это позволяет инструменту миграции выявлять какие миграции были применены, а какие - нет.

> Инструмент миграции автоматически создаст таблицу migration в базе данных указанной в конфигурационном файле.

Миграции можно применять только к определенным базам данных. Для этого в конфигурационном файле у каждой базы данных есть свойство `migration`. Установите значение `true`, чтобы для выбранной базы данных выполнялись миграции.

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

## Отмена Миграций

Чтобы отменить (откатить) одну или несколько миграций, которые применялись ранее, нужно запустить следующую команду:

```bash
migrate s1 down /path/config.json;
migrate s1 down 2 /path/config.json;
migrate s1 down all /path/config.json;
```

> Не все миграции являются обратимыми. При попытке отката таких миграций произойдёт ошибка и остановится весь процесс отката.

