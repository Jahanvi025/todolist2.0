import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const date = new Date();

const options = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
};


const day = date.toLocaleString('en-IN', options);
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB', {useNewUrlParser: true, useUnifiedTopology : true})
.then(()=> console.log('db is connected'))
.catch(err => console.log(err));
const itemsSchema = new mongoose.Schema({
    name : String
});
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
   name : 'Welcome to Infinite Todo!'
});
const item2 = new Item({
    name : 'Create Your todo lists'
 });
const item3 = new Item({
    name : 'Example- Watching anime'
 });
 const defaultItems = [item1, item2, item3];
 
 const listSchema = new mongoose.Schema({
    name: String,
    items : [itemsSchema]
 });
 const List = mongoose.model("List", listSchema);
app.get("/",(req,res) =>{
    res.render("index.ejs");
});

app.get("/instruction", (req, res) =>{
    res.render("instruction.ejs");
});


app.post("/todaytask",(req,res) =>{
    const newName = req.body.newItem;
   // const listName = req.body.add;
    const item = new Item({
        name : newName
    });
//if(listName === day){
    item.save();
    res.redirect("/today");
//}
/*else{
    List.findOne({name : listName})
   .then(foundList => {
   foundList.items.push(item);
   foundList.save();
   res.redirect("/" + listName)
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
   */
    
});
app.post("/delete", (req, res)=>{
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId)
  .then(removedDocument => {
    if (removedDocument) {
      console.log('Document removed:', removedDocument);
      res.redirect("/today");
    } else {
      console.log('Document not found.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
/*app.get("/:customListName", function(req,res){
   const customListName =  req.params.customListName;
   List.findOne({name : customListName})
   .then(foundList => {
    if (foundList) {
     // console.log('Document found:', foundList);
     res.render("today.ejs",{Today: customListName, itemslist : foundList.items});
    } else {
     // console.log('Document not found.');
      const list = new List({
        name : customListName,
        items : defaultItems
      });
      list.save();
      res.redirect("/"+ customListName);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
 
   
  });*/
app.get("/today",(req, res) =>{
      Item.find({})
      .then(function(foundItems) {
          
          if(foundItems.length === 0){
              
              Item.insertMany(defaultItems)
              .then(function() {
                  console.log("Insert succesfull");
              })
              .catch(function(err) {
                  console.log(err);
              });
              res.redirect("/today");
   
          }else{
            res.render("today.ejs",{Today: day, itemslist : foundItems});
          }
   
      })
      .catch(function(err) {
          console.log(err);
      });
   
});

//let works = [];
const itemsSchema2 = new mongoose.Schema({
    name : String
});
const Item2 = mongoose.model("Item2", itemsSchema);

const item4 = new Item2({
   name : 'Welcome to Infinite Todo!'
});
const item5 = new Item2({
    name : 'Create Your work list here!'
 });

 const defaultItems2 = [item4, item5];
 
 const listSchema2 = new mongoose.Schema({
    name: String,
    items : [itemsSchema2]
 });
 const List2 = mongoose.model("List2", listSchema2);
app.post("/todaywork",(req,res) =>{
    const newName = req.body.newItem;
    // const listName = req.body.add;
     const item = new Item2({
         name : newName
     });
 //if(listName === day){
     item.save();
     res.redirect("/work");
     
});
app.post("/deletework", (req, res)=>{
  const checkedItemId = req.body.checkbox;
  Item2.findByIdAndRemove(checkedItemId)
  .then(removedDocument => {
    if (removedDocument) {
      console.log('Document removed:', removedDocument);
      res.redirect("/work");
    } else {
      console.log('Document not found.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
app.get("/work",(req, res) =>{
    Item2.find({})
    .then(function(foundItems) {
        
        if(foundItems.length === 0){
            
            Item2.insertMany(defaultItems2)
            .then(function() {
                console.log("Insert succesfull");
            })
            .catch(function(err) {
                console.log(err);
            });
            res.redirect("/work");
 
        }else{
          res.render("work.ejs",{ itemslist : foundItems});
        }
 
    })
    .catch(function(err) {
        console.log(err);
    });
});

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});