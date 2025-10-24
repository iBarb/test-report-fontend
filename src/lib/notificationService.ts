import { toast } from 'sonner';

export interface NotificationData {
    type: string;
    message: string;
    report_id?: string;
    created_at: string;
}

export class NotificationService {
    private listeners: ((notif: NotificationData) => void)[] = [];
    private reportCompletedCallbacks: (() => void)[] = [];

    subscribe(listener: (notif: NotificationData) => void) {
        this.listeners.push(listener);
    }

    // Nuevo método para suscribirse a reportes completados
    onReportCompleted(callback: () => void) {
        this.reportCompletedCallbacks.push(callback);
        // Retornar función para desuscribirse
        return () => {
            this.reportCompletedCallbacks = this.reportCompletedCallbacks.filter(cb => cb !== callback);
        };
    }

    notify(notif: NotificationData) {
        // Notificación en UI (componentes)
        this.listeners.forEach(listener => listener(notif));

        // Notificación con sonner
        switch (notif.type) {
            case 'reporte_completado':
                toast.success(notif.message);
                // Ejecutar callbacks de reporte completado
                this.reportCompletedCallbacks.forEach(callback => callback());
                break;
            case 'reporte_fallido':
                toast.error(notif.message);
                // También refrescar en caso de fallo
                this.reportCompletedCallbacks.forEach(callback => callback());
                break;
            default:
                toast.info(notif.message);
                this.reportCompletedCallbacks.forEach(callback => callback());
        }
    }
}