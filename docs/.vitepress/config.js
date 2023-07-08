import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Cpdy",
  description: "Cpdy docs",
  locales: {
    root: {
      label: 'Русский',
      lang: 'ru',
      themeConfig: {
        // logo: '/logo.svg',
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
        // logo: '/logo.svg',
        siteTitle: 'Cpdy (alpha)',

        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Docs', link: '/en/introduction' }
        ],

        sidebar: [
          {
            text: 'Examples',
            items: [
              { text: 'Markdown Examples', link: '/markdown-examples' },
              { text: 'Runtime API Examples', link: '/api-examples' }
            ]
          }
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
