const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());

var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: "customer_details"
});

app.use((req, res, next) => {
    next();
});

var secPass;
var email;
app.post('/signup', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    var secPass = req.body.password[0];
    secPass = await bcrypt.hash(secPass, salt);
    const values = [
        req.body.name,
        req.body.username,
        req.body.email,
        secPass,
        req.body.address,
        req.body.phone,
    ];
    var u_name = false;
    var e_email = false;
    const sql = "Select * FROM registration WHERE email = ? OR username= ?";
    db.query(sql, [req.body.email, req.body.username], (err, data) => {
        if (err) {
            return res.json("Error");
        } else if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].username === req.body.username[0]) {
                    u_name = true;
                }
                if (data[i].email === req.body.email[0]) {
                    e_email = true;
                }
            }
            if (u_name && e_email) {
                return res.json("Username and email exists");
            } else if (u_name && !e_email) {
                return res.json("Username exists");
            } else if (!u_name && e_email) {
                return res.json("Email exists");
            }
        } else {
            const sql2 = "INSERT INTO registration(name, username, email, password, address, phone) VALUES (?)";
            db.query(sql2, [values], (err, data) => {
                if (err) {
                    return res.json("Error");
                } else return res.json("Success");
            })
        }
    });
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM registration WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if (data.length > 0) {
            bcrypt.compare(req.body.password[0], data[0].password, (err, result) => {
                if (result) {
                    email = req.body.email;
                    const id = data[0].id;
                    const token = jwt.sign({ id }, "jwtSecretKey", { expiresIn: '1h' }); // Set expiration to 1 hour
                    
                    return res.json({ Login: true, token, data });
                } else return res.json("Wrong Password");
            })
        } else {
            return res.json("Failed");
        }
    });
})

const verifyJwt = (req, res, next) => {
    const token = req.header('access-token');
    if (!token) {
        return res.json({ Error: "Not authenticated" })
    } else {
        jwt.verify(token, "jwtSecretKey", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token not correct" })
            } else {
                req.userId = decoded.id
                next();
            }
        })
    }
}

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "Not authenticated" })
    } else {
        jwt.verify(token, "jwtSecretKey", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token not correct" })
            } else {
                req.userId = decoded.id
                next();
            }
        })
    }
}

app.get('/', verifyUser, (req, res) => {
    return res.json({ Status: "Success", userId: req.userId });
})

app.get('/checkAuth', verifyJwt, (req, res) => {
    return res.json("Authenticated")
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success", message: "Token expired and removed" });
})

app.get('/my_account', verifyJwt, (req, res) => {
    const sql = 'SELECT * FROM registration WHERE id= ?'

    db.query(sql, [req.userId], (err, data) => {
        return res.json({ Status: "Success", data });
    })
})



app.put('/update', (req, res) => {
    const token = req.header("access-token");
    const { name, email, phone, address } = req.body;
    jwt.verify(token, 'jwtSecretKey', function (err, decoded) {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }
        const userid = decoded.id;
        const sql = 'UPDATE registration SET name=?, email=?, phone=?, address=? WHERE id=?';
        db.query(sql, [name, email, phone, address, userid], (err, result) => {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).send({ message: 'Internal Server Error' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).send({ message: 'User not found' });
            }
            res.status(200).send({ message: 'User details updated successfully' });
        });
    });
});

app.post('/forgot-password', async (req, res) => {

    try {
        const sql = 'UPDATE registration SET password=? WHERE email=?';
        const chk = 'SELECT username FROM registration WHERE email = ?'
        const password = Math.random()   // Generate random number, eg: 0.123456
            .toString(36)    // Convert  to base-36 : "0.4fzyo82mvyr"
            .slice(-8)// Cut off last 8 characters : "yo82mvyr"


        const enPassword = await bcrypt.hashSync(password, 10);

        db.query(chk, [req.body.email], (err, response) => {
           
            if (response.length) {
                db.query(sql, [enPassword, req.body.email], (err, result) => {
                    if (err) {
                        console.error('Error updating user:', err);
                        return res.status(500).send({ message: 'Internal Server Error' });
                    }
                    if (result.affectedRows === 0) {
                        return res.status(404).send({ message: 'User not found' });
                    }
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.SENDER_EMAIL,
                            pass: process.env.SENDER_PASSWORD
                            
                        },
                    });

                    const mail = {
                        from: process.env.SENDER_EMAIL,
                        to: req.body.email,
                        subject: "Reset Password",
                        text: `Your new password is : ${password}`

                    }

                    transporter.sendMail(mail).then(() => {

                        return res.status(200).json({ message: 'Password is updated. Check your registered mail' })
                    }
                    )
                });
            }
            else return res.status(200).json({ message: 'Password is updated. Check your registered mail' })

        });


    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Error' })

    }
})

app.listen(8081, () => {
    console.log("Server is running on port 8081");
});
