import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar/Sidebar';
import ChatHeader from './components/ChatHeader/ChatHeader';
import MessageList from './components/MessageList/MessageList';
import ChatInput from './components/ChatInput/ChatInput';
import './App.css';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3777/api';
const USER_NAME_STORAGE_KEY = 'chatbot_user_name';

const getApiErrorMessage = error => {
  return (
    error.response?.data?.message ||
    error.message ||
    'There was an error generating a response.'
  );
};

const extractNameFromMessage = message => {
  const patterns = [
    /\bmy name is\s+([a-z][a-z\s'-]{0,39})\b/i,
    /\bi am\s+([a-z][a-z\s'-]{0,39})\b/i,
    /\bi'm\s+([a-z][a-z\s'-]{0,39})\b/i,
    /\bcall me\s+([a-z][a-z\s'-]{0,39})\b/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match?.[1]) {
      return match[1].trim().replace(/[.!?,;:]+$/, '');
    }
  }

  return '';
};

function App() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastQuestion, setLastQuestion] = useState('');
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem(USER_NAME_STORAGE_KEY) || '';
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversations, isLoading]);

  useEffect(() => {
    if (userName) {
      localStorage.setItem(USER_NAME_STORAGE_KEY, userName);
    }
  }, [userName]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/conversations`);
      if (response.data.success) {
        setConversations(response.data.data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleSendMessage = async question => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) return;

    const extractedName = extractNameFromMessage(trimmedQuestion);
    if (extractedName) {
      setUserName(extractedName);
    }

    // Optimistically add user message
    const tempUserMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmedQuestion,
    };

    setConversations(prev => [...prev, tempUserMessage]);
    setErrorMessage('');
    setLastQuestion(trimmedQuestion);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat/conversations`, {
        question: trimmedQuestion,
      });

      if (response.data.success) {
        const { userConversation, assistantConversation } = response.data.data;

        // Replace temp message with real ones
        setConversations(prev => {
          const filtered = prev.filter(msg => msg.id !== tempUserMessage.id);
          return [...filtered, userConversation, assistantConversation];
        });
      }
    } catch (error) {
      console.error('Error posting conversation:', error);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (!lastQuestion || isLoading) return;
    handleSendMessage(lastQuestion);
  };

  return (
    <div className='app'>
      <Sidebar />

      <main className='chat'>
        <ChatHeader userName={userName} />

        <MessageList
          conversations={conversations}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
          errorMessage={errorMessage}
          onRetry={handleRetry}
        />

        <ChatInput
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default App;
