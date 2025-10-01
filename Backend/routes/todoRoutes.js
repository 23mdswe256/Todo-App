const express=require("express");
const router=express.Router();
const Todo=require("../models/Todo");

router.get("/",async(req,res)=>{
const todos=await Todo.find();
res.json(todos);
});

router.post("/",async(req,res)=>{
    const todos= new Todo({
        text:req.body.text
    });
    await todos.save();
    res.json(todos);
    });

    router.put("/:id",async(req,res)=>{
        const todos=await Todo.findByIdAndUpdate(
            req.params.id,
            {
                completed:req.body.completed
            },
             {
                    new: true
                }

        );
        res.json(todos);
        });

        router.delete("/:id",async(req,res)=>{
            const todos=await Todo.findByIdAndDelete(req.params.id);
            res.json(todos);
            });

            module.exports=router;
