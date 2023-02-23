import Admin from "../model/Admin"
import Socio from "../model/Socio"
import User from "../model/User"


export default () => {

    const obj = {

        status: false,
        index:0,

        isAdmin: (user:User, access?:string) => {
            obj.status = user instanceof Admin
            if(access){
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
            if(access){
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
            if( user instanceof Socio ){
                obj.status = user.getSlug() == slug
            } else {
                obj.status = false
            }
            if(!obj.status) obj.index++;
            return obj
        },

        orIsSameSocio: (user:User, slug:String) => {
            if(obj.status) return obj
            if( user instanceof Socio ){
                obj.status = user.getSlug() == slug
            } else {
                obj.status = false
            }
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