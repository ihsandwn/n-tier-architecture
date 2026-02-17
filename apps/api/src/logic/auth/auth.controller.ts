import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TwoFactorService } from './two-factor.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private twoFactorService: TwoFactorService,
        private usersService: UsersService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Req() req: any) {
        const user = await this.usersService.findOne(req.user.userId);
        if (!user) throw new UnauthorizedException();
        const { twoFactorSecret, ...result } = user as any;
        return result;
    }

    @Post('login')
    async login(@Body() req: any) {
        const user = await this.authService.validateUser(req.email, req.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // If 2FA is enabled, we don't return the token yet if it's the first login step.
        // But for simplicity in this implementation, we'll allow standard login if code is provided
        // or return a flag that 2FA is required.
        if (user.twoFactorEnabled && !req.twoFactorCode) {
            return {
                requiresTwoFactor: true,
                userId: user.id,
            };
        }

        if (user.twoFactorEnabled && req.twoFactorCode) {
            const isValid = this.twoFactorService.verifyCode(req.twoFactorCode, user.twoFactorSecret);
            if (!isValid) {
                throw new UnauthorizedException('Invalid 2FA code');
            }
        }

        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('2fa/generate')
    async generate2FA(@Req() req: any) {
        const secret = this.twoFactorService.generateSecret();
        const otpAuthUrl = this.twoFactorService.generateQrCodeUri(req.user.email, secret);
        const qrCodeDataUrl = await this.twoFactorService.generateQrCodeDataUrl(otpAuthUrl);

        return {
            secret,
            qrCodeDataUrl,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post('2fa/enable')
    async enable2FA(@Req() req: any, @Body() body: { secret: string, code: string }) {
        const isValid = this.twoFactorService.verifyCode(body.code, body.secret);
        if (!isValid) {
            throw new UnauthorizedException('Invalid 2FA code');
        }

        await this.usersService.enable2FA(req.user.userId, body.secret);
        return { message: '2FA enabled successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Post('2fa/disable')
    async disable2FA(@Req() req: any) {
        await this.usersService.disable2FA(req.user.userId);
        return { message: '2FA disabled successfully' };
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: any) { }

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: any) {
        return this.authService.googleLogin(req.user);
    }
}
