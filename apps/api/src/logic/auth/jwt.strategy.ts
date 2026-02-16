import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')!,
        });
    }

    async validate(payload: any) {
        // payload = { sub: userId, email: userEmail, roles: userRoles }
        // We can verify if user exists in DB here via AuthService if needed, 
        // but strict JWT statelessness usually trusts the signature + expiration.
        // Returning an object here attaches it to Request object as req.user
        return { userId: payload.sub, email: payload.email, roles: payload.roles };
    }
}
