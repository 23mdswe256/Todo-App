const express=require("express");
const mongoose= require("mongoose");
const cors=require("cors");
require("dotenv").config();

const app=express();
app.use(express.json());
app.use(cors());
todosRoutes=require("./routes/todoRoutes");
app.use("/api/todos",todosRoutes);

mongoose.connect(process.env.MONGOURL)
.then(()=>console.log("MONGODB connected"))
.catch(err=>console.log(err));

const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})
