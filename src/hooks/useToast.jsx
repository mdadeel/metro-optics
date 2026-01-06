import { useState } from 'react';
import './Toast.css';

let toastId = 0;

export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = toastId++;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const ToastContainer = () => (
        <div className="toast-container">
            {toasts.map(toast => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );

    return { addToast, ToastContainer };
};

export default useToast;
