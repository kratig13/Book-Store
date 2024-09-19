const router = require("express").Router();
const User = require("../models/user")
const {authenticateToken} = require("./userAuth");
require("dotenv").config();

// add favourite books
router.put("add-book-to-favourite", authenticateToken, async(req,res)=>{
    try{
        const {bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isBookFav = userData.favourites.inculdes(bookid);
        if(!isBookFav){
            return res.status(200).json({message:"Book is already in favourites"});
        }
        await User.findByIdAndUpdate(id,{$push:{favourites: bookid}});
        return res.status(200).json({message:"Book is added to the favourites"});
    }catch(error){
        res.status(500).json({message:"Internal Server Error"})
    }
});

// delete a book from favourites
router.delete("remove-book-from-favourite", authenticateToken, async(req,res)=>{
    try{
        const {bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isBookFav = userData.favourites.inculdes(bookid);
        if(isBookFav){
            await User.findByIdAndUpdate(id,{$pull:{favourites: bookid}});
        }
        return res.status(200).json({message:"Book removed from favourites"});
    }catch(error){
        res.status(500).json({message:"Internal Server Error"})
    }
});

// get all the favourites books
router.get("get-favourite-books", authenticateToken, async(req,res)=>{
    try{
        const {id} = req.headers;
        const userData = await User.findById(id).populate('favourites');
        const favBooks = userData.favourites;
        return res.json({status:"Success", data:favBooks});
    }catch(error){
        res.status(500).json({message:"An error Occurred"})
    }
});


module.exports = router;