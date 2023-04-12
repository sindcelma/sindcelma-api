import Admin from "../model/Admin"
import Socio from "../model/Socio"
import User from "../model/User"


export default () => {

    const obj = {

        status: false,
        index:0,

        isMaster: (user:User) => {
            if(!(user instanceof Admin)){
                obj.status = false
            } else {
                const adm  = user as Admin
                obj.status = adm.isMaster()
            }
            return obj
        },

        isAdmin: (user:User, access?:string) => {
            obj.status = user instanceof Admin
            if(obj.status && access){
                const adm = user as Admin
                if(!adm.isMaster()){
                    obj.status = adm.hasAccess(access)
                }
            }
            if(!obj.status) obj.index++;
            return obj
        },

        orIsAdmin: (user:User, access?:string) => {
            if(obj.status) return obj
            obj.status = user instanceof Admin
            if(obj.status && access){
                const adm = user as Admin
                if(!adm.isMaster()){
                    obj.status = adm.hasAccess(access)
                }
            }
            if(!obj.status) obj.index++;
            return obj
        },
        
        isSocio: (user:User) => {
            obj.status = user instanceof Socio
            if(!obj.status) obj.index++;
            return obj
        },

        orIsSocio: (user:User) => {
            if(obj.status) return obj
            obj.status = user instanceof Socio
            if(!obj.status) obj.index++;
            return obj
        },

        isSameSocio: (user:User, slug:String) => {
            let socio = user as Socio
            obj.status = socio.getSlug().trim() == slug.trim()
            if(!obj.status) obj.index++;
            return obj
        },

        orIsSameSocio: (user:User, slug:String) => {
            if(obj.status) return obj
            let socio = user as Socio
            obj.status = socio.getSlug().trim() == slug.trim()
            if(!obj.status) obj.index++;
            return obj
        },

        assert: () => {
            if(!obj.status){
                throw new Error("Error in assertion");
            }
            return obj;
        }
    
    }

    return obj

}