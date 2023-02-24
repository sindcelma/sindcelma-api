"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Admin_1 = __importDefault(require("../model/Admin"));
const Socio_1 = __importDefault(require("../model/Socio"));
exports.default = () => {
    const obj = {
        status: false,
        index: 0,
        isAdmin: (user, access) => {
            obj.status = user instanceof Admin_1.default;
            if (obj.status && access) {
                const adm = user;
                if (!adm.isMaster()) {
                    obj.status = adm.hasAccess(access);
                }
            }
            if (!obj.status)
                obj.index++;
            return obj;
        },
        orIsAdmin: (user, access) => {
            if (obj.status)
                return obj;
            obj.status = user instanceof Admin_1.default;
            if (obj.status && access) {
                const adm = user;
                if (!adm.isMaster()) {
                    obj.status = adm.hasAccess(access);
                }
            }
            if (!obj.status)
                obj.index++;
            return obj;
        },
        isSocio: (user) => {
            obj.status = user instanceof Socio_1.default;
            if (!obj.status)
                obj.index++;
            return obj;
        },
        orIsSocio: (user) => {
            if (obj.status)
                return obj;
            obj.status = user instanceof Socio_1.default;
            if (!obj.status)
                obj.index++;
            return obj;
        },
        isSameSocio: (user, slug) => {
            let socio = user;
            obj.status = socio.getSlug().trim() == slug.trim();
            if (!obj.status)
                obj.index++;
            return obj;
        },
        orIsSameSocio: (user, slug) => {
            if (obj.status)
                return obj;
            let socio = user;
            obj.status = socio.getSlug().trim() == slug.trim();
            if (!obj.status)
                obj.index++;
            return obj;
        },
        assert: () => {
            if (!obj.status) {
                throw new Error("Error in assertion");
            }
            return obj;
        }
    };
    return obj;
};
//# sourceMappingURL=assertion.js.map