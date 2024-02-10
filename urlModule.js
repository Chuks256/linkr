
let cryptoModule=require("crypto");

class urlModule{
    constructor(referenceUrl="",originalUrl=""){
        this.id=cryptoModule.randomBytes(4).toString("hex");
        this.referenceUrl=referenceUrl;
        this.originalUrl=originalUrl;
    }
}

module.exports=urlModule;