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

import express from 'express';
const app = express();
import bodyParser from 'body-parser';
const jsonParser = bodyParser.json();
import swaggerUi from "swagger-ui-express";
import YAML from 'yamljs';
import path from 'path';
import { default as rateLimit } from 'express-rate-limit';
import { bookRouter } from './books/bookRouter';
import { userRouter } from './users/userRouter';
import { tokenRateLimit } from './users/rateLimitMiddleware';
import { errorHandler } from './middleware';
import "reflect-metadata";
import { AppDataSource } from './db/data-source';

app.use(jsonParser);
app.use('/books', bookRouter);
app.use('/users', userRouter);

const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(rateLimit(tokenRateLimit));
app.use(errorHandler);

AppDataSource.initialize()
    .then(() => {
    })
    .catch((error) => console.log(error))

const server = app.listen(8081, () => {
    console.log('Express App running at http://localhost:8081/');
})