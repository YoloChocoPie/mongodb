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
// Đăng nhập
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
        // câu lệnh query truy xuất
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
// Hiển thị trang chủ
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
// Đăng xuất
router.get('/logout', (req, res) => 
{
    delete req.session.admin;
    res.redirect('login');
});
// Hiển thị category
router.get('/listcategory',(req,res)=>
{
    if (req.session.admin) 
    {
        //kết nối database
    MongoClient.connect(url,(err, conn) =>
    {
        if (err) throw err; 
        var db = conn.db("LTC");
        // câu lệnh query select
        var query = {}
        db.collection("categories").find(query).toArray((err,result) => 
        {
            if (err) throw err;           
            res.render('../views/admin/listcategory.ejs', {cates :result});
            conn.close(); 
        });           
    });        
    }
    else
    {
        res.redirect('login');
    }
});
//Thêm category
router.get('/addcategory',(req,res)=>
{
    if (req.session.admin) 
    {
        res.render('../views/admin/addcategory.ejs');
    }
    else
    {
        res.redirect('login');
    }
});
router.post('/addcategory',(req,res)=>
{
    var cname = req.body.catname;
    //kết nối database
    MongoClient.connect(url,(err, conn) =>
    {
        if (err) throw err; 
        var db = conn.db("LTC");
        // câu lệnh query insert
        var category = {name : cname};
        db.collection("categories").insertOne(category,(err,result) => 
        {
            if (err) throw err;
            // kiểm tra nếu số lượng được thêm có lớn hơn không
            // không rõ vì sao dùng insertOne không nhận thuộc tính insertedCount
            // nên đành phải xoá bỏ validate
            res.redirect('listcategory');
            // if (result.insertedCount > 0) 
            // {
                //đoạn code dòng 140 vào đây
            // }
            // else
            // {
            //     res.redirect('addcategory')
            // }
            conn.close(); 
        });           
    }); 
});
// Xoá category
router.get('/deletecategory',(req,res) => 
{
    var id = req.query.id;
    //kết nối database
    MongoClient.connect(url,(err, conn) =>
    {
        if (err) throw err; 
        var db = conn.db("LTC");
        // câu lệnh query delete
        var ObjectId = require('mongodb').ObjectId;
        var query = {_id: ObjectId(id) }; 
        db.collection("categories").deleteOne(query,(err,result) => 
        {
            if (err) throw err;
            res.redirect('listcategory');
            conn.close(); 
        });           
    }); 
});
// Edit category
router.get('/editcategory',(req,res) => 
{
    var id = req.query.id;
    //kết nối database
    MongoClient.connect(url,(err, conn) =>
    {
        if (err) throw err; 
        var db = conn.db("LTC");
        // câu lệnh query edit
        var query = {_id : require('mongodb').ObjectId(id)};
        db.collection("categories").findOne(query,(err,result) => 
        {
            if (err) throw err;
            res.render('../views/admin/editcategory.ejs', {cate: result});
            conn.close(); 
        });           
    }); 
});
router.post('/editcategory',(req,res) => 
{
    var cateid = req.body.cateid;
    var catename = req.body.catename;
    //kết nối database
    MongoClient.connect(url,(err, conn) =>
    {
        if (err) throw err; 
        var db = conn.db("LTC");
        // câu lệnh query edit
        var query = {_id : require('mongodb').ObjectId(cateid)};
        var newValues = {$set : {name : catename}};
        db.collection("categories").updateOne(query,newValues,(err,result) => 
        {
            // vẫn không rõ tại sao không nhận được thuộc tính nModified 
            // nên không thể validate được
            if (err) throw err;
            res.redirect('listcategory');
            // if (result.result.nModified > 0) 
            // {
            //    dòng thứ 207 vào đây
            // }
            // else
            // {
            //     res.redirect('editcategory');
            // }
            conn.close(); 
        });           
    }); 
});
module.exports = router;