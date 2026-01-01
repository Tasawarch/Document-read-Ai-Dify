import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { 
  Send, Paperclip, User, Bot, Loader2, Trash2, 
  MessageSquare, Plus, CheckCircle2, XCircle, 
  FileText, X, Sparkles, LayoutDashboard 
} from 'lucide-react';

const DifyChat = () => {
  const [file, setFile] = useState(null);
  const [activeFileId, setActiveFileId] = useState(null);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  // Configuration - Ensure this API Key is for your Workflow App
  const API_KEY = 'app-9E4EqJrg3rDHmhGFEgwyw72Q';
  const BASE_URL = 'https://api.dify.ai/v1';

  // Smooth Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory, loading]);

  const resetChat = () => {
    setChatHistory([]);
    setActiveFileId(null);
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async () => {
    // Prevent empty messages if no file is being uploaded
    if (!query.trim() && !file) return;
    
    setError(null);
    const fileNameToDisplay = file ? file.name : (activeFileId ? "Active Context" : null);
    
    const userMessage = { 
      role: 'user', 
      text: query || "Uploaded a document for analysis.", 
      fileName: fileNameToDisplay 
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setLoading(true);
    setQuery('');

    try {
      let currentId = activeFileId;

      // 1. First, upload the file if selected
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user', 'default_user_1');
        
        const uploadRes = await axios.post(`${BASE_URL}/files/upload`, formData, {
          headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        currentId = uploadRes.data.id;
        setActiveFileId(currentId);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }

      // 2. THE FIX: Construct the payload to match Dify Workflow requirements
      const payload = {
        // 'inputs' must contain 'doc' because your Workflow node expects it
        inputs: currentId ? { 
          doc: { 
            transfer_method: "local_file", 
            upload_file_id: currentId, 
            type: "document" 
          } 
        } : {},
        query: userMessage.text,
        user: "default_user_1",
        response_mode: "blocking",
        // 'files' array is also sent for overall compatibility
        files: currentId ? [
          {
            type: "document",
            transfer_method: "local_file",
            upload_file_id: currentId
          }
        ] : []
      };

      const response = await axios.post(`${BASE_URL}/chat-messages`, payload, {
        headers: { 
          'Authorization': `Bearer ${API_KEY}`, 
          'Content-Type': 'application/json' 
        }
      });

      // Update chat with AI response
      if (response.data && response.data.answer) {
        setChatHistory(prev => [...prev, { role: 'ai', text: response.data.answer }]);
      }
    } catch (err) {
      console.error("Dify Request Error:", err);
      const errorDetail = err.response?.data?.message || "Connection failed. Check your API limits.";
      setError(errorDetail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F0F2F5] text-slate-800 antialiased font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-80 bg-[#0F172A] flex-col text-white p-6 shadow-2xl relative">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="p-2 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/30">
            <LayoutDashboard size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight">Dify Studio</span>
        </div>

        <button 
          onClick={resetChat} 
          className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl py-4 transition-all active:scale-95 mb-10 font-semibold"
        >
          <Plus size={20} /> New Analysis
        </button>
        
        <div className="flex-1 space-y-6">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 block">Workspace Context</label>
            <div className={`group flex flex-col gap-2 p-4 rounded-2xl border transition-all duration-500 ${
              activeFileId 
                ? 'bg-indigo-500/10 border-indigo-500/30 ring-1 ring-indigo-500/20' 
                : 'bg-white/5 border-white/5'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`relative ${activeFileId ? 'animate-pulse' : ''}`}>
                  <div className={`w-3 h-3 rounded-full ${activeFileId ? 'bg-indigo-400' : 'bg-slate-600'}`}></div>
                </div>
                <span className={`text-sm font-medium ${activeFileId ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {activeFileId ? "Document Ready" : "Waiting for File"}
                </span>
              </div>
              {activeFileId && <p className="text-[10px] text-indigo-300/60 pl-6 leading-relaxed">AI is currently analyzing your document context.</p>}
            </div>
          </div>
        </div>
      </aside>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col relative bg-white lg:rounded-l-[2.5rem] shadow-inner overflow-hidden">
        <header className="h-20 border-b border-slate-100 bg-white/70 backdrop-blur-md flex items-center justify-between px-10 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg rotate-3">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="font-black text-slate-900 text-lg tracking-tight">Intelligence Engine</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active via Dify</p>
              </div>
            </div>
          </div>
          <button onClick={resetChat} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all">
            <Trash2 size={20} />
          </button>
        </header>

        {/* Chat Messages */}
        <main ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-20 py-10 space-y-10 custom-scrollbar bg-slate-50/30">
          {chatHistory.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-indigo-200 blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-xl shadow-indigo-100/50">
                  <FileText size={40} strokeWidth={1.5} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3 italic">Ready to Analyze.</h2>
              <p className="text-slate-500 max-w-sm leading-relaxed">
                Upload a document or ask a question. I will use your file as context for my answers.
              </p>
            </div>
          )}

          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} transition-all`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md shrink-0 border ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 border-indigo-500 text-white' 
                  : 'bg-white border-slate-100 text-indigo-600'
              }`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              
              <div className={`max-w-[85%] md:max-w-[75%] space-y-2`}>
                <div className={`p-5 rounded-[2rem] shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                }`}>
                  {msg.fileName && (
                    <div className={`inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                      msg.role === 'user' ? 'bg-white/10 border-white/20 text-white' : 'bg-indigo-100 border-indigo-200 text-indigo-700'
                    }`}>
                      <CheckCircle2 size={12} /> {msg.fileName}
                    </div>
                  )}
                  <div className={`prose prose-slate max-w-none ${msg.role === 'user' ? 'prose-invert font-medium' : ''}`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 items-center bg-white w-fit px-6 py-4 rounded-full border border-slate-200 shadow-sm ml-2">
              <Loader2 className="animate-spin text-indigo-600" size={20} />
              <span className="text-sm font-bold text-slate-500 uppercase tracking-tighter tracking-widest">AI is Processing...</span>
            </div>
          )}
        </main>

        {/* Input Area */}
        <footer className="px-6 pb-8 pt-2 bg-white shrink-0">
          <div className="max-w-4xl mx-auto">
            {file && (
              <div className="mb-4 flex items-center justify-between bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-indigo-200 animate-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-indigo-200" />
                  <span className="text-sm font-bold truncate max-w-xs">{file.name}</span>
                </div>
                <button onClick={() => setFile(null)} className="hover:rotate-90 transition-transform p-1">
                  <X size={18} />
                </button>
              </div>
            )}

            <div className={`relative bg-slate-50 rounded-[2.5rem] p-3 flex items-end gap-3 border transition-all ${
              error ? 'border-rose-300 ring-4 ring-rose-50' : 'border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50'
            }`}>
              <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} />
              
              <button 
                onClick={() => fileInputRef.current.click()} 
                className={`p-4 rounded-full transition-all ${file || activeFileId ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-slate-400 hover:bg-slate-100 shadow-sm'}`}
              >
                <Paperclip size={24} />
              </button>
              
              <textarea
                rows="1"
                className="flex-1 bg-transparent border-none focus:ring-0 py-4 px-2 resize-none text-slate-800 font-medium placeholder:text-slate-400"
                placeholder={activeFileId ? "Ask about the document..." : "Message or upload a document..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              
              <button 
                onClick={handleSendMessage}
                disabled={loading || (!query.trim() && !file)}
                className="p-4 bg-indigo-600 text-white rounded-[2rem] hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-300 transition-all shadow-lg active:scale-95 flex-shrink-0"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
              </button>
            </div>
            
            {error && <p className="text-center text-rose-500 text-[11px] font-bold mt-3 uppercase tracking-widest">{error}</p>}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DifyChat;