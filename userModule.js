// define required modules 
let cryptoModule=require("crypto");


//  define user module 
class userModule{
    constructor(mail="",pass="",url_collection=[]){
        this.id=cryptoModule.randomBytes(3).toString("hex")
        this.mail=mail;
        this.pass=pass;
        this.url_collection=url_collection;
        this.access_key=cryptoModule.randomBytes(6).toString("hex");
    }    
}

module.exports=userModule;