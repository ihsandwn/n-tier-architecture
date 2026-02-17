import { Injectable } from '@nestjs/common';
// @ts-ignore
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class TwoFactorService {
    generateSecret() {
        return authenticator.generateSecret();
    }

    generateQrCodeUri(email: string, secret: string) {
        return authenticator.keyuri(email, 'OmniLogistics ERP', secret);
    }

    async generateQrCodeDataUrl(otpAuthUrl: string) {
        return qrcode.toDataURL(otpAuthUrl);
    }

    verifyCode(code: string, secret: string) {
        return authenticator.verify({
            token: code,
            secret,
        });
    }
}
