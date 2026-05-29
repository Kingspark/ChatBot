import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './ChatMessage.module.css';

export default function ChatMessage({ role, content }) {
  const markdownComponents = {
    code({ className, children, ...props }) {
      const languageMatch = /language-(\w+)/.exec(className || '');

      if (languageMatch) {
        return (
          <SyntaxHighlighter
            language={languageMatch[1]}
            style={vscDarkPlus}
            PreTag='div'
            customStyle={{ marginBottom: 16, borderRadius: 8 }}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className={`${styles.message} ${styles[role]}`}>
      <div className={`${styles.avatar} ${styles[role]}`}>
        {role === 'user' ? (
          <User size={18} color='white' />
        ) : (
          <Bot size={18} color='white' />
        )}
      </div>
      <div className={styles.content}>
        {role === 'user' ? (
          content
        ) : (
          <div className={styles.markdownBody}>
            <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
