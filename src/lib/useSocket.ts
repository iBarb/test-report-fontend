import { useEffect, useState } from 'react';
import { createSocket } from './socket';
import type { NotificationData, NotificationService } from './notificationService';

export const useSocket = (notifService: NotificationService, token: string) => {
    const [socket, setSocket] = useState<ReturnType<typeof createSocket> | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!token) {
            return;
        }

        const newSocket = createSocket(token);

        newSocket.on('connect', () => setIsConnected(true));
        newSocket.on('disconnect', () => setIsConnected(false));
        newSocket.on('connect_error', (error: Error) => console.error(error.message));
        newSocket.on('notification', (data: NotificationData) => {
            notifService.notify(data);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [notifService]);

    return { socket, isConnected };
};
