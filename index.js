require("dotenv").config();
let express=require("express")
let app=express();
let cors=require("cors")
let bodyparser=require("body-parser");
const port = process.env.PORT || 5000;
let linkrModule=require('./linkrModule')
let cryptoModule=require("crypto")
let defineModule=new linkrModule();

app.use(cors());
app.disable('x-powered-by');
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.json({msg:'all is well'})
})

app.post("/getAccessKey",(req,res)=>{
    let defineParams={
        mail:req.body.mail,
        pass:cryptoModule.createHash("sha256").update(req.body.pass).digest().toString("hex")
    }
    let getParams=defineModule.insertNewUser(defineParams);
    res.json(getParams)
});

app.post("/shortenUrl",(req,res)=>{
    if(req.body.access_key.length==0){
        res.json({msg:"your access key cannt be void", status:"failed"})
    }
    let _defineParams={
        url:req.body.url,
        access_key:req.body.access_key
    }
    let _getParams=defineModule.shortenNewUrl(_defineParams)
        res.json({generatedUrl:`http://${req.hostname}:${port}/${_getParams.result}`})
})

app.get(`/:referenceUrl`,(req,res)=>{
    let _defineParams=defineModule._getUrlCalls(req.params.referenceUrl)
    if(_defineParams==undefined){
        res.json({msg:"invalid url provided",status:"failed"})
    }
    else{
        res.redirect(_defineParams.originalurl)
    }
})

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
