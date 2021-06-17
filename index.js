const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

//Middle ware
app.use(express.urlencoded({ extended:true }))
app.use(express.json())
app.use(cors())

const posts = require('./posts')

app.use('/api/posts', posts)

//handle Productions
if (process.env.NODE_ENV === 'production') {
    //static Folders
    app.use(express.static(__dirname + '/public'))

    //handle SPA
    app.get(/.*/, (req, res) => {
        res.sendFile(__dirname+'/public/index.html')
    });

}
const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log('listening on port ' + port)
})