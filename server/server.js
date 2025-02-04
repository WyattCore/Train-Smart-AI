const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const OpenAI = require("openai");
require('dotenv').config();

app.use(express.json());
app.use(cors());

const saved_plans = [];


const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
let input = ""



app.post('/api', (req,res) =>{
    input = req.body.input
    res.json({response: req.body.input})
})

app.get("/api", async(req, res) =>{
    try{
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "user", content: input}
            ]
        });
        res.json({response: completion.choices[0].message.content})
    }catch (error){
        console.error("Error calling OpenAi API",error);
        res.status(500).json({error: "could not get response from Openai"})
}
});


app.post('/saved', (req, res) => {
    try{
        saved_plans.push(req.body);
        console.log("Backend data: ", req.body);
        res.status(200).send({ message: 'Object saved successfully!' });
    } catch (error) {
        console.error("error saving plan: ", error);
        res.status(500).send({ error: 'Failed to save plan'});
    }
});

app.get('/get', (req,res) => {
    if(saved_plans) {
        res.json(saved_plans);
    }else{
        res.status(404).json({message: "No object found"});
    }
});

app.listen(5000, ()=>{
    console.log("Server started on port 5000")
});
