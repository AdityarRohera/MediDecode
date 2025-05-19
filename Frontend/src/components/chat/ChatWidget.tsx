import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Heart, Stethoscope } from 'lucide-react';
import Button from '../ui/Button';
import axios from 'axios';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const ChatWidget = ({ reportId }: { reportId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await axios.post(`http://localhost:8003/api/v1/chat-with-ai-doctor`, { reportId: reportId, newMessage: input });
      console.log('Sending message to server:', input, 'for report:', reportId);
      console.log('AI response:', aiResponse.data.reply);
      const aiMessage: Message = {
        id: (Date.now()+1).toString(),
        type: 'ai',
        content: aiResponse.data.reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-start space-x-2">
      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
        <Bot className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      </div>
      <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div 
        className="fixed bottom-6 right-6 flex flex-col items-end space-y-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          {!isOpen && isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 mb-2 max-w-xs"
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">
                👋 Hi! I'm your health assistant. Ask me anything about your results!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(true)}
          className="relative group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative">
            {/* Main button */}
            <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="flex items-center px-4 py-3 space-x-3">
                <div className="relative">
                  <Stethoscope className="h-5 w-5 text-white" />
                  <div className="absolute -top-1 -right-1">
                    <div className="bg-white rounded-full p-0.5">
                      <Heart className="h-2 w-2 text-primary-500" />
                    </div>
                  </div>
                </div>
                <span className="text-white font-medium text-sm">Dear Doctor</span>
              </div>
              
              {/* Animated border */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-white"
                initial={{ width: "0%" }}
                animate={{ width: isHovered ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              initial={false}
              animate={{ scale: isHovered ? 1.02 : 1 }}
            />
          </div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <span className="font-medium text-gray-900 dark:text-white">Dear Doctor</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        message.type === 'user' 
                          ? 'bg-primary-100 dark:bg-primary-900' 
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      ) : (
                        <Bot className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && <TypingIndicator />}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your results..."
                  className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <Button type="submit" disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;