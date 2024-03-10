const express= require('express');
const app= express();
const mysql= require('mysql');
const cors= require('cors');
const bcrypt= require('bcryptjs');
var bodyParser= require('body-parser');
const jwt= require('jsonwebtoken');
const cookieParser= require('cookie-parser');
// var session= require('express-session');
// const memoryStore= new session.MemoryStore();


// app.use(session({
//     secret: 'some secret', 
//     cookie:{maxAge: 3000},
//     saveUninitialized: false,
//     resave: false,
//     store: memoryStore
// }))
app.use(cors({
    origin: ["http://localhost:3000"],
    methods:["POST", "GET"],
    credentials:true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.options('*', cors());
var db= mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'',
    database:"customer_details"
});

app.use((req,res,next)=>{
    console.log(`${req.method} - ${req.url}`);
    next();
});


var secPass;
var email;
app.post('/signup', async (req,res)=>{
    const salt= await bcrypt.genSalt(10);
    var secPass= req.body.password[0];
    secPass= await bcrypt.hash(secPass, salt);
const values= [
    req.body.name,
    req.body.username,
    req.body.email,
    secPass,
    req.body.address,
    req.body.phone,
]
var u_name=false;
var e_email=false;
const sql= "Select * FROM registration WHERE email = ? OR username= ?";
    //
    db.query(sql, [req.body.email, req.body.username], (err, data)=>{
        
        if(err){
            return res.json("Error");
        }else if(data.length>0){
            for(var i=0; i<data.length;i++){
                if(data[i].username===req.body.username[0]){
                    u_name=true;
                }
                if(data[i].email===req.body.email[0]){
                    e_email=true;
                }
            }
            if(u_name && e_email){
                return res.json("Username and email exists");
            }else if(u_name && !e_email){
                return res.json("Username exists");
            }else if(!u_name && e_email){
                return res.json("Email exists");
            }
        }else {
         
            const sql2= "INSERT INTO registration(name, username, email, password, address, phone) VALUES (?)";
            db.query(sql2, [values], (err, data)=>{
                if(err){
                    return res.json("Error");
                }else return res.json("Success");
            })
        }
    });
})



app.post('/login',  (req,res)=>{
        const sql= "SELECT * FROM registration WHERE email = ?";
        db.query(sql, [req.body.email], (err, data)=>{
            if(err){
                return res.json("Error");
            }
            if(data.length>0){
                
                bcrypt.compare(req.body.password[0], data[0].password, (err, result)=>{
                    if(result){
                        email= req.body.email;
                        const id= data[0].id;
                const token= jwt.sign({id}, "jwtSecretKey", {expiresIn:'1d'});
                res.cookie('token',token);
                        return res.json({Login: true, token, data});
                    }else return res.json("Wrong Password");
                })}
            else{
                return res.json("Failed");
            }
        });
    })
const verifyJwt=(req,res,next)=>{
    const token= req.headers["access-token"];
    if(!token){
        return res.json("we need token")
    }else{
        jwt.verify(token, "jwtSecretKey", (err, decoded)=>{
            if(err){
                return res.json("Not authenticated")
            }else{
                req.userId= decoded.id;
                next();
            }
        })
    }
}

const verifyUser=(req,res,next)=>{
    const token= req.cookies.token;
    if(!token){
        return res.json({Error:"Not authenticated"})
    }else{
        jwt.verify(token, "jwtSecretKey", (err, decoded)=>{
            if(err){
                return res.json({Error:"token not correct"})
            }else{
                req.userId=decoded.id
next();
            }
        })
    }
}

app.get('/',verifyUser, (req,res)=>{
return res.json({Status: "Success", userId: req.userId});
})

app.get('/checkAuth', verifyJwt,(req,res)=>{
   return res.json("Authenticated")
})

app.get('/logout', (req,res)=>{
    res.clearCookie('token');
    return res.json({Status: "Success"});
})

app.get('/my_account',verifyJwt ,(req, res)=>{

    console.log(req.userId);
    const sql= 'SELECT * FROM registration WHERE id= ?'
    db.query(sql, [req.userId], (err, data)=>{
        return res.json({Status: "Success", data});
    })
})

app.listen(8081, (err)=>{
    if(err) console.log(err);
    console.log("listening");
})