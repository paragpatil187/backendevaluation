
const express= require("express");
const mongoose=require("mongoose");
const app = express();

app.use(express.json());



const connect=()=>{
    return mongoose.connect(" mongodb://localhost:27017/parag");
};


const jobSchema= new mongoose.Schema({
    title:{type:String,required:true},
    notice_period:{
        type:Number,required:true
    },
    rating:{
        type:Number,required:true
    },
    work_home:{
        type:Boolean,required:true
    },
    city:{
        type:String,required:true
    },
    skill_ids:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"skill",
        required:true

    }],

},

{
    versionKey:false,
    timestamps:true,
}
);
const Job =mongoose.model("job",jobSchema)

const companySchema= new mongoose.Schema({
    title:{
        type:String,required:true
    },
    job_ids:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"job",
        required:"true"
    }],
    
},{
    versionKey:false,
    timestamps:true,
}
);
const Company=mongoose.model("company",companySchema);


const skillSchema=new mongoose.Schema({
    name:{
        type:String,required:true
    }
},{
    versionKey:false,
    timestamps:true,
}
);
const Skill=mongoose.model("skill",skillSchema);


app.post("/skills",async(req,res)=>{
    try{
        const skill=await Skill.create(req.body);
        return res.status(201).send(skill);
    }
    catch(e){
        return status(500).json({message:e.message, status:"Failed"});
    }
});
app.post("/jobs",async(req,res)=>{
    try{
        const job=await Job.create(req.body);
        return res.status(201).send(job);
    }
    catch(e){
        return status(500).json({message:e.message, status:"Failed"});
    }
});

app.post("/companies",async(req,res)=>{
    try{
        const company=await Company.create(req.body);
        return res.status(201).send(company);
    }
    catch(e){
        return status(500).json({message:e.message, status:"Failed"});
    }
});
////////api to get details of all company with their job descriptions

app.get("/companies",async(req,res)=>{
    try{
        const company=await Company.find().lean().exec();
        return res.send(company);
    }
    catch(e){
        return status(500).json({message:e.message, status:"Failed"});
    }
});
////company that has most jobs done
app.get("/maxjob",async(req,res)=>{
    try{
        const company=await Company.findOne().sort({job_ids:-1})
        return res.send(company);
    }
    catch(e){
        return status(500).json({message:e.message, status:"Failed"});
    }
});
////work from home jobs*/ done
app.get("/online",async(req,res)=>{
    try{
        const job=await Job.find({work_home:true});
        return res.status(200).send(job);
    }
    catch(e){
        res.status(500).json({message:e.message, status:"Failed"});
    }
});
//find job sorted by ratings done

app.get("/ratings",async(req,res)=>{
    try{
        const job=await Job.find();
        return res.status(200).send(job)._construct({rating:-1});
    }
    catch(e){
    res.status(500).json({message:e.message, status:"Failed"});
    }
});
//job two month done
app.get("/notice",async(req,res)=>{
    try{
        const job=await Job.find({
            notice_period:"2"
        })
          return res.status(200).send(job);
    }
    catch(e){
         res.status(500).json({message:e.message, status:"Failed"});
    }
});
//job match will skill done
app.get("/jobs/:id",async(req,res)=>{
    try{
        
        const jobs=await Job.findOne({_id:req.params.id}).populate("skill_ids")
        return res.status(200).send(jobs);
    }
    catch(e){
        return status(500).json({message:e.message, status:"Failed"});
    }
});

















app.listen(2347,async function() {
    await connect();
    console.log("listening 2347")
})