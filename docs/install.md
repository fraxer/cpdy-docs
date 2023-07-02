---
outline: deep
---

# Установка зависимостей

GCC, Cmake, PCRE, Zlib и OpenSSL обязательны к установке.

MySQL, PostgreSQL, Redis устанавливаются по желанию.

Начните с обновления списка пакетов:

```bash
sudo apt update
```

## GCC

Установите пакет build-essential, набрав:

```bash
sudo apt install build-essential
```

Команда устанавливает много новых пакетов, включая `gcc`, `g++` and `make`

Чтобы убедиться, что компилятор GCC успешно установлен, используйте команду gcc --version, которая выводит версию GCC.

```bash
gcc --version
```

Теперь GCC установлен в вашей системе, и вы можете начать его использовать.

## Cmake

### Менеджер пакетов

Установка cmake из официальных репозиториев выполняется командой:

```bash
sudo apt install cmake
```

### Сборка из исходных файлов

Скачайте архив с официального сайта:

```bash
wget https://github.com/Kitware/CMake/releases/download/v3.27.0-rc3/cmake-3.27.0-rc3.tar.gz
```

Распакуйте:

```bash
tar -zxvf cmake-3.27.0-rc3.tar.gz
```

Перейдите в распакованную директорию:

```bash
cd cmake-3.27.0-rc3
```

Запустите процесс сборки

```bash
./bootstrap
```

Запустите процесс установки

```bash
make
```

Скопируйте скомпилированные файлы в соответствующие места

```bash
make install
```


## PCRE

Установка pcre из официальных репозиториев выполняется командой:

```bash
sudo apt install libpcre3-dev
```

## Zlib

### Менеджер пакетов

Установка zlib из официальных репозиториев выполняется командой:

```bash
sudo apt install zlib1g-dev
```

### Сборка из исходных файлов

Скачайте архив с официального сайта:

```bash
wget https://zlib.net/zlib-1.2.13.tar.gz
```

Распакуйте:

```bash
tar -zxvf zlib-1.2.13.tar.gz
```

Перейдите в распакованную директорию:

```bash
cd zlib-1.2.13
```

Запустите процесс сборки

```bash
./configure
```

Запустите процесс установки

```bash
make
```

Скопируйте скомпилированные файлы в соответствующие места

```bash
make install
```

## OpenSSL

Установка openssl из официальных репозиториев выполняется командой:

```bash
sudo apt install openssl
```

## MySQL

```bash
sudo apt install mysql-server
```

Подробная инструкция представлена на [DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04)

## PostgreSQL

```bash
sudo apt install postgresql postgresql-contrib
```

Подробная инструкция представлена на [DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-20-04-quickstart)

## Redis

Добавьте репозиторий в индекс apt:

```bash
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
```

Затем установите:

```bash
sudo apt-get install redis
```

Подробная инструкция представлена на [Redis](https://redis.io/docs/getting-started/installation/install-redis-on-linux/)