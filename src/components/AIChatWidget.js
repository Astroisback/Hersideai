'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Image as ImageIcon, X, MessageCircle, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { usePathname } from 'next/navigation';

const PAGE_CONTEXT_MAP = {
    '/login': 'The user is on the login page. They are trying to sign in or might need to create an account.',
    '/signup': 'The user is on the signup page. They are creating a new account.',
    '/onboarding': 'The user is in the onboarding flow, setting up their profile.',
    '/seller/dashboard': 'The user is on their seller dashboard, viewing their business overview.',
    '/customer/home': 'The user is browsing the customer marketplace home page.',
    '/': 'The user is on the landing page.',
};

export default function AIChatWidget() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hello! I am your AI assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            setSelectedImage(file);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((!input.trim() && !selectedImage) || isLoading) return;

        const userMessage = input.trim();
        const currentImage = selectedImage;

        setInput('');
        clearImage();

        const newMessage = { role: 'user', content: userMessage };
        if (currentImage) {
            newMessage.image = URL.createObjectURL(currentImage);
        }

        setMessages(prev => [...prev, newMessage]);
        setIsLoading(true);

        try {
            let images = [];
            if (currentImage) {
                const base64 = await convertToBase64(currentImage);
                images.push(base64);
            }

            const pageDescription = PAGE_CONTEXT_MAP[pathname] || 'The user is navigating the application.';

            const response = await fetch('/api/ai_chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userMessage,
                    images: images,
                    context: {
                        page: pathname,
                        description: pageDescription
                    }
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            let aiContent = "I received a response, but I'm not sure how to display it.";

            // If the model returns a "thinking" field, we might want to ignore it or use it for debug.
            // But we primarily want the actual response.
            if (data.response) aiContent = data.response;
            else if (typeof data === 'string') aiContent = data;
            else if (data.output) aiContent = data.output;
            else if (data.text) aiContent = data.text;
            else aiContent = JSON.stringify(data);

            setMessages(prev => [...prev, { role: 'ai', content: aiContent }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'ai', content: `Sorry, I encountered an error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-[90vw] sm:w-[400px] h-[600px] max-h-[80vh] flex flex-col border border-gray-200 mb-4 overflow-hidden pointer-events-auto transition-all duration-300 ease-in-out origin-bottom-right">
                    {/* Header */}
                    <header className="bg-indigo-600 px-6 py-4 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Assistant</h3>
                                <p className="text-xs text-indigo-100">Online</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
                        >
                            <Minimize2 className="w-5 h-5" />
                        </button>
                    </header>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'
                                        }`}
                                >
                                    {msg.role === 'user' ? (
                                        <User className="w-4 h-4 text-white" />
                                    ) : (
                                        <Bot className="w-4 h-4 text-white" />
                                    )}
                                </div>
                                <div
                                    className={`px-4 py-3 rounded-2xl text-sm shadow-sm max-w-[80%] ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                                        }`}
                                >
                                    {msg.image && (
                                        <div className="mb-2">
                                            <img src={msg.image} alt="Upload" className="rounded-lg max-h-40 object-cover" />
                                        </div>
                                    )}
                                    <div className="prose prose-sm max-w-none prose-indigo prose-p:leading-relaxed prose-pre:bg-gray-100 prose-pre:text-gray-800">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="px-4 py-3 rounded-2xl bg-white border border-gray-100 rounded-tl-none shadow-sm flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                    <span className="text-gray-400 text-xs">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="bg-white border-t border-gray-200 p-3 shrink-0">
                        {/* Image Preview */}
                        {selectedImage && (
                            <div className="mb-2 relative inline-block">
                                <div className="relative">
                                    <img
                                        src={URL.createObjectURL(selectedImage)}
                                        alt="Preview"
                                        className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                                    />
                                    <button
                                        onClick={clearImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="flex items-center gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
                                disabled={isLoading}
                            >
                                <ImageIcon className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 py-2 px-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={(!input.trim() && !selectedImage) || isLoading}
                                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${isOpen
                    ? 'bg-gray-200 text-gray-600 rotate-90 hidden'
                    : 'bg-indigo-600 text-white'
                    }`}
                style={{ display: isOpen ? 'none' : 'flex' }}
            >
                <MessageCircle className="w-6 h-6" />
            </button>
        </div>
    );
}
