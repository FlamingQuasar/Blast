# Blast
blast videogame example

## Консольный клиент
Для запуска консольного клиента надо вызвать: 
1. **node view/consoleClient.js**

## Веб-клиент
Для запуска веб-клиента необходимо выполнить команды:
1. **npm init**
1. **npm install --save-dev babel-loader css-loader webpack webpack-cli style-loader webpack-dev-server**
2. **npm run dev**
3. запустить в браузере **http://192.168.0.11:8080**
4. либо поиграть на сайте разработчика

## Автотесты
1. Для установки автотестов нужно: **npm install**
2. Для запуска автотестов нужно: **npm test**

## Базовые функции
- [x] Сгорание, спадание и генерация тайлов
- [x] Перемешивания и проверка на наличие пары \ пары по соседству
- [x] Настройка параметров игры и параметров бустеров в консольном клиенте
- [x] 💥 бустер-бомба
- [x] бустер-телепорт
- [x] бустер супер-тайл: 4 варианта работы - а) взрыв 💥 бомбы радиус R, b) взрыв строки, c) взрыв столбца, d) взрыв креста R, e) взрыв всего игрового поля

## Плюсы
- [x] Реализованы автоматические тесты
- [x] Использованы ES6+Babel
- [x] Сборка проекта webpack
- [x] Использование Fabric.3.0.0.js для продвинутой работы с canvas
- [x] Анимации тайлов

![Скриншот игры Blast](https://bakoomwak.ru/projects/blast/preview.png)