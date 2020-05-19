const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const {
    randomBytes
} = require('crypto');
const axios = require('axios');

const commentsByPostId = {};
app.use(bodyParser.json());
app.use(cors());

app.get("/posts/:id/comments", (req, res) => {
    const id = req.params.id;
    res.send(commentsByPostId[id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
    const commentsId = randomBytes(4).toString('hex');
    const {
        content
    } = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    comments.push({
        content,
        id: commentsId
    });
    
    commentsByPostId[req.params.id] = comments;
    await axios.post("http://localhost:4002/events", {
        type: "CommentCreated",
        data: {
            id: commentsId,
            postId: req.params.id,
            content
        }
    });
    res.status(200).send(comments);

});

app.post("/events", (req, res) => {
    console.log("Recieved events ", req.body);
    res.send({});
});



app.listen('5000', () => {
    console.log('server running localHost: 5000');
});