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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const passport_1 = require("@nestjs/passport");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const two_factor_service_1 = require("./two-factor.service");
const users_service_1 = require("../users/users.service");
let AuthController = class AuthController {
    authService;
    twoFactorService;
    usersService;
    constructor(authService, twoFactorService, usersService) {
        this.authService = authService;
        this.twoFactorService = twoFactorService;
        this.usersService = usersService;
    }
    async getProfile(req) {
        const user = await this.usersService.findOne(req.user.userId);
        if (!user)
            throw new common_1.UnauthorizedException();
        const { twoFactorSecret, ...result } = user;
        return result;
    }
    async login(req) {
        const user = await this.authService.validateUser(req.email, req.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.twoFactorEnabled && !req.twoFactorCode) {
            return {
                requiresTwoFactor: true,
                userId: user.id,
            };
        }
        if (user.twoFactorEnabled && req.twoFactorCode) {
            const isValid = this.twoFactorService.verifyCode(req.twoFactorCode, user.twoFactorSecret);
            if (!isValid) {
                throw new common_1.UnauthorizedException('Invalid 2FA code');
            }
        }
        return this.authService.login(user);
    }
    async register(createUserDto) {
        return this.authService.register(createUserDto);
    }
    async generate2FA(req) {
        const secret = this.twoFactorService.generateSecret();
        const otpAuthUrl = this.twoFactorService.generateQrCodeUri(req.user.email, secret);
        const qrCodeDataUrl = await this.twoFactorService.generateQrCodeDataUrl(otpAuthUrl);
        return {
            secret,
            qrCodeDataUrl,
        };
    }
    async enable2FA(req, body) {
        const isValid = this.twoFactorService.verifyCode(body.code, body.secret);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid 2FA code');
        }
        await this.usersService.enable2FA(req.user.userId, body.secret);
        return { message: '2FA enabled successfully' };
    }
    async disable2FA(req) {
        await this.usersService.disable2FA(req.user.userId);
        return { message: '2FA disabled successfully' };
    }
    async googleAuth(req) { }
    async googleAuthRedirect(req) {
        return this.authService.googleLogin(req.user);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/generate'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generate2FA", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/enable'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enable2FA", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/disable'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "disable2FA", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/redirect'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        two_factor_service_1.TwoFactorService,
        users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map