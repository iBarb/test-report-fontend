import { useEffect, useState, useRef } from 'react';
import { createSocket } from './socket';
import type { NotificationData, NotificationService } from './notificationService';

export const useSocket = (notifService: NotificationService, token: string) => {
    const [socket, setSocket] = useState<ReturnType<typeof createSocket> | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const notifServiceRef = useRef(notifService);

    // Actualizar la ref cuando cambia el servicio
    useEffect(() => {
        notifServiceRef.current = notifService;
    }, [notifService]);

    useEffect(() => {
        if (!token) {
            return;
        }

        const newSocket = createSocket(token);

        newSocket.on('connect', () => setIsConnected(true));
        newSocket.on('disconnect', () => setIsConnected(false));
        newSocket.on('connect_error', (error: Error) => console.error(error.message));
        newSocket.on('notification', (data: NotificationData) => {
            notifServiceRef.current.notify(data);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [token]); // Solo depende de token

    return { socket, isConnected };
};