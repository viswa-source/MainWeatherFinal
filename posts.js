/* mongodb+srv://smartviswa:<password>@cluster0.plqet.mongodb.net/myFirstreq.bodybase?retryWrites=true&w=majority */
const express = require('express')
const mongodb = require('mongodb')
const cors= require('cors')
const cloudinary = require('cloudinary')




cloudinary.config({
    cloud_name: 'dfzhr4gkf',
    api_key: '481543835252595',
    api_secret: 'u6wuDtco6pGc-aN0ES51TFDdJw0'
});



const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb',extended:true  }));
app.use(express.urlencoded({ limit: '50mb', extended:true }))

//GEt Post
app.get('/', async (req, res) => {
    const posts = await loadPostsCollection()
    res.send(await posts.find({}).toArray())
})
app.get('/env', async (req, res) => {
    const posts = await loadPostsCollection("Environmental Awarness")
    res.send(await posts.find({}).toArray())
})
app.get('/for', async (req, res) => {
    const posts = await loadPostsCollection("Forcast")
    res.send(await posts.find({}).toArray())
})
app.get('/wea', async (req, res) => {
    const posts = await loadPostsCollection("Weather Warning")
    res.send(await posts.find({}).toArray())
})
app.get('/rain', async (req, res) => {
    const posts = await loadPostsCollection("Rainfall Status")
    res.send(await posts.find({}).toArray())
})
app.get('/dam', async (req, res) => {
    const posts = await loadPostsCollection("Dam")
    res.send(await posts.find({}).toArray())
})
app.get('/sate', async (req, res) => {
    const posts = await loadPostsCollection("Satellite/Radar Image")
    res.send(await posts.find({}).toArray())
})
app.get('/temple', async (req, res) => {
    const posts = await loadPostsCollectionForTourism("Temple")
    res.send(await posts.find({}).toArray())
})
app.get('/hill', async (req, res) => {
    const posts = await loadPostsCollectionForTourism("Hill Station")
    res.send(await posts.find({}).toArray())
})
app.get('/gallery', async (req, res) => {
    const posts = await loadPostsCollectionForTourism("Gallery")
    res.send(await posts.find({}).toArray())
})

//Add post 
app.post('/', async (req, res) => {
    if (req.body.PostName === "Weather Warning") {
        const posts = await loadPostsCollection(req.body.PostName)
             posts.insertOne({
                Title: req.body.Title,
                Description: req.body.Description,
                 ImageSrc: req.body.ImageSrc,
                 Likes: req.body.Likes,
                 Warning:req.body.Warning,
                Comments: req.body.Comments,
                createdAt:new Date()
             })
    }
    else if (req.body.PostName === "Rainfall Status") {
        const posts = await loadPostsCollection(req.body.PostName)
        posts.insertOne({
           Rainfall: req.body.Rainfall,
           createdAt:new Date()
        })
        console.log("Inserted");
    }
    else if (req.body.PostName === "Satellite/Radar Image") {
        const posts = await loadPostsCollection(req.body.PostName)
        posts.insertOne({
           ImageSrc: req.body.Image,
           createdAt:new Date()
        })
        console.log("Inserted");
    }
        //Tourisms
        else if (req.body.PostName === "Hill Station" || req.body.PostName === "Temple") {
        const posts = await loadPostsCollectionForTourism(req.body.PostName)
        const forGallery= await loadPostsCollectionForTourism("Gallery")
                 posts.insertOne({
                    Name:req.body.Name,
                    SubDescription:req.body.SubDescription,
                     Description: req.body.Description,
                    Place: req.body.Place,
                    Image: req.body.Image,
                    Time: req.body.Time,
                    Season: req.body.Season,
                    LocationMap: req.body.LocationMap,
                    createdAt:new Date()
                 })
        await forGallery.insertOne({
                    Image: req.body.Image,
                    createdAt:new Date()
        })

    }
        else if (req.body.PostName === "Gallery") {
            const forGallery= await loadPostsCollectionForTourism("Gallery")
            await forGallery.insertOne({
                Image: req.body.Image,
                createdAt:new Date()
                })
            }
        //
    else if (req.body.PostName === "Environmental Awarness") {
        const posts = await loadPostsCollection(req.body.PostName)
             posts.insertOne({
                Title: req.body.Title,
                Description: req.body.Description,
                 ImageSrc: req.body.ImageSrc,
                 Likes: req.body.Likes,
                 Place:req.body.Place,
                Comments: req.body.Comments,
                createdAt:new Date()
             })
    }
    else {
        const posts = await loadPostsCollection(req.body.PostName)
             posts.insertOne({
                Title: req.body.Title,
                Description: req.body.Description,
                 ImageSrc: req.body.ImageSrc,
                 Likes: req.body.Likes,
                Comments: req.body.Comments,
                createdAt:new Date()
             })
    }
    
    res.status(201).send()

    
})



//Delete Post
app.delete('/:id',async(req, res) => {
    const posts = await loadPostsCollection("Forcast")
    await posts.deleteOne({_id:new mongodb.ObjectID( req.params.id)})
    res.status(200).send()
})
app.delete('/env/:id',async(req, res) => {
    const posts = await loadPostsCollection("Environmental Awarness")
    await posts.deleteOne({_id:new mongodb.ObjectID( req.params.id)})
    res.status(200).send()
})
app.delete('/wea/:id',async(req, res) => {
    const posts = await loadPostsCollection("Weather Warning")
    await posts.deleteOne({_id:new mongodb.ObjectID( req.params.id)})
    res.status(200).send()
    console.log("Weather Warning Deleted")
})
//Updates
app.put('/:id', async (req, res) => {
     if (req.body.hasOwnProperty("commentsforenv")) {
        const posts = await loadPostsCollection("Environmental Awarness")
        await posts.updateOne({ _id: new mongodb.ObjectID(req.params.id) },{ $push: { "Comments": req.body.Comments } },{ upsert: true },
            function (err, res) {
            if (err) throw err;
            console.log("ENV COMMENTS");
            })  
    }
    
    else if (req.body.hasOwnProperty("commentsforforcast")) {
        const posts = await loadPostsCollection("Forcast")
        await posts.updateOne({ _id: new mongodb.ObjectID(req.params.id) },{ $push: { "Comments": req.body.Comments } },{ upsert: true },
            function (err, res) {
            if (err) throw err;
            console.log("comments forcast");
            })  
    }
   
    else if (req.body.hasOwnProperty("from")) {
        const posts = await loadPostsCollection("Environmental Awarness")
        await posts.updateOne({ _id: new mongodb.ObjectID(req.params.id) },{ $set: { "Likes": req.body.Likes } },{ upsert: true },
            function (err, res) {
            if (err) throw err;
            console.log("Likes for  ENV");
            })  
    }
    else if (req.body.hasOwnProperty("Likes")) {
        const posts = await loadPostsCollection("Forcast")
        await posts.updateOne({ _id: new mongodb.ObjectID(req.params.id) },{ $set: { "Likes": req.body.Likes } },{ upsert: true },
            function (err, res) {
            if (err) throw err;
            console.log("Likes for Forcast");
            })  
    }
    else if (req.body.hasOwnProperty("Rainfall")) {
        const posts = await loadPostsCollection("Rainfall Status")
        await posts.updateOne({ _id: new mongodb.ObjectID(req.params.id) },{ $set: { "Rainfall": req.body.Rainfall } },{ upsert: true },
            function (err, res) {
            if (err) throw err;
            console.log("Rainfall updated");
            })  
    }
    else if (req.body.hasOwnProperty("req.body")) {
        const posts = await loadPostsCollection("Dam")
        await posts.updateOne({ _id: new mongodb.ObjectID(req.params.id) },{ $set: { "req.body": req.body.req.body } },{ upsert: true },
            function (err, res) {
            if (err) throw err;
            console.log("Dam updated");
            })  
    }
    else {
        await posts.updateMany(
            { _id: new mongodb.ObjectID(req.params.id) },
            {
                $set: {
                    "Description":req.body.Description,
                    "Title":req.body.Title,
                    "ImageSrc":req.body.ImageSrc,
                    "createdAt":new Date()
                }
            },
            { upsert: true },
            function (err, res) {
            if (err) throw err;
            console.log("Whats is  this");
            })  
    }
   
    res.status(200).send()
})


//////////////////////////
async function loadPostsCollectionForTourism(postname) {
    const client = await mongodb.MongoClient.connect
        ('mongodb+srv://rajaweather:rajaweather123@cluster0.aivkh.mongodb.net/myFirstreq.bodybase?retryWrites=true&w=majority',
            {
            useUnifiedTopology: true
            }
    )
    if (postname === "Temple") {
        return client.db('Tourism').collection('Temples') 
    }
    else if (postname === "Hill Station") {
        return client.db('Tourism').collection('Hillstation') 
    }
    else {
        return client.db('Tourism').collection('Gallery') 

    }
}


async function loadPostsCollection(postname) {
    const client = await mongodb.MongoClient.connect
        ('mongodb+srv://rajaweather:rajaweather123@cluster0.fnqxb.mongodb.net/Weather?retryWrites=true&w=majority',
            {
            useUnifiedTopology: true
            }
        )
    if (postname === "Environmental Awarness") {
        return client.db('Weather').collection('Environmental Awarness') 
    }
    else if(postname === "Forcast"){
        return client.db('Weather').collection('Forcast')
    }
    else if(postname === "Weather Warning"){
        return client.db('Weather').collection('Weather Warning')
    }
    else if(postname === "Rainfall Status"){
        return client.db('Weather').collection('Rainfall Status')
    }
    else if(postname === "Satellite/Radar Image"){
        return client.db('Weather').collection('Satellite/Radar Image')
    }
    else if(postname === "Dam"){
        return client.db('Weather').collection('Dam')
    }
    else {
        return client.db('Weather').collection('Environmental Awarness')
    }
}

module.exports =app