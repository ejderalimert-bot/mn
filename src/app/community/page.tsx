"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Phone, Gamepad2, Search, Settings, Network, Copy, Check, MessageSquare, Send, ArrowLeft, X, PlusCircle, Mic, Edit2, Trash2, StopCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function CommunityPage({ searchParams }: any) {
  const [activeTab, setActiveTab] = useState("friends"); // 'friends', 'add', 'chat'
  const [profile, setProfile] = useState<any>(null);
  const [friendsData, setFriendsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Chat States
  const [chatUser, setChatUser] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice Recording & Edit States
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<any>(null);
  const [editingMsg, setEditingMsg] = useState<any>(null);

  // Set Username Modal Stage
  const [usernameInput, setUsernameInput] = useState("");
  const [settingUsername, setSettingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  // Friend Request Stage
  const [friendReqInput, setFriendReqInput] = useState("");
  const [reqStatus, setReqStatus] = useState("");

  const fetchData = async () => {
    try {
      const pRes = await fetch("/api/profile");
      const pData = await pRes.json();
      setProfile(pData);
      
      const fRes = await fetch("/api/social/friends");
      const fData = await fRes.json();
      if(fData.friends) setFriendsData(fData.friends);
    } catch(e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchMessages = async () => {
    if (!chatUser?.id) return;
    try {
        const res = await fetch(`/api/social/messages?targetUserId=${chatUser.id}`);
        const data = await res.json();
        if (data.messages) {
            setChatMessages(data.messages);
        }
    } catch (err) {}
  };

  useEffect(() => {
     let interval: any;
     if (activeTab === 'chat' && chatUser?.id) {
         fetchMessages();
         interval = setInterval(() => {
             fetchMessages();
         }, 2000);
     }
     return () => {
         if (interval) clearInterval(interval);
     };
  }, [activeTab, chatUser]);

  useEffect(() => {
     if (messagesEndRef.current) {
         messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
     }
  }, [chatMessages]);

  const handleSaveUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingUsername(true);
    setUsernameError("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput })
      });
      const data = await res.json();
      if (data.error) {
        setUsernameError(data.error);
      } else {
        setProfile({ ...profile, username: data.username });
        window.location.reload();
      }
    } catch (e) {
      setUsernameError("Bağlantı hatası");
    } finally {
      setSettingUsername(false);
    }
  };

  const handleSendRequest = async () => {
    if(!friendReqInput) return;
    setReqStatus("Gönderiliyor...");
    try {
      const res = await fetch("/api/social/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUsername: friendReqInput })
      });
      const data = await res.json();
      if(data.error) {
        setReqStatus(data.error);
      } else {
        setReqStatus("İstek Başarıyla Gönderildi!");
        setFriendReqInput("");
        fetchData(); // refresh list
      }
    } catch(e) {
      setReqStatus("Ağ hatası");
    }
  };

  const handleRespondRequest = async (id: string, action: 'ACCEPTED' | 'REJECTED') => {
    try {
      const res = await fetch("/api/social/friends", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendshipId: id, status: action })
      });
      if(res.ok) fetchData();
    } catch(e) {}
  };

  const openChatPanel = (userProfile: any) => {
      setChatUser(userProfile);
      setChatMessages([]);
      setActiveTab('chat');
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || chatInput;
    if (!textToSend.trim() || !chatUser?.id) return;

    if (editingMsg) {
        // Edit flow
        setChatMessages(prev => prev.map(m => m.id === editingMsg.id ? { ...m, text: textToSend } : m));
        const editId = editingMsg.id;
        setEditingMsg(null);
        setChatInput("");
        await fetch('/api/social/messages', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messageId: editId, newText: textToSend })
        });
        return;
    }
    
    const optimisticMsg = {
        id: Date.now().toString(),
        text: textToSend,
        isMe: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, optimisticMsg]);
    setChatInput("");

    try {
        await fetch('/api/social/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetUserId: chatUser.id, text: textToSend })
        });
    } catch(err) {
        console.error("Message send failed", err);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
      setChatMessages(prev => prev.filter(m => m.id !== msgId));
      await fetch(`/api/social/messages?messageId=${msgId}`, { method: 'DELETE' });
  };

  const startRecording = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const recorder = new MediaRecorder(stream);
          const chunks: any[] = [];
          recorder.ondataavailable = e => chunks.push(e.data);
          recorder.onstop = () => {
              const blob = new Blob(chunks, { type: 'audio/webm' });
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                  const base64data = reader.result;
                  handleSendMessage(undefined, base64data as string);
              };
              stream.getTracks().forEach(t => t.stop());
          };
          recorder.start();
          setMediaRecorder(recorder);
          setIsRecording(true);
          setRecordingTime(0);
          recordingTimerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
      } catch (e) {
          alert("Mikrofon izni reddedildi veya hata oluştu.");
      }
  };

  const stopRecording = () => {
      if (mediaRecorder && isRecording) {
          mediaRecorder.stop();
          setIsRecording(false);
          clearInterval(recordingTimerRef.current);
      }
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-8"><div className="animate-spin w-8 h-8 border-4 border-dublio-cyan border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col font-sans overflow-hidden relative">
      <Navbar />

      {/* MODAL: Kullanıcı adı yoksa zorunlu kurulum */}
      {!profile?.username && (
        <div className="absolute inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
           <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#121318] border border-dublio-cyan/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(6,182,212,0.2)] text-center">
             <div className="w-16 h-16 bg-dublio-cyan/10 rounded-full flex items-center justify-center mx-auto mb-6 text-dublio-cyan">
               <Settings className="w-8 h-8" />
             </div>
             <h2 className="text-2xl font-black uppercase mb-2">Kimlik Oluştur</h2>
             <p className="text-sm text-white/50 mb-6">Topluluğa katılmak ve arkadaş eklemek için eşsiz bir kullanıcı adı (ID) belirlemelisin.</p>
             
             <form onSubmit={handleSaveUsername}>
               <input 
                 type="text" 
                 value={usernameInput}
                 onChange={e => setUsernameInput(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                 placeholder="örn: joker_99" 
                 className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-dublio-cyan mb-2"
               />
               {usernameError && <p className="text-red-500 text-xs font-bold text-left mb-4">{usernameError}</p>}
               <button 
                 type="submit" 
                 disabled={settingUsername || usernameInput.length < 3}
                 className="w-full mt-4 bg-dublio-cyan text-black font-black uppercase py-3 rounded-xl disabled:opacity-50 hover:bg-cyan-400 transition-colors"
               >
                 {settingUsername ? 'KAYDEDİLİYOR...' : 'ONAYLA VE GİRİŞ YAP'}
               </button>
             </form>
           </motion.div>
        </div>
      )}

      <main className="flex-1 flex mt-20 h-[calc(100vh-5rem)]">
        {/* Left Sidebar */}
        <div className="w-20 md:w-64 bg-[#121318] border-r border-white/5 flex flex-col">
          <div className="p-4 border-b border-white/5 flex items-center justify-center md:justify-start gap-3">
             <div className="bg-dublio-purple/20 p-2 rounded-lg text-dublio-purple flex shrink-0">
               <Network className="w-5 h-5 md:w-6 md:h-6" />
             </div>
             <h1 className="font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white to-dublio-purple uppercase tracking-widest hidden md:block">
               AĞ
             </h1>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
             <button 
                onClick={() => setActiveTab('friends')}
                className={`w-full flex items-center justify-center md:justify-start gap-4 px-4 py-3 mx-2 my-1 rounded-xl transition-all ${activeTab === 'friends' ? 'bg-white/10 text-white shadow-inner' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
             >
               <Users className="w-5 h-5 shrink-0" />
               <span className="font-bold hidden md:block">Arkadaşlarım</span>
             </button>
             <button 
                onClick={() => setActiveTab('add')}
                className={`w-full flex items-center justify-center md:justify-start gap-4 px-4 py-3 mx-2 my-1 rounded-xl transition-all ${activeTab === 'add' ? 'bg-dublio-cyan/20 text-dublio-cyan shadow-inner' : 'text-dublio-cyan/50 hover:bg-dublio-cyan/10 hover:text-dublio-cyan'}`}
             >
               <Search className="w-5 h-5 shrink-0" />
               <span className="font-bold hidden md:block">Yeni Kişi Ekle</span>
             </button>

             <div className="my-4 mx-4 h-[1px] bg-white/5"></div>
             <p className="px-4 text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 hidden md:block">Gelen İstekler</p>

             {friendsData.filter(f => f.status === 'PENDING' && f.type === 'received').map(f => (
               <button key={f.id} onClick={() => setActiveTab('friends')} className="w-full flex items-center justify-center md:justify-start gap-3 px-4 py-2 mx-2 my-1 rounded-xl hover:bg-white/5 transition-all text-white/70 hover:text-white group">
                 <div className="relative">
                   <img src={f.profile?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.profile?.username}`} className="w-8 h-8 rounded-full bg-black shrink-0" />
                   <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold">1</div>
                 </div>
                 <span className="font-bold text-sm hidden md:block truncate">{f.profile?.username}</span>
               </button>
             ))}
             {friendsData.filter(f => f.status === 'PENDING' && f.type === 'received').length === 0 && (
                <div className="px-4 py-2 text-xs text-white/20 hidden md:block">Bekleyen istek yok</div>
             )}
          </div>

          <div className="p-4 border-t border-white/5 flex items-center gap-3 bg-black/20">
             <img src={profile?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username}`} className="w-10 h-10 bg-white/10 rounded-full shrink-0" />
             <div className="flex-1 min-w-0 hidden md:block">
               <p className="text-sm font-bold text-white truncate">{profile?.username || 'Misafir'}</p>
               <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider flex items-center gap-1">
                 Benim Hesabım
               </p>
             </div>
             <button className="text-white/40 hover:text-white transition-colors hidden md:block shrink-0">
               <Settings className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-[#0d0e12] relative overflow-y-auto">
          <div className="absolute top-4 right-4 z-50">
             <div className="px-4 py-1.5 bg-pink-500/20 border border-pink-500/50 text-pink-500 text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(236,72,153,0.3)] animate-pulse">
               PRE-ALPHA TEST
             </div>
          </div>

          {activeTab === 'friends' && (
             <div className="p-8">
               <div className="mb-10">
                 <h2 className="text-2xl font-black uppercase tracking-wider border-b border-white/5 pb-4 mb-6 text-dublio-cyan">Gelen İstekler</h2>
                 {friendsData.filter(f => f.status === 'PENDING' && f.type === 'received').length === 0 ? (
                    <div className="text-white/30 text-sm italic bg-white/5 p-4 rounded-xl">Henüz gelen bir arkadaşlık isteği yok.</div>
                 ) : (
                    friendsData.filter(f => f.status === 'PENDING' && f.type === 'received').map(f => (
                      <div key={f.id} className="bg-[#121318]/80 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                           <img src={f.profile?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.profile?.username}`} className="w-10 h-10 rounded-full bg-black shrink-0" />
                           <div>
                             <p className="font-bold">{f.profile?.username}</p>
                             <p className="text-xs text-white/40">Seni eklemek istiyor</p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => handleRespondRequest(f.id, 'ACCEPTED')} className="px-4 py-2 bg-green-500/20 text-green-500 hover:bg-green-500/40 rounded-lg text-sm font-bold">Kabul Et</button>
                           <button onClick={() => handleRespondRequest(f.id, 'REJECTED')} className="px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/40 rounded-lg text-sm font-bold">Reddet</button>
                        </div>
                      </div>
                    ))
                 )}
               </div>

               <h2 className="text-2xl font-black uppercase tracking-wider border-b border-white/5 pb-4 mb-6">Tüm Arkadaşlar ({friendsData.filter(f => f.status === 'ACCEPTED').length})</h2>
               
               {friendsData.filter(f => f.status === 'ACCEPTED').length === 0 && (
                  <div className="text-center py-20 text-white/30 flex flex-col items-center">
                    <Users className="w-12 h-12 mb-4 opacity-50" />
                    <p>Burası çok ıssız... Sol menüden yeni birilerini ekle!</p>
                  </div>
               )}

               <div className="grid gap-4">
                 {friendsData.filter(f => f.status === 'ACCEPTED').map(f => (
                    <div key={f.id} className="bg-[#121318] border border-white/5 hover:border-white/10 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between transition-colors gap-4">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                         <div className="relative">
                           <img src={f.profile?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.profile?.username}`} className="w-12 h-12 rounded-full bg-black shrink-0 border border-white/10" />
                           <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#121318]"></div>
                         </div>
                         <div>
                           <p className="font-bold text-lg">{f.profile?.name || 'Dublajcı'}</p>
                           <p className="text-xs text-white/50 font-bold uppercase tracking-widest">@{f.profile?.username}</p>
                         </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto justify-end">
                         <button onClick={() => openChatPanel(f.profile)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors tooltip-trigger relative group">
                            <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-black border border-white/10 text-xs font-bold px-2 py-1 rounded">Mesaj</span>
                            <MessageSquare className="w-5 h-5 text-white/70 group-hover:text-white" />
                         </button>
                         <button onClick={() => alert("Sesli arama özelliği WebRTC bağlantısı bekliyor (Pre-Alpha)")} className="w-10 h-10 rounded-full bg-dublio-cyan/10 hover:bg-dublio-cyan/20 flex items-center justify-center transition-colors tooltip-trigger relative group text-dublio-cyan shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                            <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-dublio-cyan text-black px-2 py-1 rounded text-xs font-bold whitespace-nowrap z-50">Sesli Ara</span>
                            <Phone className="w-5 h-5 relative z-10" />
                         </button>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {activeTab === 'add' && (
             <div className="flex flex-col items-center justify-center h-full p-6 md:p-8">
                <div className="w-full max-w-lg text-center bg-[#121318] border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                  <Search className="w-16 h-16 text-dublio-cyan mx-auto mb-6 opacity-80 drop-shadow-[0_0_15px_cyan] rounded-full p-2 bg-dublio-cyan/10" />
                  <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Arkadaş Ekle</h2>
                  <p className="text-white/50 text-sm mb-8">Dublaj severleri bulmak için sadece kullanıcı adlarını girmeniz yeterli.</p>
                  
                  <div className="relative mb-4">
                    <input 
                      type="text" 
                      value={friendReqInput}
                      onChange={e => setFriendReqInput(e.target.value.toLowerCase())}
                      placeholder="Arkadaşının @KullanıcıAdı..." 
                      className="w-full bg-black/50 border border-dublio-cyan/30 rounded-2xl py-4 flex-1 px-6 text-white outline-none focus:border-dublio-cyan shadow-inner text-lg placeholder:text-white/20"
                    />
                  </div>
                  
                  <button onClick={handleSendRequest} disabled={!friendReqInput} className="w-full py-4 bg-dublio-cyan text-black font-black uppercase text-sm rounded-xl hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)] block">
                    İstek Gönder
                  </button>
                  
                  {reqStatus && <p className={`mt-4 text-sm font-bold ${reqStatus.includes('Hata') || reqStatus.includes('Bulunamadı') || reqStatus.includes('başarısız') ? 'text-red-500' : 'text-green-500'}`}>{reqStatus}</p>}

                  <div className="mt-8 pt-6 border-t border-white/5">
                    <p className="text-xs text-white/40 mb-2 uppercase tracking-widest font-bold">Senin Kullanıcı Adın</p>
                    <div className="inline-flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                      <span className="font-mono text-dublio-cyan">@{profile?.username}</span>
                      <button onClick={() => navigator.clipboard.writeText(profile?.username)} className="text-white/50 hover:text-white"><Copy className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
             </div>
          )}

          {activeTab === 'chat' && chatUser && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full bg-[#121318]">
               {/* Chat Header */}
               <div className="flex items-center px-6 py-4 border-b border-white/5 bg-[#1a1c23] shadow-sm shrink-0">
                  <div className="flex items-center gap-4">
                     <div className="relative">
                       <img src={chatUser.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chatUser.username}`} className="w-10 h-10 rounded-full bg-black shrink-0 border border-white/10" />
                       <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1c23]"></div>
                     </div>
                     <div>
                       <h3 className="font-bold text-lg leading-tight">{chatUser.username}</h3>
                       <p className="text-xs text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">ÇEVRİMİÇİ <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block ml-1"></span></p>
                     </div>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                     <button onClick={() => alert("Sesli arama sistemi yakında!")} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white/70 hover:text-white">
                        <Phone className="w-5 h-5" />
                     </button>
                     <button onClick={() => setActiveTab('friends')} className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors text-red-500">
                        <X className="w-5 h-5" />
                     </button>
                  </div>
               </div>

               {/* Chat Body */}
               <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {chatMessages.length === 0 && (
                     <div className="h-full flex flex-col items-center justify-center text-center opacity-50 select-none">
                        <MessageSquare className="w-16 h-16 mb-4 text-dublio-cyan" />
                        <h3 className="text-2xl font-black">{chatUser.username} ile sohbet et!</h3>
                        <p className="text-sm">Mesajlar uçtan uca şifrelenmez (çünkü yapmadık 😄)</p>
                     </div>
                  )}
                  {chatMessages.map(msg => (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg.id} className={`flex items-start gap-4 group ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                        <img src={msg.isMe ? (profile?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username}`) : (chatUser.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chatUser.username}`)} className="w-10 h-10 rounded-full shrink-0 border border-white/5" />
                        <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[85%]`}>
                           <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-bold text-sm text-white/80">{msg.isMe ? profile?.username || 'Sen' : chatUser.username}</span>
                              <span className="text-[10px] text-white/30 font-bold">{msg.time}</span>
                           </div>
                           <div className="flex items-center gap-2 relative">
                               {msg.isMe && (
                                  <div className="hidden group-hover:flex items-center gap-1 absolute top-1/2 -translate-y-1/2 right-full mr-2">
                                     {!msg.text.startsWith('data:audio') && (
                                       <button onClick={() => { setEditingMsg(msg); setChatInput(msg.text); }} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors">
                                           <Edit2 className="w-3.5 h-3.5" />
                                       </button>
                                     )}
                                     <button onClick={() => handleDeleteMessage(msg.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-500 transition-colors">
                                         <Trash2 className="w-3.5 h-3.5" />
                                     </button>
                                  </div>
                               )}
                               <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed min-w-[3rem] ${msg.isMe ? 'bg-[#00c8ff] text-black font-bold rounded-tr-sm' : 'bg-[#2b2d35] text-white font-medium rounded-tl-sm'}`}>
                                   {msg.text.startsWith('data:audio') ? (
                                      <audio src={msg.text} controls className="h-8 w-[200px]" />
                                   ) : (
                                      msg.text
                                   )}
                               </div>
                           </div>
                        </div>
                     </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
               </div>

               {/* Chat Input */}
               <form onSubmit={handleSendMessage} className="p-4 bg-[#1a1c23] border-t border-white/5 shrink-0 flex flex-col gap-2">
                  {editingMsg && (
                      <div className="flex items-center justify-between text-xs text-dublio-cyan bg-dublio-cyan/10 px-4 py-2 rounded-xl mb-1">
                          <span className="font-bold">Mesaj düzenleniyor...</span>
                          <button type="button" onClick={() => { setEditingMsg(null); setChatInput(""); }} className="hover:text-white"><X className="w-4 h-4" /></button>
                      </div>
                  )}
                  {isRecording ? (
                      <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-xl p-1 px-4">
                          <div className="flex items-center gap-3 text-red-500 font-bold text-sm">
                              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                              Ses Kaydediliyor... 00:{recordingTime.toString().padStart(2, '0')}
                          </div>
                          <button type="button" onClick={stopRecording} className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shrink-0">
                              <StopCircle className="w-5 h-5" />
                          </button>
                      </div>
                  ) : (
                      <div className="flex items-center bg-[#121318] border border-white/10 rounded-xl focus-within:border-[#00c8ff]/50 transition-colors p-1">
                         <button type="button" className="w-10 h-10 flex items-center justify-center text-white/30 hover:text-white transition-colors shrink-0">
                            <PlusCircle className="w-5 h-5" />
                         </button>
                         <input 
                            type="text" 
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            placeholder={`@${chatUser.username} kişisine mesaj gönder...`} 
                            className="flex-1 bg-transparent px-2 py-3 text-sm text-white focus:outline-none placeholder:text-white/30"
                         />
                         
                         {chatInput.trim() || editingMsg ? (
                             <button type="submit" className="w-10 h-10 flex items-center justify-center bg-[#00c8ff] text-black rounded-lg hover:bg-cyan-400 transition-colors shrink-0">
                                <Send className="w-4 h-4" />
                             </button>
                         ) : (
                             <button type="button" onClick={startRecording} className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0">
                                <Mic className="w-5 h-5" />
                             </button>
                         )}
                      </div>
                  )}
               </form>
             </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
