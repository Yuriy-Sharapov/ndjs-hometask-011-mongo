// подключаем Express
const express = require('express')
const mongoose = require('mongoose')

const dotenv = require('dotenv').config(); // подключаем работу с переменными окружения

const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const booksRouter = require('./routes/books')
const uploaderRouter = require('./routes/uploader')

const app = express()
app.use(express.json())   
app.use(express.urlencoded())
app.set('view engine', 'ejs')

app.use('/', indexRouter)
app.use('/', userRouter)
app.use('/', booksRouter)
app.use('/', uploaderRouter)

app.use(errorMiddleware);

const preload = require('./storage/storage')

// Объявляем асинхронную функциню для соединения с БД и запуском сервера
async function start(PORT, UrlDB) {
    try {
        await mongoose.connect(UrlDB)
        preload();
        app.listen(PORT, () => {
            console.log(`Server is listening port ${PORT}...`)
        })
    } catch (e) {

    }
}

const UrlDB = process.env.UrlDB
// Настраиваем порт, который будет прослушивать сервер
const PORT = process.env.PORT || 3000
start(PORT, UrlDB)