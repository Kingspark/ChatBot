import { BotMessageSquare, ChevronDown } from 'lucide-react';
import styles from './ChatHeader.module.css';

const getInitials = name => {
  if (!name) return 'User';

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return 'User';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function ChatHeader({ userName }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.brandIcon}>
          <BotMessageSquare size={16} strokeWidth={2.4} />
        </div>
        <span className={styles.title}>ChatGPT Clone</span>
        <ChevronDown size={16} className={styles.chevron} />
      </div>
      <div className={styles.right}>
        <div className={styles.avatar} title={userName || 'User Name'}>
          {getInitials(userName)}
        </div>
      </div>
    </header>
  );
}
