const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async ( req, res ) => {
    const page = req.query.page || 1;
    const photosPerPage = 3;
    const totalPhotos = await Photo.find().countDocuments();
    const photos = await Photo.find({})
    .sort('-dateCreated')
    .skip(( page-1 ) * photosPerPage)
    .limit(photosPerPage);
    res.render('index', {
        photos: photos,
        current: page,
        pages: Math.ceil( totalPhotos / photosPerPage )
    });
    


    // console.log(req.query);
    // const photos = await Photo.find({}).sort('-dateCreated');
    // res.render('index', {
    //     photos
    // });
};
exports.getPhoto = async ( req, res ) => {
    // console.log(req.params.id);
    // res.render('add');
    // res.redirect('/');
    const photoID = await Photo.findById(req.params.id);
    res.render('photo', {
        photoID
    });
};
exports.createPhoto = async ( req, res ) => {
    // console.log(req.files.image);
    // console.log(req.body);
    // await Photo.create(req.body);
    // res.redirect('/');

    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    };
    
    let uploadedImage = req.files.image;
    let uploadPath = __dirname + '/../public/uploads/' + uploadedImage.name;
    uploadedImage.mv(uploadPath, async () => {
        await Photo.create({
            ...req.body,
            image: '/uploads/' + uploadedImage.name
        });
        res.redirect('/');
    });
};
exports.updatePhoto = async ( req, res ) => {
    const updatedPhoto = await Photo.findOne({ _id: req.params.id });
    updatedPhoto.title = req.body.title;
    updatedPhoto.description = req.body.description;
    updatedPhoto.save();
    res.redirect(`/photos/${req.params.id}`);
};
exports.deletePhoto = async ( req, res ) => {
    const deletedPhoto = await Photo.findOne({_id: req.params.id});
    let deletePath = __dirname + '/../public' + deletedPhoto.image;
    fs.unlinkSync(deletePath);
    await Photo.findByIdAndRemove(req.params.id);
    res.redirect('/');
};

