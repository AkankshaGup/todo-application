import express from 'express';
import path from 'path';
import connectDB from './config.js';
import { ObjectId } from 'mongodb';

const publicPath = path.resolve('public')
const app = express();
app.use(express.static(publicPath))
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")

app.get('/', async(req, res) => {
    const db=await connectDB();
    const todosList = await db.collection("todos").find().toArray();
    res.render("list.ejs", { tasks: todosList });
});
app.get('/add', (req, res) => {
    res.render("add.ejs")
});
app.get('/update/:id', async (req, res) => {
    const db =await connectDB();
    const { id } = req.params;
    const task =await db.collection("todos").findOne({ _id: new ObjectId(id) });
    res.render("update.ejs", { task })
});
app.get('/delete/:id', async (req, res) => {
    const db = await connectDB();
    const { id } = req.params;
    console.log(id);
    await db.collection("todos").deleteOne({ _id:new ObjectId (id) });
    res.redirect("/");
});

app.post('/delete-items', async (req, res) => {
    const db = await connectDB();
    const { selectedTasks } = req.body;
    if (Array.isArray(selectedTasks)) {
        const objectIds = selectedTasks.map(id => new ObjectId(id));
        console.log(objectIds);
        await db.collection("todos").deleteMany({ _id: { $in: objectIds } });
    } else if (selectedTasks) {
        await db.collection("todos").deleteOne({ _id: new ObjectId(selectedTasks) });
    }
    res.redirect("/");
});

app.post('/add', async (req, res) => {
    const db = await connectDB();
    const data = req.body;
    const result = await db.collection("todos").insertOne(data);
    res.redirect("/")
});
app.post('/update/:id', async (req, res) => {
    const db = await connectDB();
    const data = req.body;
    const { id } = req.params;
    const result = await db.collection("todos").updateOne({_id: new ObjectId(id)},{$set:data})
    res.redirect("/")
});

app.listen(3000)