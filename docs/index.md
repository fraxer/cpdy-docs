---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: cpdy.io - Веб-фреймворк на Си
titleTemplate: cpdy
description: Управляемая событиями среда для веб-приложений включает websockets и базы данных.

hero:
  name: "Веб-фреймворк на Си"
  tagline: "Доступная и производительная платформа для создания веб-ресурсов.\n(Альфа версия)"
  actions:
    - theme: brand
      text: Документация
      link: /introduction
    - theme: alt
      text: Github
      link: https://github.com/fraxer/server
    - theme: alt
      text: Примеры
      link: /examples-req-res

features:
  - title: Простой
    icon: 🤯
    details: Основной целью при проектировании была простота использования.
    link: /introduction
    linkText: Начать
  - title: Настраиваемый
    icon: 🛠️
    details: Настройка фреймворка производится через конфигурационный файл
    link: /config
    linkText: Описание конфигурации
  - title: Быстрый
    icon: 💨
    details: Уменьшение времени отклика за счет отказа от внешнего http-сервера и использование компилируемого языка
    link: /introduction
    linkText: К документации
  - title: Доступны базы данных PostgreSQL, MySQL, Redis
    icon: 🏛️
    details: Взаимодействие с базами данных с помощью единого API. 
    link: /db
    linkText: База данных
  - title: Домены
    icon: 🌐
    details: Подключение к серверу нескольких доменов
    link: /domains
    linkText: Управление доменами
  - title: Маршрутизация
    icon: 🧭
    details: Для каждого сервера собственные маршруты и обработчики
    link: /routing
    linkText: Маршрутизация
  - title: Безопасность
    icon: 🔐
    details: Простое подключение ssl-сертификатов
    link: /ssl-certs
    linkText: SSL-сертификаты
  - title: Горячая перезагрузка
    icon: 🔄
    details: Перезагрузка платформы после изменения файла конфигурации без прерывания работы
    link: /hot-reload
    linkText: Перезагрузка
---
