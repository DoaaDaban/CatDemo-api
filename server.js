'use strict';


const express= require ('express');
const cors= require('cors');
require('dotenv').config();
const mongoose= require('mongoose');


const server= express();
server.use(cors()); // to let server serve any client

server.use(express.json()); // with post method, to convert data inside body to json format

const PORT= process.env.PORT;


mongoose.connect('mongodb://localhost:27017/catDBs', {useNewUrlParser: true, useUnifiedTopology: true});


const kittySchema = new mongoose.Schema({
    catName: String,
    breed: String,
  });


  const ownerSchema = new mongoose.Schema({
    ownerName: String,
    cats: [kittySchema]
  });



const myCatModel  = mongoose.model('Kitten', kittySchema);
const myOwnerModel = mongoose.model('Owner', ownerSchema);

function seedKittenCollection(){
    const frankie = new myCatModel({
        catName : 'Frankie' ,
        breed  : 'angora' ,

        });
    console.log(frankie.catName); // 'Frankie'


    const sherry = new myCatModel({
        catName : 'Sherry' ,
        breed  : 'american' ,

        });
    console.log(sherry.catName); // 'Sherry'


    const fluffy = new myCatModel({
        catName : 'Fluffy' ,
        breed  : 'angora' ,

        });
    console.log(fluffy.catName); // 'Fluffy'


    frankie.save();
    sherry.save();
    fluffy.save();

}

 // seedKittenCollection();


function seedOwnerCollection(){
    const roaa= new myOwnerModel({
        ownerName:'roaa',
        cats:[
            {
            catName: 'fluffy',
            breed:'american',
            },

            {
                catName: 'sherry',
                breed:'angora',
            }
    ]
    })

    const osaid= new myOwnerModel({
        ownerName:'osaid',
        cats:[
            {
                catName:'Blacky',
                breed:'british',

            },
            
        ]
    })

    roaa.save();
    osaid.save();
}

// seedOwnerCollection();

// routes
// http://localhost:3010/
server.get('/', homeHandler);

// http://localhost:3010/cat?name=roaa
server.get('/cat', getCatsHandler);

// http://localhost:3010/addCatR
server.post('/addCatR',addCatHandler);

// http://localhost:3010/deleteCatR/1
 server.delete('/deleteCatR/:index', deleteCatHandler);

 // http://localhost:3010/updateCatR/1
 server.put('/updateCatR/:index', updateCatHandler);


// handlers
function homeHandler(req,res){
res.send('Home Route');
}

function getCatsHandler(req,res){

    const reqOwnerName= req.query.name;

    myOwnerModel.find({ownerName : reqOwnerName}, function(err,resultData){
        if(err){
            console.log('Error, reqOwnerName not found in db')
        }
        else{
            //console.log(resultData) 
           // console.log(resultData[0].cats)
            res.send(resultData[0].cats);
            
        }
    })
   
}

function addCatHandler(req,res){

   console.log(req.body) // undefine lazm a7t hy (server.use(express.json());)

//    res.send('test')

//  const ownerName= req.body.ownerName;
//   const catName= req.body.catName;
//   const catBreed= req.body.catBreed;

// restucturing
const {ownerName, catName, catBreed} =req.body ;

   myOwnerModel.find({ownerName: ownerName},(err, resultData) => {

    if(err){
        res.send('Not working');
    }
    else{
        // console.log('find result : ' , resultData)

        resultData[0].cats.push({
            catName: catName,
            breed: catBreed,
        })
        resultData[0].save();      
        res.send(resultData[0].cats) 
      }
   })
   
}


function deleteCatHandler (req,res){
 // res.send('delet Route')
 // console.log(req.params) // { index: '1' }

 const index= req.params.index;
 const {ownerName} = req.query;
 //console.log(ownerName);
 myOwnerModel.find({ownerName : ownerName}, (err,resultData)=> {
   //  console.log("hhhhh",resultData[0].cats)

   const newCatArray= resultData[0].cats.filter((cat, idx)=>{
       console.log( typeof idx , typeof index)
       if(idx != index){
           return true;
       } 
    })
    console.log('newArray', newCatArray)
      resultData[0].cats= newCatArray;
      resultData[0].save();
      res.send(resultData[0].cats);
 })
}

// update 

function updateCatHandler (req,res){

    const index= req.params.index;
    console.log(index)
    const {catName, catBreed,ownerName} = req.body;
    console.log(req.body)

    myOwnerModel.findOne({ownerName: ownerName}, (err, resultData)=>{

        console.log('findeOne ',resultData)
        
        resultData.cats.splice(index,1, {

            catName: catName,
            breed: catBreed,
        })
        resultData.save();
        res.send(resultData.cats);
    })

}



server.listen((PORT),()=>{
    console.log(`im listneing in PORT ${PORT}`);
})