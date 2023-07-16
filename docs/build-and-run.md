---
outline: deep
description: Сборка проекта из исходного кода, расположение обработчиков, структура проекта, запуск приложения
---

# Сборка и запуск

```bash
# Клонирование репозитория и переход в директорию проекта
git clone git@github.com:fraxer/server.git;
cd server;
# Настройка проекта и создание системы сборки
cmake -DINCLUDE_POSTGRESQL=yes -DINCLUDE_MYSQL=yes -DINCLUDE_REDIS=yes ..;
# Вызов системы сборки, чтобы скомпилировать/залинковать проект
cmake --build .;
# Запуск приложения
exec/cpdy -c /var/www/server/config.json;
```

## Режимы сборки

* `Debug` - оптимизация отключена, включена отладочная информация
* `Release` - оптимизация скорости выполнения, исключена отладочная информация
* `MinSizeRel` - оптимизация размера бинарных файлов, исключена отладочная информация
* `RelWithDebInfo` - оптимизация скорости выполнения, включена отладочная информация

```bash
cmake -DCMAKE_BUILD_TYPE:STRING=Debug -DINCLUDE_REDIS=yes ..;
```

## Компилятор

Укажите конкретную версию компилятора в случае необходимости

```bash
cmake -DCMAKE_C_COMPILER:FILEPATH=/usr/bin/gcc-12 ..;
```

## Обработчики

Обработчики находятся в директории `handlers`.

```
handlers/
    CMakeLists.txt
    indexpage.c
    wsindexpage.c
```

## Сборка

Скомпилированные файлы расположены в директории `build/exec`.

```
handlers/
    libindexpage.so
    libwsindexpage.so
    ...
migrations/
    s1/
        lib2023-04-04_17-55-00_create_users_table.so
        ...
    ...
cpdy
migrate
```
