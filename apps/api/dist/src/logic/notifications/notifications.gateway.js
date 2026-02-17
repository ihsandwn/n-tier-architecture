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
exports.NotificationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
let NotificationGateway = class NotificationGateway {
    jwtService;
    server;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = await this.jwtService.verifyAsync(token);
            const userId = payload.sub;
            const tenantId = payload.tenantId;
            client.join(`user_${userId}`);
            if (tenantId) {
                client.join(`tenant_${tenantId}`);
            }
            console.log(`NotificationGateway: Client connected. User: ${userId}, Tenant: ${tenantId}`);
        }
        catch (e) {
            console.error('NotificationGateway: Connection authentication failed', e.message);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        console.log('NotificationGateway: Client disconnected');
    }
    sendToUser(userId, notification) {
        this.server.to(`user_${userId}`).emit('notification', notification);
    }
    broadcastToTenant(tenantId, event, payload) {
        this.server.to(`tenant_${tenantId}`).emit(event, payload);
    }
    emitDataUpdate(tenantId, domain) {
        this.broadcastToTenant(tenantId, 'data_update', { domain, timestamp: new Date().toISOString() });
    }
    broadcast(notification) {
        this.server.emit('notification', notification);
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
exports.NotificationGateway = NotificationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: 'notifications',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], NotificationGateway);
//# sourceMappingURL=notifications.gateway.js.map