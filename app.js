const express = require('express')
const fs = require('fs');
const multer = require("multer")
const { exec } = require('node:child_process')

let lastUsed = "";

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var storage2 = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './temp-uploads');
    },
    filename: function (req, file, callback) {
        callback(null, lastUsed.replace("|||", " ") + "." + file.originalname.split(".")[file.originalname.split(".").length - 1]);
    }
});
var upload = multer({ storage : storage}).single('myfile');
var upload2 = multer({ storage : storage2}).single('myfile');

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
            no success?
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
        msg = "-at-" + year + "-" + month + "-" + date + "?" + hours + ":" + minutes + ":" + seconds + " " + body + "\n"
        if (name == undefined) {
            msgToSend = msg;
            res.redirect("/name");
            return;
        } else msg = name + msg;
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
    name = name.replace(" ", "|||")
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
app.post('/uploadfile', function(req, res){  
    upload(req, res, function(err) {  
        if(err) {  
            console.log(err);
            return res.send("Error uploading file.");
        }
        res.redirect("/uploadfile");
    });  
});

app.get("/download/:fn", function(req, res) {
    filename = req.params.fn;

    res.download(__dirname + '/uploads/' + filename, function(err) {
        if(err) {
            console.log(err);
        }
    })
})

let merchants = [];
let sellings = {};
app.get("/ftp", function(req, res) {
    // merchants.append(req.ip);
    res.render("ftp", {merchants : merchants});
})
app.post("/ftp", (req, res) => {
    fs.readFile("names.txt", "utf8", (err, data) => {
        let name = undefined;
        let all_ids = data.split("\n");
        all_ids.forEach(id => {
            if (id.split(" ")[0] == req.ip) {
                name = id.replace(req.ip + " ", "");
            }
        });
        if (name == undefined) {
            name = req.ip;
        }
        
        let index = merchants.indexOf(name);
        if (index != -1) {
            let fileName = name.replace("|||", " ");
            merchants.splice(index, 1);
            fs.readdir(__dirname + "/temp-uploads/", (err, files) => {
                files.forEach(file => {
                    if (file.includes(fileName)) {
                        fs.unlink(__dirname + "/temp-uploads/" + file, (err) => {
                            if (err) console.error(err);
                        })
                    }
                });
            });

        } else {
            merchants.push(name);
            lastUsed = name;
        }
        upload2(req, res, function(err) {  
            if(err) {  
                console.log(err);
                return res.send("Error uploading file.");
            }
        });
        res.redirect("/ftp");
    });
})

app.get("/ftpdownload/:ip", function(req, res) {
    let fileName = req.params.ip.replace("|||", " ");
    fs.readdir(__dirname + "/temp-uploads/", (err, files) => {
        files.forEach(file => {
            if (file.includes(fileName)) {
                res.download(__dirname + '/temp-uploads/' + file, function(err) {
                    if(err) {
                        console.log(err);
                    }
                })
            }
        });
    });
})

app.get("/music/:fn", function(req, res) {
    filename = req.params.fn;

    exec('vlc ./uploads/\"' + filename + '\"', (err, output) => {
        // once the command has completed, the callback function is called
        if (err) {
            // log and return if we encounter an error
            console.error("could not execute command: ", err)
            return
        }
        // log the output received from the command
        console.log("Output: \n", output)
    })
})

app.get("/musicstop/", function(req, res) {
    filename = req.params.fn;

    exec('killall -9 vlc', (err, output) => {
        // once the command has completed, the callback function is called
        if (err) {
            // log and return if we encounter an error
            console.error("could not execute command: ", err)
            return
        }
        // log the output received from the command
        console.log("Output: \n", output)
    })
})

app.listen(port, "192.168.0.129", () => {
  console.log(`Example app listening on port ${port}`)
})