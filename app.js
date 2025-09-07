const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing=require("./models/listing.js");
const methodOverride = require("method-override");
const path=require("path");
const ejsMate=require("ejs-mate");

const MONGO_URL="mongodb://127.0.0.1:27017/Tripify";
main().then(()=>{
    console.log("connected to mongoDB");
}).catch(err=>{
    console.log(err);
});
async function main(){
await mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded ({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));


app.get("/",(req,res)=>{
    res.send("Hello World!");
});
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index",{allListings});
});
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});
app.post("/listings", async (req, res) => {
    try {
        const { title, description, image, price, country, location } = req.body;
        const newListing = new Listing({
            title,
            description,
            image: { url: image, filename: "" },
            price,
            country,
            location,
        });
        await newListing.save();
        res.redirect(`/listings/${newListing._id}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed to create listing");
    }
});
app.get("/listings/:id/edit",async(req,res)=>{
    let{id}=req.params;
const listing=await Listing.findById(id);
res.render("listings/edit.ejs",{listing});
})
app.get("/listings/:id",async(req,res)=>{
let{id}=req.params;
const listing=await Listing.findById(id);
res.render("listings/show.ejs",{listing});
});

app.put("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image, price, country, location } = req.body;
        const updated = await Listing.findByIdAndUpdate(
            id,
            {
                title,
                description,
                image: { url: image, filename: "" },
                price,
                country,
                location,
            },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).send("Listing not found");
        res.redirect(`/listings/${updated._id}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed to update listing");
    }
});

app.delete("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Listing.findByIdAndDelete(id);
        if (!deleted) return res.status(404).send("Listing not found");
        console.log("Deleted listing:", deleted);
        res.redirect("/listings");
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed to delete listing");
    }
});

// Helper route: delete a listing by title via query string (e.g., ?title=ayush)
app.get("/listings/delete-by-title", async (req, res) => {
    try {
        const { title } = req.query;
        if (!title) return res.status(400).send("Provide title query param");
        const deleted = await Listing.findOneAndDelete({ title });
        if (!deleted) return res.status(404).send("No listing found with that title");
        console.log("Deleted by title:", deleted);
        res.send(`Deleted listing titled: ${deleted.title}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed to delete by title");
    }
});

// 
// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"White Castle",
//         description:"By the beach",
//         price:100,
//         location:"Ladakh",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send(sampleListing);
// });
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});