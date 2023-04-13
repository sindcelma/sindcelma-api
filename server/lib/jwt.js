"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.comparePass = exports.hashPass = exports.generateCode = exports.generateSlug = exports.verifyToken = exports.generateToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("./config"));
const bcrypt = __importStar(require("bcrypt"));
const config = config_1.default.instance();
// const limit = Date.now() + (1000 * 60 * 15)  // 15 minutos de duração
const limit = Date.now() + (1000 * 60 * 800); // 800 minutos de duração
const emptyUser = {
    id: 0,
    email: '',
    version: 0
};
const visitante = {
    status: false,
    type: "Visitante",
    expired: true,
    data: emptyUser
};
const generateToken = function (type, body) {
    const header = {
        alg: "sha256",
        lim: limit,
        typ: type,
        cat: Date.now()
    };
    const h = Buffer.from(JSON.stringify(header)).toString('base64');
    const b = Buffer.from(JSON.stringify(body)).toString('base64');
    return `${h}.${b}.${crypto_1.default.createHmac(header.alg, config.json().salt).update(h + '.' + b).digest('base64')}`;
};
exports.generateToken = generateToken;
const verifyToken = function (hash) {
    try {
        const parts = hash.split('.');
        const header = JSON.parse(Buffer.from(parts[0], 'base64').toString('utf8'));
        const agora = Date.now();
        const cripth = Buffer.from(crypto_1.default.createHmac(header.alg, config.json().salt)
            .update(parts[0] + '.' + parts[1])
            .digest('base64'), 'base64').toString('ascii');
        let expired = agora > header.tim;
        if (expired && (agora - header.tim) > (1000 * 60 * 15)) {
            return visitante;
        }
        return (cripth == Buffer.from(parts[2], 'base64').toString('ascii')
            ? {
                status: true,
                type: header.typ,
                data: JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8')),
                expired: expired
            }
            : visitante);
    }
    catch (e) {
        return visitante;
    }
};
exports.verifyToken = verifyToken;
const generateCode = function () {
    return Math.random().toString(36).substring(7);
};
exports.generateCode = generateCode;
const generateSlug = function (content) {
    return Buffer.from(crypto_1.default.createHmac('sha256', config.json().salt)
        .update(content)
        .digest('base64'), 'base64').toString('hex');
};
exports.generateSlug = generateSlug;
const hashPass = function (pass) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.hash(pass + config.json().salt, 10);
    });
};
exports.hashPass = hashPass;
const comparePass = function (pass, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(pass + config.json().salt, hash);
    });
};
exports.comparePass = comparePass;
//# sourceMappingURL=jwt.js.map