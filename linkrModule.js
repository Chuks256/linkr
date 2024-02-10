let urlModule=require("./urlModule")
let userModule=require("./userModule")
let fsModule=require("fs");
let cryptoModule=require("crypto")

class linkrModule{
    constructor(){
    this.autoCheckSysLog();
    }
    
    autoCheckSysLog(){
        if(! fsModule.existsSync("./data.log")){
            fsModule.writeFileSync("./data.log",JSON.stringify([],null,3),{encoding:"utf-8"})
        }
        else{
            let _syslog=fsModule.readFileSync("./data.log",{encoding:"utf-8"});
            if(_syslog=="" || _syslog==null){
                fsModule.writeFileSync("./data.log",JSON.stringify([],null,3),{encoding:"utf-8"})
            }
        }
    }

    getSysLog(){
        let _syslog=fsModule.readFileSync("./data.log",{encoding:"utf-8"});
        return JSON.parse(_syslog);
    }

    saveGeneralLog(newLog={}){
        let _getSysLog=this.getSysLog();
        _getSysLog.push(newLog);
        let _saveLog=fsModule.writeFileSync("./data.log",JSON.stringify(_getSysLog,null,3),{encoding:"utf-8"});
        if(_saveLog){
            return true 
        }
    }

    verifyUser(paramsItem={}){
        let _getSyslog=this.getSysLog();
        for(const user of _getSyslog){
            if(user.mail != paramsItem.mail && user.pass != paramsItem.pass){
                return false;
            }
            else{
                return true;
            }
        }
    }

    shortenNewUrl(params={}){
        let _getSysLog=this.getSysLog();
        for(let user of _getSysLog){
            if(params.access_key==user.access_key){
                let generateReferenceUrl=cryptoModule.randomBytes(2.5).toString("hex");
                let urlObj=new urlModule(generateReferenceUrl,params.url);
                user.url_collection.push(urlObj);
                fsModule.writeFileSync("./data.log",JSON.stringify(_getSysLog,null,3),{encoding:"utf-8"})
                return {result:generateReferenceUrl,status:"ok"}
            }
            }
        }

    insertNewUser(params={}){
        let encryptPass=cryptoModule.createHash("shake256").update(params.pass).digest().toString("hex");
        let userObj=new userModule(params.mail,encryptPass);
        this.saveGeneralLog(userObj)
        return {access_key:userObj.access_key, status:"ok"}
    }
        
    getUserUrls(){
        let _getSysLog=this.getSysLog();
        for(let user of _getSysLog){
            return [user]
        }
    }

    saveNewData(newData={}){
        fsModule.writeFileSync("./data.log",JSON.stringify(newData,null,3),{encoding:"utf-8"})
        return true
    }

    _getUrlCalls(generatedUrlReference=""){
        let _getSysLog=this.getSysLog();
        for(let user of _getSysLog){
            for(let urls of user.url_collection){
                if(urls.referenceUrl == generatedUrlReference){
                    return {originalurl:urls.originalUrl,status:'ok'}
                }
            }
        }
    }
}

module.exports=linkrModule;
