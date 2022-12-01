"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assertion_1 = __importDefault(require("../../lib/assertion"));
const response_1 = __importDefault(require("../../lib/response"));
class SessionTest {
    /*
    public static genSessionTest(req:Request, res:Response){
        const email = req.body.email
        const session = generateToken("Admin", {email:email})
        response(res).success({session:session})
    }
    */
    static checarTipoDeSessao(req, res) {
        try {
            (0, assertion_1.default)()
                .isSocio(req.user)
                .orIsAdmin(req.user)
                .assert();
            (0, response_1.default)(res).success(req.user);
        }
        catch (error) {
            // nada...
        }
    }
}
exports.default = SessionTest;
//# sourceMappingURL=SessionsTest.js.map