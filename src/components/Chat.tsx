'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Send, Paperclip, FileText, X, Image as ImageIcon, Loader2, Bot, User, Sparkles, PlusCircle, Globe, Zap, Link as LinkIcon, Lock, ChevronRight, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Chat.module.css';

export default function Chat() {
    const [mounted, setMounted] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessKey, setAccessKey] = useState('');
    const [authError, setAuthError] = useState(false);

    const [files, setFiles] = useState<{ name: string; type: string; base64: string }[]>([]);
    const [links, setLinks] = useState<string[]>([]);
    const [urlInput, setUrlInput] = useState('');
    const [showUrlPanel, setShowUrlPanel] = useState(false);
    const [isDeepThinking, setIsDeepThinking] = useState(false);
    const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
        api: '/api/chat',
        body: {
            options: {
                webSearch: isWebSearchEnabled,
                deepThinking: isDeepThinking,
                links: links
            }
        },
        headers: {
            'x-session-id': typeof window !== 'undefined' ? (localStorage.getItem('aura_session_id') || 'aura-guest') : 'aura-guest'
        },
        onError: (err: any) => {
            console.error("Chat Error Details:", err);
        }
    });

    useEffect(() => {
        setMounted(true);
        if (!localStorage.getItem('aura_session_id')) {
            localStorage.setItem('aura_session_id', `session_${Math.random().toString(36).slice(2)}`);
        }
        if (localStorage.getItem('aura_authenticated') === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        if (accessKey.trim().toLowerCase() === 'deepthi') {
            setIsAuthenticated(true);
            localStorage.setItem('aura_authenticated', 'true');
            setAuthError(false);
        } else {
            setAuthError(true);
            setAccessKey('');
        }
    };

    const logout = () => {
        localStorage.removeItem('aura_authenticated');
        setIsAuthenticated(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (mounted && isAuthenticated) {
            scrollToBottom();
        }
    }, [messages, isLoading, mounted, isAuthenticated]);

    if (!mounted) return null;

    if (!isAuthenticated) {
        return (
            <div className={styles.authOverlay}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={styles.authCard}
                >
                    <div className={styles.authIcon}>
                        <Lock size={40} color="#8b5cf6" />
                    </div>
                    <h2 className={styles.authTitle}>Aura Access</h2>
                    <p className={styles.authText}>Enter the secure key to initialize neural research pathways.</p>

                    <form onSubmit={handleAuth} className={styles.authForm}>
                        <div className={styles.authInputWrapper}>
                            <input
                                type="password"
                                placeholder="Secure Key"
                                value={accessKey}
                                onChange={(e) => setAccessKey(e.target.value)}
                                className={`${styles.authInput} ${authError ? styles.authInputError : ''}`}
                                autoFocus
                            />
                            <button type="submit" className={styles.authSubmit}>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        {authError && <p className={styles.authErrorMessage}>Invalid identification key.</p>}
                    </form>
                    <div className={styles.authFooter}>Neural Encryption Active</div>
                </motion.div>
            </div>
        );
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const processedFiles = await Promise.all(
                selectedFiles.map(async (file) => {
                    return new Promise<{ name: string; type: string; base64: string }>((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const base64 = (reader.result as string).split(',')[1];
                            resolve({ name: file.name, type: file.type, base64: base64 });
                        };
                        reader.readAsDataURL(file);
                    });
                })
            );
            setFiles((prev) => [...prev, ...processedFiles]);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const addUrlLabel = () => {
        if (urlInput && urlInput.startsWith('http')) {
            setLinks(prev => [...prev, urlInput]);
            setUrlInput('');
            setShowUrlPanel(false);
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() && files.length === 0 && links.length === 0) return;
        handleSubmit(e, { data: { files: files } });
        setFiles([]);
        setLinks([]);
    };

    const startNewChat = () => {
        setMessages([]);
        setFiles([]);
        setLinks([]);
        localStorage.setItem('aura_session_id', `session_${Math.random().toString(36).slice(2)}`);
    };

    return (
        <div className={styles.chatWrapper}>
            <header className={styles.header}>
                <div className={styles.titleGroup}>
                    <div className={styles.statusDot}></div>
                    <h1 className={styles.title}>Aura</h1>
                    <div className={styles.badge}>PRO</div>
                </div>
                <div className={styles.controlsGroup}>
                    <button
                        onClick={() => setIsWebSearchEnabled(!isWebSearchEnabled)}
                        className={`${styles.toggleBtn} ${isWebSearchEnabled ? styles.active : ''}`}
                        title="Enable Web Search"
                    >
                        <Globe size={16} /> <span>Search</span>
                    </button>
                    <button
                        onClick={() => setIsDeepThinking(!isDeepThinking)}
                        className={`${styles.toggleBtn} ${isDeepThinking ? styles.activeDeep : ''}`}
                        title="Deep Thinking"
                    >
                        <Zap size={16} /> <span>Think</span>
                    </button>
                    <button onClick={logout} className={styles.iconBtn} title="Logout">
                        <LogOut size={16} />
                    </button>
                    <button onClick={startNewChat} className={styles.pillAction}>
                        <PlusCircle size={14} /> <span>New Session</span>
                    </button>
                </div>
            </header>

            <div className={styles.messagesArea}>
                {messages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={styles.emptyState}
                    >
                        <div className={styles.iconContainer}>
                            <Sparkles size={48} color="#8b5cf6" />
                        </div>
                        <h2 className={styles.welcomeTitle}>Aura Core</h2>
                        <p className={styles.welcomeText}>
                            Aura is connected. Upload documents, paste links, or enable Neural Thinking for complex engineering analysis.
                        </p>
                        <div className={styles.capabilitiesGrid}>
                            <div className={styles.capability}><Globe size={20} /> <span>Live Search</span></div>
                            <div className={styles.capability}><Zap size={20} /> <span>Deep reasoning</span></div>
                            <div className={styles.capability}><LinkIcon size={20} /> <span>URL Context</span></div>
                        </div>
                    </motion.div>
                )}

                <AnimatePresence mode="popLayout">
                    {messages.map((m) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`${styles.messageRow} ${m.role === 'user' ? styles.userRow : styles.botRow}`}
                        >
                            <div className={`${styles.messageBubble} ${m.role === 'user' ? styles.userBubble : styles.botBubble}`}>
                                <div className={styles.senderName}>
                                    {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    <span>{m.role === 'user' ? 'YOU' : 'AURA'}</span>
                                </div>
                                <div className={styles.messageContent}>{m.content}</div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <div className={styles.loadingBubble}>
                        <div className={styles.loadingContent}>
                            <Loader2 className={styles.spin} size={16} />
                            <span>{isDeepThinking ? 'Deep Thinking Mode Active...' : 'Processing...'}</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} style={{ height: '2rem' }} />
            </div>

            <div className={styles.inputArea}>
                {(files.length > 0 || links.length > 0) && (
                    <div className={styles.attachmentZone}>
                        {files.map((file, idx) => (
                            <div key={`f-${idx}`} className={styles.fileBadge}>
                                {file.type.startsWith('image/') ? <ImageIcon size={14} /> : <FileText size={14} />}
                                <span>{file.name}</span>
                                <button onClick={() => setFiles(files.filter((_, i) => i !== idx))}><X size={12} /></button>
                            </div>
                        ))}
                        {links.map((link, idx) => (
                            <div key={`l-${idx}`} className={styles.urlBadge}>
                                <LinkIcon size={14} />
                                <span>{link}</span>
                                <button onClick={() => setLinks(links.filter((_, i) => i !== idx))}><X size={12} /></button>
                            </div>
                        ))}
                    </div>
                )}

                <AnimatePresence>
                    {showUrlPanel && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={styles.urlPanel}>
                            <input type="text" placeholder="https://..." value={urlInput} onChange={(e) => setUrlInput(e.target.value)} autoFocus />
                            <button onClick={addUrlLabel}>Add Link</button>
                            <button onClick={() => setShowUrlPanel(false)}>Cancel</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={onSubmit} className={styles.form}>
                    <div className={styles.actionButtons}>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className={styles.iconBtn}><Paperclip size={20} /></button>
                        <button type="button" onClick={() => setShowUrlPanel(!showUrlPanel)} className={styles.iconBtn}><LinkIcon size={20} /></button>
                    </div>
                    <div className={styles.inputWrapper}>
                        <input value={input} onChange={handleInputChange} placeholder="Command Aura..." className={styles.input} disabled={isLoading} />
                    </div>
                    <button type="submit" disabled={isLoading || (!input.trim() && files.length === 0 && links.length === 0)} className={styles.submitBtn}>
                        {isLoading ? <Loader2 size={24} className={styles.spin} /> : <Send size={24} />}
                    </button>
                </form>
                <p style={{ textAlign: 'center', fontSize: '0.65rem', color: '#3f3f46', marginTop: '1rem', letterSpacing: '0.1em' }}>NEURAL ENGINE AT THE SERVICE OF RESEARCH</p>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} multiple accept="image/*,application/pdf" />
        </div>
    );
}
