import express from 'express';
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";

const app = express();

const uri = "mongodb://127.0.0.1/wikiDB";

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
}

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);


////////////////////////// ROUTE FOR ALL ARTICLES /////////////////////////////////

app.route("/articles")

.get(function (req, res) {
  Article.find().then(function(foundarticles){
      res.send(foundarticles);
  });
})

.post(function (req, res) {
  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });

  newArticle.save().then(function(){
    res.send("Succesfully created");
  });
})

.delete(function(req,res){
  Article.deleteMany().then(function(){
  res.send("Succesfully Deleted Everything!!!");
})
});


////////////////////////// ROUTE FOR SPECIFIC ARTICLES /////////////////////////////////


app.route("/articles/:articleTitle")

.get(function(req,res){

  Article.findOne({title: req.params.articleTitle}).then(function(foundarticle){
    if(foundarticle){
      res.send(foundarticle);
    }else{
      res.send("No article Found!!!");
    }
  })
})
.put(async (req, res) => {
  const updatedArticle = await Article.replaceOne(
    { title: req.params.articleTitle },
    { title: req.body.title, content: req.body.content })
    .then(function(err){
      if(err){
        res.send("success!!!");
      }
    })
    .catch(err => {
      res.send(err);
    });
})

.patch(async (req, res) => {
  try {
    const updatedArticle = await Article.updateOne(
      {title:req.params.articleTitle},
      req.body,
      {
        "new":true
      })
    res.send("Patched Article!!!");
  } 
  catch(err){
    res.status(500).json({error:"Modification Failed-->:"+ ree});
  }    
})

.delete(async (req, res) => {
  try{
    const deletedArticle = await Article.deleteOne(
      {title:req.params.articleTitle}
    );
    res.send("Delete Successful!!!");
  }
  catch(err){
    res.send(err);
  }
});

app.listen(3000, function(){
    console.log('listening on port 3000');
});