const express = require("express");
const app = express();
const router = express.Router();
const { readFileSync , writeFileSync } = require("fs");
const path = require("path");

app.set("view engine","pug");
app.set("views",path.resolve("./dist"));
app.use(express.json())

router.get("/books",(req,res,next)=>{
    try{
        res.render("books" ,{books : readFilesWithSync()})
    }catch(error){
        res.send(error);
    }
})


router.get("/books/:id",(req,res,next)=>{
    const book = readFilesWithSync().find(book => book.id == req.params.id)
    
    if(book){
        if(book.id == req.params.id){
            res.render("book",{book : book})
        }else{
            res.status(404).send("<h1>ERROR 404 Requested book was not found</h1>");
        }
    }
})

router.post("/books",(req,res)=>{

    if(validateBody(req.body)){
        const {name} = req.body;
        const newBook = {};
        
        let arrayOfBooks = readFilesWithSync();
        let newId = arrayOfBooks[arrayOfBooks.length - 1].id + 1
        if(arrayOfBooks.find((book)=> book.name == name)){
            console.log("founded book")
            throw new Error("Book already existed")
        }
        newBook.id = newId;
        newBook.name = name;
        arrayOfBooks.push(newBook);

        // new book must be the data
        let books = {};
        books.books = arrayOfBooks;
        console.log(books)
        writeFileSync("./books.json", JSON.stringify(books));
    }

    res.send("success"); 

})


router.all("*",(req,res)=>{
    res.status(404).send("<h1>ERROR 404 PAGE NOT FOUND</h1>")
})

app.use(router);
app.listen(3001);

// This object return the array of book objects
function readFilesWithSync(path = "./books.json",format = "utf-8"){
    try {
        const booksList = readFileSync(path,format);
        return arrBooksList = JSON.parse(booksList).books;
    }catch(error){
        console.log(`error was catched during attempt to read the file ${error}`)
    }
}

function validateBody(body){
    if(typeof(body) != "object"){
        throw new Error("body must be sent as object")  
    }
    if(body.name){
        if(body.name.length <= 2 || body.name.length > 40){
            throw new Error("Book name must be at least 3 letters and max 40 letters");
        }
    }else{
        throw new Error("Book name does not exist")
    }
    return true;
}

