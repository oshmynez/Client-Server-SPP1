const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const exphbs = require('express-handlebars')
const fileUpload = require('express-fileupload') 
const appRoutes = require('./routes/routes')
const multer = require('multer')
var upload = multer({ dest: 'uploads/' })

const PORT = process.env.PORT || 3000

const app = express()


const storageConfig = multer.diskStorage({
    destination:(req,file, cb)=>{
        cb(null, "uploads")
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

app.engine('.hbs', exphbs({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views','views')

app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(multer({storage:storageConfig}).single("filedata"))
app.use(appRoutes)
app.use(fileUpload({}))

async function start(){
    try{
        await mongoose.connect('mongodb+srv://dima:1088834@cluster0.uwrbc.mongodb.net/dbtest',
            {
                useNewUrlParser: true,
                useUnifiedTopology:true,
                useFindAndModify:false            
            }
        )
        app.listen(PORT,() => {
            console.log('Server has been started...')
        })
    }catch(e){
     console.log(e)
    }
}

start()
