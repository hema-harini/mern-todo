const express = require('express');
const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(express.json())
app.use(cors())
// app.get('/',(req, res)=>{
//      res.send("hello world");
// })
//let todos=[];

mongoose.connect('mongodb://127.0.0.1:27017/mern-app')
.then(() =>{
    console.log('DB connected!')
})
.catch((err) =>{
    console.log(err)
});

const todoSchema = new mongoose.Schema({
    title : {
       required: true,
       type: String
    },
    description : String
})

const todoModel = mongoose.model('Todo', todoSchema);

app.post('/todos', async (req,res)=>{
    const {title,description}=req.body;
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);
    try{
        const newTodo = new todoModel({title,description});
        await newTodo.save();
        res.status(201).json(newTodo);//we are completed request and sending data
    }
    catch (error){
         console.log(error);
         res.status(500).json({message: error.message});
    }
   
})

app.get('/todos', async (req,res)=>{

    try{
        const todos = await todoModel.find();
        res.json(todos);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
   
})

app.put("/todos/:id",async (req,res)=>{
    try{
        const id=req.params.id;
        const {title,description}=req.body;
        const updatedTodo = await todoModel.findByIdAndUpdate(
        id,
        {title,description},
        { new : true}
    )

    if(!updatedTodo){
        return res.status(404).json({message: "Todo not found"})
    }

    res.json(updatedTodo)
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
    
})


app.delete('/todos/:id',async(req,res)=>{
    try {
        const id =req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
    
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});