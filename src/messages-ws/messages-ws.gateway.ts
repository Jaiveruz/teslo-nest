import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() wss: Server

    constructor(
        private readonly messagesWsService: MessagesWsService,
        private readonly jwtService: JwtService
    ) {}

    async handleConnection( client: Socket ) {

        const token = client.handshake.headers.authentication as string;
        let payload: JwtPayload | undefined;

        try {
            const decoded = this.jwtService.verify(token) as JwtPayload;
            if (!decoded || typeof decoded.id !== 'string') {
                throw new Error('Invalid token payload');
            }
            payload = decoded;
            await this.messagesWsService.registerClient(client, payload.id)

        } catch (error) {
            client.disconnect();
            return;
        }

        // console.log('Cliente conectado', client.id)

        this.wss.emit( 'clients-updated', this.messagesWsService.getConnectedClients() )

    }

    handleDisconnect( client: Socket ) {
        // console.log('Cliente desconectado', client.id)
        this.messagesWsService.removeClient( client )

        this.wss.emit( 'clients-updated', this.messagesWsService.getConnectedClients() )
    }

    @SubscribeMessage('message-from-client')
    onMessageFromClient( client: Socket, payload: NewMessageDto ) {



        // client.broadcast.emit('message-from-server', {
        //     fullName: 'Soy yo',
        //     message: payload.message || 'no-message!!'
        // })

        // client.emit('message-from-server', {
        //     fullName: 'Soy yo',
        //     message: payload.message || 'no-message!!'
        // })

        this.wss.emit('message-from-server', {
            fullName: this.messagesWsService.getUserFullName( client.id ),
            message: payload.message || 'no-message!!'
        })

    }

}
