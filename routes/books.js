const express = require('express')
const router = express.Router()
module.exports = router

const fs = require('fs');
const path = require('path');

const Books = require('../models/books')
//const stor = require('../storage/storage')
// const cBook = require('../classes/cBook')

// 1. получить все книги
router.get('/books', async (req, res) => {

    try {
        const books = await Books.find().select('-__v')
        res.render("books/index", {
            title: "Список книг",
            books: books,
        });  
    } catch (e) {
        res.status(500).json(e)
    }  
}) 

// 2. создать книгу
router.get('/books/create', (req, res) => {
    res.render("books/create", {
        title: "Добавить новую книгу",
        book: {}
    })
})

router.post('/books/create', async (req, res) => {
    // создаём книгу и возвращаем её же вместе с присвоенным ID
    const {title, description, authors, favorite, fileCover, fileName, fileBook} = req.body
    const newBook = new Books({title, description, authors, favorite, fileCover, fileName, fileBook})

    try {
        await newBook.save()
        res.redirect('/books')
    } catch (e) {
        res.status(500).json(e)
    }     
})

// 3. получить книгу по ID
router.get('/books/:id', async (req, res) => {

    // получаем объект книги, если запись не найдена, вернём Code: 404
    const {id} = req.params
    console.log(id)

    try {
        //const books = await Books.find().select('-__v')
        //console.log(books)

        const book = await Books.findById(id).select('-__v')
        console.log(`book - ${book}`)

        res.render("books/view", {
            title: "Просмотреть карточку книги",
            book: book
        })        
    } catch (e) {
        res.redirect('/404')
    }  
})

// 4. редактировать книгу по ID
router.get('/books/update/:id', async (req, res) => {
    // редактируем объект книги, если запись не найдена, вернём Code: 404
    const {id} = req.params

    try {
        const book = await Books.findById(id).select('-__v')
        res.render("books/update", {
            title: "Редактирование атрибутов книги",
            book: book,
        })        
    } catch (e) {
        res.redirect('/404')
    } 
})

router.post('/books/update/:id', async (req, res) => {
    // редактируем объект книги, если запись не найдена, вернём Code: 404
    const {id} = req.params
    const {title, description, authors, favorite, fileCover, fileName, fileBook} = req.body

    try {
        await Books.findByIdAndUpdate(id, {title, description, authors, favorite, fileCover, fileName, fileBook})
        res.redirect(`/books/${id}`);
    } catch (e) {
        res.redirect('/404')
    } 
})

// 5. удалить книгу по ID
router.post('/books/delete/:id', async (req, res) => {
    // удаляем книгу и возвращаем ответ: 'ok'
    const {id} = req.params

    try {
        await Books.deleteOne({_id: id})
        res.redirect(`/books`); 
    } catch (e) {
        res.redirect('/404');
    }      
})   

// 6. Скачать книгу
router.get('/books/:id/download', async(req, res) => {

    const {id} = req.params

    try {
        const book = await Books.findById(id).select('-__v')

        // Формируем путь до книги
        const filePath = path.resolve(__dirname, "..", book.fileBook)

        // Проверка, существует ли файл
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                res.redirect('/404')
                return 
            }

            // Отправка файла на скачивание
            res.download(filePath, err => {
                if (err)
                    res.status(500).send('Ошибка при скачивании файла')
            })
        })
    } catch (e) {
        res.redirect('/404')
    }
})