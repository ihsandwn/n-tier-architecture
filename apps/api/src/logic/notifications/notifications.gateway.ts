import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'notifications',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly jwtService: JwtService) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
            if (!token) {
                client.disconnect();
                return;
            }

            const payload = await this.jwtService.verifyAsync(token);
            const userId = payload.sub;
            const tenantId = payload.tenantId; // Assume tenantId is in the token

            // Join a room specific to this user
            client.join(`user_${userId}`);

            // Join a room specific to the tenant
            if (tenantId) {
                client.join(`tenant_${tenantId}`);
            }

            console.log(`NotificationGateway: Client connected. User: ${userId}, Tenant: ${tenantId}`);
        } catch (e) {
            console.error('NotificationGateway: Connection authentication failed', e.message);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        console.log('NotificationGateway: Client disconnected');
    }

    sendToUser(userId: string, notification: any) {
        this.server.to(`user_${userId}`).emit('notification', notification);
    }

    broadcastToTenant(tenantId: string, event: string, payload: any) {
        this.server.to(`tenant_${tenantId}`).emit(event, payload);
    }

    emitDataUpdate(tenantId: string, domain: string) {
        this.broadcastToTenant(tenantId, 'data_update', { domain, timestamp: new Date().toISOString() });
    }

    broadcast(notification: any) {
        this.server.emit('notification', notification);
    }
}
