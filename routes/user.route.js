const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
// import bcrypt
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
// import User model
const User = require('../models/user')

// config email transporter
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'chaker.nehos@gmail.com',
        pass: 'auqk kijg ntsh elzg'
    },
    tls: {
        rejectUnauthorized: false
    }
})

// créer un nouvel utilisateur
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body

    const user = await User.findOne({ email })
    if (user) return res.status(401).json({ success: false, message: 'Utilisateur déjà existe' })
    const newUser = new User({email, password, firstname, lastname})
    // ajouter un middleware pour le cryptage
    const createdUser = await newUser.save()

    // send email inscription to user
    var emailOption = {
        from :'"verify your email " <chaker.nehos@gmail.com>',
        to: newUser.email,
        subject: 'vérification your email inscription',
        html: `<h2>${newUser.firstname}! thank you for registreting on our website</h2>
                        <h4>please verify your email to procced.. </h4>
                        <a href="http://${req.headers.host}/api/users/status/edit?email=${newUser.email}">click here</a>`
    }
    transporter.sendMail(emailOption, (error, info) => {
        if(error){
            console.log(error.message);
        }else {
            console.log("verification email sent to your gmail ");
        }
    })
    //return
    return res.status(201).json({success: true,message: 'Utilisateur crée avec succés',user: createdUser})
  } catch (error) {
    console.log(error.message)
    res.status(404).json({ success: false, message: error })
  }
})


// afficher la liste des utilisateurs
router.get('/', async(req, res) => {
    try {
        const users = await User.find().select("-password");
        return res.status(200).json({success: true, users:users, message: "La liste des utilisateurs"});
    } catch (error) {
        console.log(error.message)
        res.status(404).json({success: false, message: error.message});
    }
})


// as a admin i can disable or enable an account
router.get('/status/edit', async(req, res) => {
    try {
        let email = req.query.email;
        let user = await User.findOne({email});
        user.isActive = !user.isActive;
        user.save();
        return res.status(200).send({success: true, user});
    } catch (error) {
        console.log(error.message);
        res.status(404).send({success: false, error: error.message});
    }
})

// login
router.post('/login', async(req, res) => {
    try {
        let {email, password} = req.body;
        if(!email || !password) {
            res.status(404).json({success: false, message: "All fileds are required"})
        }
        // find user
        let user = await User.findOne({email}).select("+password").select("+isActive");
        if(!user){
             return re.status(404).json({success: false, message: "Account does not exist"});
        } else {
            let isCorrectPassword = await bcrypt.compare(password, user.password);
            if(isCorrectPassword) {
                delete user._doc.password;
                if(!user.isActive){
                    return res.status(200).json({success: false, message:"Your account is not active, please contact your administrator"})
                }
                const token = jwt.sign({iduser: user._id, name: user.firstname, role: user.role}, process.env.SECRET, {expiresIn: "21h"});

                return res.status(200).json({success: true, user, token: token});
            }else {
                return res.status(404).json({success: false, message: "Verify your credentials"});
            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({success: false, message:error.message});
    }
})

module.exports = router;
