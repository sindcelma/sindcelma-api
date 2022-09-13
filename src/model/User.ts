abstract class User {
    
    private sess:string
    private type:String

    constructor(type:String, sess:string = "") {
        this.type = type
        this.sess = sess
    }

    public getType(){
        return this.type
    }

    public getSession(){
        return this.sess
    }

    public setSession(sess:string){
        this.sess = sess
    }

}

export default User