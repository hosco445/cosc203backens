const multer = require('multer');
const express = require('express');
var bird_controller = require('../controllers/bird_controller');

const Birds = require('../models/birds');
const mime = require('mime-types');
var mongoose = require('mongoose');
/* create a router (to export) */
const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  const upload = multer({ storage: storage })
/* route the default URL: `/birds/ */
router.get('/', async (req, res) => {
    // extract the query params
    const search = req.query.search;
    const status = req.query.status;
    const sort = req.query.sort;
    // render the Pug template 'home.pug' with the filtered data
    res.render('home', {
        birds: await bird_controller.filter_bird_data(search, status, sort)
    });
})

// TODO: finishe the "Create" route(s)
router.get('/create', (req, res) => {
    // currently does nothing except redirect to home page
    res.render('../views/templates/create_form')
});

router.post('/create', upload.single("photo_upload"), async (req, res) => {
    console.log(req.body, req.file);
        const birdinfo ={
        _id : mongoose.Types.ObjectId(),
        primary_name : req.body.primary_name,
        english_name : req.body.english_name,
        scientific_name : req.body.scientific_name,
        other_names : req.body.other_names,
        family : req.body.family,
        order : req.body.order,
        status : req.body.status,
        photo: {credit : req.body.photo_credit, source : req.file.originalname},
        size: { length : {value : req.body.length, units : 'cm'}, 
                weight : {value : req.body.weight, units : 'g'}}
        }
        const db_info = await Birds.create(birdinfo);
        res.redirect('/');
    });


// TODO: get individual bird route(s)
router.get('/:id', async(req, res) => {
    const id = req.params.id;
    var birds = await Birds.find({});

    for(i = 0; i < birds.length; i++){
    if(birds[i]._id == id){
        var bird = birds[i];
        break;
        }
    }
    if(bird != null){
        res.render('../views/templates/singl_bird', {bird});

    }else{
    res.render('../views/404_error', {birds:0});
}
});

// TODO: Update bird route(s)
router.get('/:id/edit', async (req, res) => {
    const id = req.params.id;
    var birds = await Birds.find({});
    for(i = 0; i < birds.length; i++){
        if(birds[i]._id == id){
            var bird = birds[i];
            break;
            }
        }
    
        res.render('../views/templates/update_form', {bird})
})

router.post('/update', upload.single("photo_upload"), async (req, res) => {
const id  = req.body.id 
if(req.file != undefined){
const db_info = await Birds.updateOne(
    {_id :id}, {$set: {
        primary_name : req.body.primary_name, 
        english_name : req.body.english_name,
        scientific_name : req.body.scientific_name,
        other_names : req.body.other_names,
        family : req.body.family,
        order : req.body.order,
        status : req.body.status,
        photo: {credit : req.body.photo_credit, source : req.file.originalname},
        size: { length : {value : req.body.length, units : 'cm'}, 
                weight : {value : req.body.weight, units : 'g'}}
        }
    })
    }else{
        const db_info = await Birds.updateOne(
            {_id :id}, {$set: {
                primary_name : req.body.primary_name, 
                english_name : req.body.english_name,
                scientific_name : req.body.scientific_name,
                other_names : req.body.other_names,
                family : req.body.family,
                order : req.body.order,
                status : req.body.status,
                size: { length : {value : req.body.length, units : 'cm'}, 
                        weight : {value : req.body.weight, units : 'g'}}
                }
            })
    }

        res.redirect('/');
    });
module.exports = router;
// TODO: Delete bird route(s)
// CRUD: delete message
router.get('/:id/delete', async (req, res) => {
    const id = req.params.id;
    console.log(id)
    const db_info = await Birds.findOneAndRemove({ _id: id })
res.redirect('/');
})
module.exports = router; // export the router

