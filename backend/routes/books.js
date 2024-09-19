const router = require("express").Router();
const User = require("../models/user")
const jwt = require("jsonwebtoken");
const Book = require("../models/book");
const {authenticateToken} = require("./userAuth");

// Add book --admin
router.post("/add-book", authenticateToken, async(req,res)=>{
    try{
        const {id} = req.headers;
        const user = await User.findById(id);
        if(user.role !== "admin"){
            return res.status(400).json({message: "You are not having access to perform admin work"});
        }
        const book = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });
        await book.save();
        res.status(200).json({message:"Book created successfully"});
    }catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
})
// update book
router.put("/update-book",authenticateToken, async(req,res)=>{
    try{
        const {bookid} = req.headers;
        await Book.findByIdAndUpdate(bookif,{
                url: req.body.url,
                title: req.body.title,
                author: req.body.author,
                price: req.body.price,
                desc: req.body.desc,
                language: req.body.language,
            });

        return res.status(200).json({message: "Book Updated Successfully"});

    }catch(error){
        return res.status(500).json({message:"An error occurred"});
    }
});
// delete a book
router.delete("/delete-book", authenticateToken, async(req,res)=>{
    try{
        const {bookid} = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({
            message:"Book deleted successfully!"
        });
    }catch(error){
        return res.status(500).json({message:"An error occured"});
    }
});
// Get all the books
router.get("/get-books",async(req,res)=>{
    try{
        const books = await Book.find().sort({createAt:-1});
        return res.json({status:"Success",data:books,});
    }catch(error){
        return res.status(500).json({message:"An error occurred"});
    }
});
// get recently added books limit 4
router.get("/get-recent-books",async(req,res)=>{
    try{
        const books = await Book.find().sort({createdAt:-1}).limit(4);
        return res.json({status:"Success",data:books});
    }catch(error){
        return res.status(500).json({message:"An error occurred"});
    }
})
// get books by id
router.get("/get-books-by-id/:id", async(req,res)=>{
    try{
        const {id} = req.params;
        const book = await Book.findById(id);
        return res.json({status:"Success", data:book});
    }catch(error){
        return res.status(500).json({message:"An error occurred"});
    }
});
module.exports = router;
