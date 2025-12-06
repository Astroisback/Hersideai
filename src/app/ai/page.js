'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Image as ImageIcon, X } from 'lucide-react';
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

export default function AIChatPage() {
    const pathname = usePathname();
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
        scrollToBottom();
    }, [messages]);

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
                // Remove data URL prefix (e.g. "data:image/jpeg;base64,")
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

        // Reset input immediately
        setInput('');
        clearImage();

        // Create new message object
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

            let aiContent = "Please try again";

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
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 sticky top-0 z-10">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">AI Assistant</h1>
                    <p className="text-sm text-gray-500">Always here to help</p>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-start gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                            }`}
                    >
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'
                                }`}
                        >
                            {msg.role === 'user' ? (
                                <User className="w-6 h-6 text-white" />
                            ) : (
                                <Bot className="w-6 h-6 text-white" />
                            )}
                        </div>
                        <div
                            className={`px-6 py-4 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
                                }`}
                        >
                            {msg.image && (
                                <div className="mb-3">
                                    <img src={msg.image} alt="User upload" className="max-w-full rounded-lg max-h-64 object-cover" />
                                </div>
                            )}
                            <div className="prose prose-sm max-w-none prose-indigo prose-p:leading-relaxed prose-pre:bg-gray-100 prose-pre:text-gray-800">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4 max-w-3xl">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div className="px-6 py-4 rounded-2xl bg-white border border-gray-100 rounded-bl-none shadow-sm flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                            <span className="text-gray-400 text-sm">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">

                {/* Image Preview */}
                {selectedImage && (
                    <div className="max-w-4xl mx-auto mb-2 relative inline-block">
                        <div className="relative">
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Preview"
                                className="h-20 w-20 object-cover rounded-lg border border-gray-200"
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

                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center gap-2">
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
                        className="p-4 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                        disabled={isLoading}
                        title="Upload Image"
                    >
                        <ImageIcon className="w-5 h-5" />
                    </button>

                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={selectedImage ? "Describe this image..." : "Type your message..."}
                            className="w-full pl-6 pr-14 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 text-gray-900 shadow-sm transition-all"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={(!input.trim() && !selectedImage) || isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
