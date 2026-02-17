export declare class TwoFactorService {
    generateSecret(): any;
    generateQrCodeUri(email: string, secret: string): any;
    generateQrCodeDataUrl(otpAuthUrl: string): Promise<string>;
    verifyCode(code: string, secret: string): any;
}
