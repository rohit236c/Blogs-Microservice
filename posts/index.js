const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {
    randomBytes
} = require('crypto');
const axios = require('axios');
const cors = require('cors');


const posts = {};
app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res, next) => {
    res.send(posts);
});

app.post('/posts', async (req, res, next) => {
    const id = randomBytes(4).toString('hex');
    const {
        title
    } = req.body;
    posts[id] = {
        id,
        title
    };
    await axios.post("http://localhost:4005/events", {
        type: 'PostCreated',
        data: {
            id,
            title
        }
    });
    res.status(200).send(posts[id]);
});

app.post("/events",(req,res)=>{
    console.log("Recieved events ", req.body);
    res.send({});
});




app.listen('4000', () => {
    console.log('server running localHost: 4000');
});