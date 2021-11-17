import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';


mongoose.connect('mongodb+srv://hassam:hassam.bhatti12@aichatbotcluster.omvnd.mongodb.net/MyChatbotdb?retryWrites=true&w=majority',function(){
    console.log("db Connected");
});

const User = mongoose.model('users',{
    user_name: String,
    age: String,
    address: String,
    email: String
});

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(morgan('short'));

app.use((req, res, next)=>{
    console.log("req come");
    next();
});

app.get('/users', (req, res)=>{
    User.find({},(err, users)=>{
        if(!err){
            res.send(users);
        }else{
            res.status(500).send("error");
        }
    })
});

app.get('/user/:id', (req, res)=>{
    User.findOne({_id:req.params.id},(err, users)=>{
        if(!err){
            res.send(users);
        }else{
            res.status(500).send("error");
        }
    })
});

app.post('/user',(req, res)=>{
    if(!req.body.user_name ||!req.body.age || !req.body.address || req.body.email){
        res.status(400).send("invalid record");
    }else{
        const newUser = new User({
            user_name: req.body.user_name,
            age: req.body.age,
            address: req.body.address,
            email: req.body.email
        });
    newUser.save().then(()=>{
        console.log("user created");
        res.send("user created");
    })
    }
});

app.put('/user/:id',(req, res)=>{
    let updateUser ={};
    if(req.body.user_name){
        updateUser.user_name = req.body.user_name;
    }
    if(req.body.age){
        updateUser.age = req.body.age;
    }
    if(req.body.address){
        updateUser.address = req.body.address;
    }
    if(req.body.email){
        updateUser.email = req.body.email;
    }
    User.findByIdAndUpdate(req.params.id, updateUser,{new:false},
    (err, data)=>{
        if(!err){
            res.send(data);
        }else{
            res.status(500).send("error");
        }
    })

})

app.delete('/user/:id',(req, res)=>{
    User.findByIdAndRemove(req.params.id,(err, data)=>{
        if(!err){
            res.send("user deleted");
        }else{
            res.status(500).send("error");
        }
    })

})

app.listen(port,()=>{
    console.log("server is running");
})