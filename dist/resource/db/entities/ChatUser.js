"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatUser = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Message_1 = require("./Message");
let ChatUser = class ChatUser {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "chatUserIdx" }),
    __metadata("design:type", Number)
], ChatUser.prototype, "chatUserIdx", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "userIdx" }),
    __metadata("design:type", Number)
], ChatUser.prototype, "userIdx", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.chatUsers, {
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
    }),
    (0, typeorm_1.JoinColumn)([{ name: "userIdx", referencedColumnName: "userIdx" }]),
    __metadata("design:type", User_1.User)
], ChatUser.prototype, "userIdx2", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Message_1.Message, (message) => message.chatUserIdx2),
    __metadata("design:type", Array)
], ChatUser.prototype, "messages", void 0);
ChatUser = __decorate([
    (0, typeorm_1.Index)("ChatUser_chatUserIdx_uindex", ["chatUserIdx"], { unique: true }),
    (0, typeorm_1.Index)("FK_User_TO_ChatUser_1", ["userIdx"], {}),
    (0, typeorm_1.Entity)("ChatUser", { schema: "immersion_DB" })
], ChatUser);
exports.ChatUser = ChatUser;
//# sourceMappingURL=ChatUser.js.map