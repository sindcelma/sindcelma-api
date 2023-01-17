import AWS from 'aws-sdk'
import Config from './config'


interface emailInfo {accessKeyId:string, secretAccessKey:string, region:string}

class EmailSender {

    private apiversion:string = '2010-12-01'

    private info:emailInfo 

    private de:string
    private para:string 
    private assunto:string

    private data:{}

    private template:string

    constructor(info:emailInfo){
        this.info = info
    }

    public config(config:{de:string, para:string, assunto:string, data?:{}}){
        this.data    = config.data ?? this.data
        this.de      = config.de 
        this.para    = config.para 
        this.assunto = config.assunto
        return this;
    }

    public setTemplate(template:string){
        this.template = template
        return this;
    }

    private generateTemplate(){
        let keys = Object.keys(this.data)
        
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const res = `\\$\\{${key}\\}`
            let reg = RegExp(res, 'gi')
            this.template = this.template.replace(reg, this.data[key])
        }
    }

    public send(){
        
        this.generateTemplate()

        new AWS.SES({
            accessKeyId:this.info.accessKeyId,
            secretAccessKey:this.info.secretAccessKey,
            region:this.info.region,
            apiVersion: this.apiversion
        }).sendEmail({
            Destination: { 
                ToAddresses: [ this.para ]
            },
            Message: { 
            Body: {
                Html: {
                        Charset: "UTF-8",
                        Data: this.template
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: this.assunto
                }
            },
            Source: this.de,
        }).promise();
    }

}

class AwsService {

    private config;

    public constructor(){
        this.config = Config.instance().aws()
    }
    
    public ses():EmailSender {
        let info:emailInfo = this.config.ses
        return new EmailSender(info)
    }

}


export default AwsService