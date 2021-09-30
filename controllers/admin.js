var express = require('express');
var router = express.Router();
// mã hoá mật khẩu
var crypto = require('crypto');
// install mongo và khai báo
// khai báo thông tin về database đã đăng kí tại web
var MongoClient = require('mongodb').MongoClient;
const { defaultMaxListeners } = require('events');
var url = "mongodb+srv://LTC:3SkFmOMAV791Uj5Y@clusterltc.ojybn.mongodb.net/LTC";


//routing

router.get('/',(req,res) => 
{
    // kiểm tra nếu đã đăng nhập rồi thì sẽ render home
    // không thì lại đá về trang login
    if (req.session.admin) 
    {
        res.redirect('home');    
    }
    else
    {
        res.redirect('login');
    }
 
});
router.get('/login',(req, res)=>
{
    res.render('../views/admin/login.ejs');
});
router.post('/login', (req, res) => 
{
    var uname = req.body.username;
    var pwd = req.body.password;
    //thực hiện mã hoá
    var pwdHashed= crypto.createHash('md5').update(pwd).digest('hex');
    //kết nối database
    MongoClient.connect(url,(err, conn) =>
    {
        if (err) throw err; 
        var db = conn.db("LTC");
        var query = 
        { 
            username : uname, password : pwdHashed 
        };
        db.collection("admins").findOne(query, (err, result) =>
        {
            if (err) throw err;
            if (result) 
            {
                // nếu đăng nhập thành công lưu lại session
                req.session.admin = result;
                res.redirect('home');
            }
            else
            {
                res.redirect('login');
            }
            conn.close();             
        });            
    }); 
});
router.get('/home', (req,res) => 
{
    // kiểm tra nếu có session thì render trang home
    // không có thì đá về trang login
    if (req.session.admin) 
    {
        res.render('../views/admin/home.ejs');
    }
    else
    {
        res.redirect('login');
    }
   
});
router.get('/logout', (req, res) => 
{
    delete req.session.admin;
    res.redirect('login');
});

module.exports = router;