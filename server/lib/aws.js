"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = __importDefault(require("./config"));
const template_1 = __importDefault(require("./template"));
class EmailSender {
    constructor(info) {
        this.apiversion = '2010-12-01';
        this.de = "";
        this.para = "";
        this.assunto = "";
        this.data = {};
        this.template = "";
        this.content = "";
        this.info = info;
    }
    config(config) {
        var _a;
        this.data = (_a = config.data) !== null && _a !== void 0 ? _a : this.data;
        this.de = config.de;
        this.para = config.para;
        this.assunto = config.assunto;
        return this;
    }
    setTemplate(template) {
        this.template = template;
        return this;
    }
    setContent(content) {
        this.content = content;
        return this;
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            let content = this.template != "" ? new template_1.default()
                .setTemplate(this.template)
                .replace(this.data)
                .content() : this.content;
            return yield new aws_sdk_1.default.SES({
                accessKeyId: this.info.accessKeyId,
                secretAccessKey: this.info.secretAccessKey,
                region: this.info.region,
                apiVersion: this.apiversion
            }).sendEmail({
                Destination: {
                    ToAddresses: [this.para]
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: "UTF-8",
                            Data: content
                        },
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: this.assunto
                    }
                },
                Source: this.de,
            }).promise();
        });
    }
}
class AwsService {
    constructor() {
        this.config = config_1.default.instance().aws();
    }
    ses() {
        let info = this.config.ses;
        return new EmailSender(info);
    }
}
exports.default = AwsService;
//# sourceMappingURL=aws.js.map