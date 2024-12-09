import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import styles from '../styles/Notification.module.css';

export default function Notification({ type = 'success', message, onClose, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className={styles.icon} />,
    error: <XCircle className={styles.icon} />,
    warning: <AlertCircle className={styles.icon} />
  };

  return (
    <div className={`${styles.notification} ${styles[type]} ${isVisible ? styles.show : ''}`}>
      {icons[type]}
      <p>{message}</p>
      <button onClick={() => onClose()} className={styles.closeButton}>×</button>
    </div>
  );
} 