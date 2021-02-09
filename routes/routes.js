const { Router } = require('express')
const router = Router()
const Article = require('../models/model')
const path = require('path')
const multer = require('multer')
var upload = multer({
  dest: path.join(__dirname, '../uploads')
});
let numberArticles = 0




router.get('/', async (req, res) => {
  const articles = await Article.find({}).lean()

  res.render('index', {
    title: 'Articles',
    isIndex: true,
    articles
  })
})

router.get('/create', (req, res) => {
  res.render('create', {
    title: 'Create Articles',
    isCreate: true
  })
})

router.post('/create', async (req, res) => {
    const article = new Article({
    number: numberArticles,
    title: req.body.title,
    message: req.body.message,
    status: req.body.status_order,
    date: req.body.date
  })
  numberArticles++
  let filedata = req.file
  article.fileName = filedata.originalname
  await article.save()
  res.redirect('/')
})

router.post('/complete', async (req, res) => {
  const article = await Article.findById(req.body.id)
  
  if(req.body.hasOwnProperty("download")){
    const fl = req.body.filename
    const file = `./uploads/${fl}`;
    res.download(file)
  }
  if(req.body.hasOwnProperty("save")){
    if (article.status == "Cancelled"){
      article.status = "Shipped"
      article.completed = false
    }
    else{
      article.status = "Cancelled"
      article.completed = true
    } 
     
    await article.save()
    res.redirect('/')
  }
  
})

module.exports = router