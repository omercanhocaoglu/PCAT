const express = require("express");
const mongoose = require('mongoose');
const ejs = require('ejs');
const fileUpload = require("express-fileupload");
const methodOverride = require('method-override');
const photoController = require('./controllers/photoControllers');
const pageController = require('./controllers/pageController');

const app = express();

//connect db
mongoose.connect('mongodb+srv://omercanhocaoglu:1Wx27NayGWGYKGJ4@cluster0.xciagxs.mongodb.net/pcat-db?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then( () => {
    console.log('DB connected!')
}).catch( (err) => {
    console.log(err);
});

//Template engine
app.set("view engine", "ejs");

// Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method', {
    methods: [
        'POST',
        'GET'
    ]
}));

// Routes
app.get( "/", photoController.getAllPhotos);
app.get( "/photos/:id", photoController.getPhoto );
app.post( "/photos", photoController.createPhoto);
app.put( "/photos/:id", photoController.updatePhoto);
app.delete( "/photos/:id", photoController.deletePhoto);

app.get( "/about", pageController.getAboutPage);
app.get( "/add", pageController.getAddPage);
app.get( "/photos/edit/:id", pageController.getEditPage);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Sonucu port:${port}'unda başlatıldı.`);
});
