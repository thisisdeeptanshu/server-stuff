const express = require('express')
const fs = require('fs');
const multer = require("multer")

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({ storage : storage}).single('myfile');

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

const app = express()
const port = 3000

app.use(express.urlencoded());
app.set('trust proxy', true)

app.get('/', (req, res) => {
    fs.readFile('msgs.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(`
            error?
            ⠀⣞⢽⢪⢣⢣⢣⢫⡺⡵⣝⡮⣗⢷⢽⢽⢽⣮⡷⡽⣜⣜⢮⢺⣜⢷⢽⢝⡽⣝
            ⠸⡸⠜⠕⠕⠁⢁⢇⢏⢽⢺⣪⡳⡝⣎⣏⢯⢞⡿⣟⣷⣳⢯⡷⣽⢽⢯⣳⣫⠇
            ⠀⠀⢀⢀⢄⢬⢪⡪⡎⣆⡈⠚⠜⠕⠇⠗⠝⢕⢯⢫⣞⣯⣿⣻⡽⣏⢗⣗⠏⠀
            ⠀⠪⡪⡪⣪⢪⢺⢸⢢⢓⢆⢤⢀⠀⠀⠀⠀⠈⢊⢞⡾⣿⡯⣏⢮⠷⠁⠀⠀
            ⠀⠀⠀⠈⠊⠆⡃⠕⢕⢇⢇⢇⢇⢇⢏⢎⢎⢆⢄⠀⢑⣽⣿⢝⠲⠉⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⡿⠂⠠⠀⡇⢇⠕⢈⣀⠀⠁⠡⠣⡣⡫⣂⣿⠯⢪⠰⠂⠀⠀⠀⠀
            ⠀⠀⠀⠀⡦⡙⡂⢀⢤⢣⠣⡈⣾⡃⠠⠄⠀⡄⢱⣌⣶⢏⢊⠂⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⢝⡲⣜⡮⡏⢎⢌⢂⠙⠢⠐⢀⢘⢵⣽⣿⡿⠁⠁⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠨⣺⡺⡕⡕⡱⡑⡆⡕⡅⡕⡜⡼⢽⡻⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⣼⣳⣫⣾⣵⣗⡵⡱⡡⢣⢑⢕⢜⢕⡝⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⣴⣿⣾⣿⣿⣿⡿⡽⡑⢌⠪⡢⡣⣣⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⡟⡾⣿⢿⢿⢵⣽⣾⣼⣘⢸⢸⣞⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠁⠇⠡⠩⡫⢿⣝⡻⡮⣒⢽⠋⠀⠀⠀⠀
            `);
            return;
        }
        res.send(`
            to download: 192.168.0.129/download/filename<br><br>
            <a href="/uploadfile">file upload</a><br><br>
            <form action="#" method="post">
                <textarea name="text" placeholder="msg"></textarea><br /><br />
                <input type="submit" value="submit">
            </form>
        ` + data.replace(/\r/g, "").split("\n").reverse().join("<br>"))
    });
})

app.post("/", (req, res) => {
    msg = "<h2>" + req.ip + "</h2>" + JSON.stringify(req.body).split("\"")[3] + "<hr>" + "\n"

    fs.appendFile("msgs.txt", msg, function(err) {
        if(err) {
            return console.log("AHHHHHHHHH\n" + msg);
        }
        console.log("written at " + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    });

    res.redirect("/");
})

app.get("/uploadfile", (req, res) => {
    res.send(`
        <a href="/">back</a><br><br>
        <form id="uploadForm" enctype="multipart/form-data" action="#" method="post">
        <input type="file" name="myfile" /><br/><br/>
            <input type="submit" value="Upload">
        </form>
    `)
})
app.post('/uploadfile',function(req,res){  
    upload(req,res,function(err) {  
        if(err) {  
            console.log(err);
            return res.send("Error uploading file.");
        }  
        res.send("dooooooooooooooooooooooooooone");  
    });  
});

app.get("/download/:fn", function(req, res) {
    filename = req.params.fn

    res.download(__dirname+'/uploads/' + filename, function(err) {
        if(err) {
            console.log(err);
        }
    })
})

app.listen(port, "192.168.0.129", () => {
  console.log(`Example app listening on port ${port}`)
})