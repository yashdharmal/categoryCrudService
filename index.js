const express = require('express');
const mongoose = require("mongoose");
const category = require('./models/category.js');
require('dotenv').config();



//initializing express
const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
    dbName: 'categoryDB',
}, (err) => {
    if (err) console.log(err);
    else {
        app.listen(process.env.PORT || 8080, () => {
            console.log("Server is up and listing on port 8080");
        })
    }
})


app.post('/add', async (req, res) => {
    try {
        let data = req.body;
        if (!data.title) {
            return res.send("please provide title")
        }
        let isCategory = await category.exists({ title: data.title })
        if (isCategory) {
            return res.send("title is duplitate")
        }
        if (!data.type) {
            return res.send("plase provide type")
        }

        let newRec = await category.create(req.body);

        res.send(newRec);
        return

    } catch (error) {
        console.log(error.message);
        res.send("duplicate")

    }

})


app.get('/fetch', async (req, res) => {
    try {
        let { title } = req.body;
        if (!title) {
            res.send("plese enter title")
        }

        let data = await category.findOne({ title })
        if (!data) {
            res.send("category not found")
        }

        res.send(data);

    } catch (error) {
        console.log(error.message);
        res.send("something wrong with fetching")
    }

})

app.put('/update', async (req, res) => {
    try {

        let { _id, ...dataToUpdate } = req.body;

        let updatedData = await category.updateOne({ _id }, dataToUpdate)
        let isId = await category.exists({ _id })
        if (!isId) {
            res.send("id is not found")
        }

        if (!updatedData || !updatedData.acknowledged) {
            return res.status(404).send("Category not found !")
        }

        return res.send(updatedData);
    } catch (error) {
        console.log(error.message);
        res.send("Somethin wrong with update")
    }

})


app.delete('/delete', async (req, res) => {
    let { _id, } = req.body;

    let deleted = await category.deleteOne({ _id });

    if (deleted.deletedCount == 0) {
        return res.status(404).send("Category not found !")
    }
    return res.send("Category deleted succesfully")
})

