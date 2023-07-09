import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Cpdy",
  description: "Cpdy docs",
  head: [
    [
      'script',
      { id: 'mtrk' },
      `
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(94252971, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true
        });
      `
    ],
    [
      'div',
      {},
      `<img src="https://mc.yandex.ru/watch/94252971" style="position:absolute; left:-9999px;" alt="" />`
    ]
  ],
  locales: {
    root: {
      label: 'Русский',
      lang: 'ru',
      themeConfig: {
        siteTitle: 'Cpdy (альфа)',
        outlineTitle: 'На этой странице',

        nav: [
          { text: 'Главная', link: '/' },
          { text: 'Документация', link: '/introduction' },
          { text: 'Примеры', link: '/examples-req-res' },
        ],

        darkModeSwitchLabel: 'Тема',

        sidebar: [
          {
            items: [
              { text: 'Введение', link: '/introduction' },
              { text: 'Установка зависимостей', link: '/install' },
              { text: 'Сборка и запуск', link: '/build-and-run' },
              { text: 'Файл конфигурации', link: '/config' },
              { text: 'HTTP', collapsed: true,
                items: [
                  { text: 'Запросы', link: '/requests' },
                  { text: 'Ответы', link: '/responses' },
                  { text: 'Cookie', link: '/cookie' },
                  { text: 'Получение данных от клиента', link: '/payload' },
                  { text: 'Коды состояния', link: '/http-codes' },
                ]
              },
              { text: 'WebSockets', collapsed: true,
                items: [
                  { text: 'Запросы', link: '/wsrequests' },
                  { text: 'Ответы', link: '/wsresponses' },
                  { text: 'Получение данных от клиента', link: '/wspayload' },
                ]
              },
              { text: 'Базы данных', collapsed: true,
                items: [
                  { text: 'Доступ к данным', link: '/db' },
                  { text: 'Миграции', link: '/migrations' },
                ]
              },
              { text: 'Домены', link: '/domains' },
              { text: 'Маршрутизация', link: '/routing' },
              { text: 'Логирование', link: '/logging' },
              { text: 'SSL-сертификаты', link: '/ssl-certs' },
              { text: 'Горячая перезагрузка', link: '/hot-reload' },
            ]
          },
          {
            text: 'Библиотеки',
            items: [
              { text: 'Json', link: '/json' },
              { text: 'Base64', link: '/base64' },
            ]
          },
          {
            text: 'Примеры',
            items: [
              { text: 'Запросы и ответы', link: '/examples-req-res' },
              { text: 'Базы данных', link: '/examples-db' },
              { text: 'Json', link: '/examples-json' },
            ]
          },
        ],

        socialLinks: [
          { icon: 'github', link: 'https://github.com/fraxer/server' }
        ],

        footer: {
          message: 'Выпущено под лицензией MIT.',
          copyright: 'Copyright © 2023 Александр Корчагин'
        },

        docFooter: {
          prev: 'Назад',
          next: 'Дальше'
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        siteTitle: 'Cpdy (alpha)',

        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Docs', link: '/en/introduction' },
          { text: 'Examples', link: '/en/examples-req-res' },
        ],

        sidebar: [
          {
            items: [
              { text: 'Intro', link: '/en/introduction' },
              { text: 'Install', link: '/en/install' },
              { text: 'Build and run', link: '/en/build-and-run' },
              { text: 'Configuration file', link: '/en/config' },
              { text: 'HTTP', collapsed: true,
                items: [
                  { text: 'Requests', link: '/en/requests' },
                  { text: 'Responses', link: '/en/responses' },
                  { text: 'Cookie', link: '/en/cookie' },
                  { text: 'Receiving data from the client', link: '/en/payload' },
                  { text: 'HTTP codes', link: '/en/http-codes' },
                ]
              },
              { text: 'WebSockets', collapsed: true,
                items: [
                  { text: 'Requests', link: '/en/wsrequests' },
                  { text: 'Responses', link: '/en/wsresponses' },
                  { text: 'Receiving data from the client', link: '/en/wspayload' },
                ]
              },
              { text: 'Databases', collapsed: true,
                items: [
                  { text: 'Data access', link: '/en/db' },
                  { text: 'Migrations', link: '/en/migrations' },
                ]
              },
              { text: 'Domains', link: '/en/domains' },
              { text: 'Routes', link: '/en/routing' },
              { text: 'Logging', link: '/en/logging' },
              { text: 'SSL-certificates', link: '/en/ssl-certs' },
              { text: 'Hot reload', link: '/en/hot-reload' },
            ]
          },
          {
            text: 'Libraries',
            items: [
              { text: 'Json', link: '/en/json' },
              { text: 'Base64', link: '/en/base64' },
            ]
          },
          {
            text: 'Examples',
            items: [
              { text: 'Requests and responses', link: '/en/examples-req-res' },
              { text: 'Databases', link: '/en/examples-db' },
              { text: 'Json', link: '/en/examples-json' },
            ]
          },
        ],

        socialLinks: [
          { icon: 'github', link: 'https://github.com/fraxer/server' }
        ],

        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2023 Alexander Korchagin'
        }
      }
    }
  }
})
