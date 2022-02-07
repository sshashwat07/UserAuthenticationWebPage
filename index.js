import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

const DB = 'mongodb+srv://sshashwat07:Shashwat123@cluster0.gxhrf.mongodb.net/mern?retryWrites=true&w=majority'

// mongodb+srv://sshashwat07:Shashwat123@cluster0.gxhrf.mongodb.net/mern?retryWrites=true&w=majority
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log(`DATABASE Connection Successful`);
    
}).catch((err) => console.log(`Unable to Connect DATABASE`));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

//Routes
app.post("/login", (req, res)=> {
    const { email, password} = req.body
    User.findOne({ email: email}, (err, user) => {
        if(user){
            if(password === user.password ) {
                res.send({message: "Login Successfull", user: user})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    })
}) 

app.post("/register", async (req, res)=> {
    
    const { name, email, password} = req.body

    try {
        const userExist = await User.findOne({email: email})
            if(userExist){
                return res.send({message: "User already registerd"})
            } else {
                const user = new User({
                    name,
                    email,
                    password
                })
                await user.save();
                
                return res.status(201).send({ message: "User Registered Successfully" });

            }
    } catch (error) {
        console.log(error);
    }
    
    
}) 

app.listen(8000,() => {
    console.log("BE started at port 8000")
})