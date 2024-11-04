const express = require("express");

const app = express();
const methodOverride = require('method-override')

app.set("view engine","ejs");

const path = require("path");
app.set("views",path.join(__dirname,"/views"));

app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({extended:true}));

app.use(methodOverride('_method'));

app.use(express.json());

let port = 3000;

let data = require("./data.json");
const { name } = require("ejs");


app.listen(port,()=>{
    console.log("server online");
})

app.get("/",(req,res)=>{
    console.log("Home Page Accessed");
    console.log(data.users);
    res.render("home.ejs",{users : data.users});
})

app.get("/create",(req,res)=>{
    console.log("create page accessed");
    res.render("create.ejs");
})

app.post("/",(req,res)=>{
    data.users.push({
        "identity": data.users.length,
        "name": req.body.name,
        "texts": []
    })
    res.redirect("/");
})

app.get("/:username",(req,res)=>{
    console.log(`${req.params.username}'s chat section accessed`);
    const user = data.users.find(i=>i.name===req.params.username);
    if (!user) {
        return res.status(404).send("User not found"); // Handle the case where user doesn't exist
    }
    res.render("chatbar.ejs",{info : user});
})

app.post("/:username",(req,res)=>{
    const user = data.users.find(i=>i.name===req.params.username);
    let len = user.texts.length;
    let obj = {
        "id":len+1,
        "message":req.body.message
    }
    for(let i of data.users){
        if(i.name===req.params.username){
            i.texts.push(obj);
        }
    }
    res.redirect(`/${req.params.username}`);
})

app.delete("/:username",(req,res)=>{
    const user = data.users.find(i=>i.name===req.params.username);
    data.users[user.identity].texts.splice(req.body.id-1, 1);
    let a = 0;
    data.users[user.identity].texts.forEach((x)=>{
        x.id = a+1;
        a+=1;
    })
    console.log(data.users[user.identity].texts);
    res.redirect(`/${req.params.username}`); 
});

app.delete("/",(req,res)=>{
    let m = parseInt(req.body.id);
    data.users.splice(m, 1);
    let a = 0;
    data.users.forEach((x)=>{
        x.identity = a;
        a+=1;
    })
    console.log(data.users);
    res.redirect("/");
})

app.get("/:username/:id",(req,res)=>{
    console.log(req.params);
    const a = Number(req.params.id);
    console.log(a);
    const user = req.params.username;
    const users = data.users.find(i=>i.name===req.params.username);
    res.render("msgedit.ejs",{name:user, msg:users.texts[a-1]});
})

app.patch("/:username",(req,res)=>{
    const user = data.users.find(i=>i.name===req.params.username);
    const a = Number(req.body.id);
    user.texts[a-1].message = req.body.msg;
    data.users[user.identity] = user;
    res.redirect(`/${req.params.username}`);
})

