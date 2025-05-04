const express = require ('express');
const app = express();
const path = require('path');
const fs= require('fs');
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// rendering the index.ejs HOME page on main route
app.get("/",(req,res)=>
{
    fs.readdir(`./files`,(err, files)=>
    {
        console.log(files);
        res.render("index",{files});
    })
})

// Rendering the form to create a new file
app.get("/create-form", (req, res) => {
    res.render("create-form"); // Rendering create-form.ejs
});


// file creation api

app.post("/create",(req,res)=>
{

    const currentDate= new Date();
    console.log(currentDate);
    const day= String(currentDate.getDate()).padStart(2,'0');
    const month = String(currentDate.getMonth()+1).padStart(2,'0');
    const year = currentDate.getFullYear();
    const fn= `${day}-${month}-${year}.txt`;
    const file_content= req.body.content || "Default content";
    fs.writeFile(`./files/${fn}`, file_content , (err)=>
    {
        if (err)
        {
            return res.send("Something went wrong");
        }
        else
        {
            console.log("file creation done");
            return res.redirect("/"); // Redirecting to home after file is created
        }
    })

});

// viewing a file API

app.get("/file/:fileName",(req,res)=>
{
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname,"files",fileName);
    fs.readFile(filePath,(err,data)=>
    {
        if (err) {
            return res.status(404).send("File not found");
        }

        else
        {
            res.render("file-content", { fileContent: data, fileName: fileName }); //rendering ejs file for file's content
        }

    })
});


//editing file api

app.get("/edit-file/:fileId", (req,res)=>
{
    fs.readFile(`./files/${req.params.fileId}`,"utf-8",(err,data)=>
    {

        if(err)
        {
            return res.send(err);
        }
        else
        {
            res.render("edit",{data: data, file_info: req.params.fileId});
        }

    });


});

app.post ("/update/:filename",(req,res)=>
{
    fs.writeFile(`./files/${req.params.filename}`,req.body.updated_data,(err)=>
    {
        if (err) return res.send(err);
        res.redirect('/');


    })
});

//delete a file

app.delete("/delete-file/:fname", (req, res) => {
    const { fname } = req.params;  // Extract the file name from the URL
    fs.unlink(`./files/${fname}`, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting file' });
        }
        console.log(`${fname} has been deleted`);
        res.status(200).json({ message: `${fname} has been deleted successfully` });
    });
});




app.listen(1234);