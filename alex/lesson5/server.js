// 1) В сервисе должен присутстовать CRUD операции для вашего выбранного 
// домена (вместо хранилища будет файл которые вы будите презаписывать и читать)
// 2) К вашим придуманым сущностям прлумать и залогировать 2 ендпоинта с большой
//  вложенностью на ваш выбор (например GET /users/:id/friends - получить друзей выбранного юзера)
// 3) Два  ендпоинта должны будет валидироваться
// 4) у вас должен быть error handler с какой либо спецеифичной логкикой оработки 
// на ваш выбор (например обработка определнных ошибок)
// 5) Написаный open API и swagger (я генерировал с помощю chat gpt)
// 6) модули сервиса такие как роутинг, валидация, мидвары и сервисы для работы например 
// с файлами, должны быть в отдельных файлах и один server (index) айл который в себе соберает всё.

const express = require('express');
const router = require('./bookRouter.js');
const app = express();
const middleware = require('./middleware.js');
const swaggerUi = require("swagger-ui-express");
const YAML = require('yamljs');
const path = require('path');

app.use('/books', router);
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(middleware.errorHandler);

const server = app.listen(8081, () => {
    console.log('Express App running at http://localhost:8081/');
})