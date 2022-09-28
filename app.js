const express=require("express");
const bodyparser=require("body-parser");
const date= require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app=express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-adarsh:Test1234@cluster0.mhxjr0p.mongodb.net/todoListDB",{useNewUrlParser:true});

const itemsSchema = new mongoose.Schema({
    name:String
});
const Item = mongoose.model("Item",itemsSchema);


const item1=new Item({
    name:"Welcome To do list"
});
const item2=new Item({
    name:"Hit the + icon to add items to your list"
});
const item3=new Item({
    name:"<-- Hit this to delete a item"
});

const defaultItems=[item1,item2,item3];

const listSchema= new mongoose.Schema({
    name:String,
    items: [itemsSchema]
});
const List=mongoose.model("List",listSchema);





app.get("/",function(req,res){

    Item.find({},function(err,foundItems){

            if(foundItems.length==0){
                Item.insertMany(defaultItems,function(err){
                    if(err)
                        console.log(err);
                    else
                        console.log("Default items added sucessfully");
                });
                res.redirect("/");
            }
            else{
            let day=date.getDate();
            res.render('list',{ listTitle :day, newListItems : foundItems} );
            }
        });
    });

app.post("/",function(req,res){
    const itemName=req.body.newItem;
    const listName=req.body.list;
    const item =new Item({
        name:itemName
    });
    let day=date.getDate();
    if(listName==day)
    {
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });

    }
});

app.post("/delete",function(req,res){

    const checkedItemId=req.body.checkbox;
    const listName= req.body.ListName;
    let day=date.getDate();
    if(listName===day)
    {
        // console.log(checkedItemId);
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(!err)
            {
                // console.log("Item was deleted");
                res.redirect("/");
            }
        });
    }
    else{
        List.findOneAndUpdate({name: listName},{$pull: {items: {_id:checkedItemId }}},function(err, foundList){
            console.log(listName);
            console.log(checkedItemId);
            if(!err)
            {
                res.redirect("/" + listName);
            }
        });
    }

    
});

app.get("/:listName",function(req,res){
    let customListName= _.capitalize(req.params.listName);
    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                // console.log("Does Not exist");
                const list= new List({
                    name:customListName,
                    items:defaultItems
                });
                list.save();
                res.redirect("/"+ customListName);
            }
            else{
                // console.log("list already exist");

                res.render("list",{ listTitle : foundList.name, newListItems :foundList.items });
            }
        }
    })
   
});


let port= process.env.PORT;
if(port== null || port == ""){
    port=3000;
}
app.listen(port,function(){
    console.log("Server started");
});