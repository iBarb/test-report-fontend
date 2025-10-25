import io from 'socket.io-client';

export const createSocket = (token: string) => {
    return io(import.meta.env.VITE_API_URL, {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling']
    });
};