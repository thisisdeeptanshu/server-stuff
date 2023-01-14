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
app.use(express.static(__dirname + '/css'));
app.set("trust proxy", true)
app.set("view engine", "ejs")

app.get('/', (req, res) => {
    fs.readFile('msgs.txt', 'utf-8', (err, data) => {
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
            ${err}
            `);
            return;
        }
        res.render("main", {data: data});
    });
})

let msgToSend = "";
app.post("/", (req, res) => {
    let body = req.body.text;
    if (body == "" || body.indexOf("`") != -1) {
        res.redirect("/");
        return;
    }

    fs.readFile("names.txt", "utf8", (err, data) => {
        let name = undefined;
        let all_ids = data.split("\n");
        all_ids.forEach(id => {
            if (id.split(" ")[0] == req.ip) {
                name = id.replace(req.ip + " ", "");
            }
        });
        msg = name + "-at-" + year + "-" + month + "-" + date + "?" + hours + ":" + minutes + ":" + seconds + " " + body + "\n"
        if (name == undefined) {
            msgToSend = msg;
            res.redirect("/name");
            return;
        }
        fs.appendFile("msgs.txt", msg, function(err) {
            if(err) {
                return console.error(`AHHHHHHHHH\n${err}` + msg);
            }
        });
        res.redirect("/");
    });
})

app.get("/name", (req, res) => {
    res.render("name");
})
app.post("/name", (req, res) => {
    let name = req.body.name;
    if (name == "") {
        res.redirect("/");
        return;
    }
    fs.appendFile("names.txt", req.ip + " " + name + "\n", (err) => {
        if (err) {
            return console.error(`AWOOGAWOOGAWOOGAWOOGAWOOGAWOOGAWOOGAWOOGAWOOGAWOOGAWOOGAWOOGAWOOGA\n${err}`);
        }
    });
    let msg = name + msgToSend;
    msgToSend = "";
    fs.appendFile("msgs.txt", msg, function(err) {
        if(err) {
            return console.error(`AHHHHHHHHH\n${err}` + msg);
        }
    });
    res.redirect("/");
})

app.get("/uploadfile", (req, res) => {
    res.render("upload");
})
app.post('/uploadfile', function(req,res){  
    upload(req,res,function(err) {  
        if(err) {  
            console.log(err);
            return res.send("Error uploading file.");
        }
        res.redirect("/uploadfile");
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