import React, { useState, useEffect } from 'react';
import { Card, Button, Input, useNotification, ConfirmDialog } from '../../../shared/components';
import { Search, Users, MessageSquare, Plus, Send, ChevronRight, User as UserIcon, LogOut } from 'lucide-react';
import { promotionsService } from '../services/promotions.service';
import { authService } from '../../../shared/services/auth.service';
import { motion, AnimatePresence } from 'framer-motion';

const PromotionModule = () => {
  const [activeView, setActiveView] = useState('list'); // 'list', 'search', 'chat'
  const [myGroups, setMyGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const [confirmLeave, setConfirmLeave] = useState({ open: false, groupId: null });

  const fetchMyGroups = async () => {
    try {
      const data = await promotionsService.getMyGroups();
      setMyGroups(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyGroups();
  }, []);

  const handleJoin = async (groupData) => {
    try {
      setLoading(true);
      await promotionsService.joinOrCreate(groupData);
      showNotification('¡Te has unido a la promoción!', 'success');
      await fetchMyGroups();
      setActiveView('list');
    } catch (err) {
      showNotification('Error al unirse al grupo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!confirmLeave.groupId) return;
    try {
      setLoading(true);
      await promotionsService.leaveGroup(confirmLeave.groupId);
      showNotification('Has salido de la promoción', 'success');
      await fetchMyGroups();
      setActiveView('list');
      setConfirmLeave({ open: false, groupId: null });
    } catch (err) {
      showNotification('Error al salir del grupo', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Promociones</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>Conéctate con tus compañeros de clase y mantén vivo el legado.</p>
        </div>
        {activeView === 'list' && (
          <Button icon={Plus} onClick={() => setActiveView('search')}>
            Unirse o Crear Grupo
          </Button>
        )}
        {activeView !== 'list' && (
          <Button variant="secondary" onClick={() => setActiveView('list')}>
            Volver a mis grupos
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'list' && (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}
          >
            {myGroups.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px', background: 'white', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
                <Users size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>Aún no perteneces a ninguna promoción</h3>
                <p style={{ color: '#64748b', marginBottom: '24px' }}>Busca tu año y grupo para empezar a chatear con tus compañeros.</p>
                <Button onClick={() => setActiveView('search')}>Buscar mi promoción</Button>
              </div>
            ) : (
              myGroups.map(item => (
                <GroupCard 
                  key={item.id} 
                  group={item.promotionGroup} 
                  onChat={() => {
                    setSelectedGroup(item.promotionGroup);
                    setActiveView('chat');
                  }}
                  onLeave={() => setConfirmLeave({ open: true, groupId: item.promotionGroup.id })}
                />
              ))
            )}
          </motion.div>
        )}

        {activeView === 'search' && (
          <motion.div 
            key="search"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <SearchForm onJoin={handleJoin} loading={loading} />
          </motion.div>
        )}

        {activeView === 'chat' && (
          <motion.div 
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ChatRoom 
              group={selectedGroup} 
              onLeave={() => setConfirmLeave({ open: true, groupId: selectedGroup.id })} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog 
        isOpen={confirmLeave.open}
        onClose={() => setConfirmLeave({ open: false, groupId: null })}
        onConfirm={handleLeave}
        title="Salir de la Promoción"
        message="¿Estás seguro de que deseas salir de este grupo? Ya no podrás ver los mensajes ni participar en el chat."
        confirmText="Sí, Salir"
        variant="danger"
      />
    </div>
  );
};

const GroupCard = ({ group, onChat, onLeave }) => (
  <Card style={{ padding: 0, overflow: 'hidden' }}>
    <div style={{ padding: '24px', background: 'linear-gradient(45deg, #2563eb, #06b6d4)', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8 }}>Promo {group.year}</span>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
          {group.members?.length || 0} Miembros
        </div>
      </div>
      <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '12px 0 4px' }}>{group.groupName}</h3>
      <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>{group.programName}</p>
    </div>
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '-8px' }}>
        {group.members?.slice(0, 3).map((m, i) => (
          <div key={i} style={{ 
            width: '32px', height: '32px', borderRadius: '50%', border: '2px solid white', 
            background: '#f1f5f9', overflow: 'hidden', marginLeft: i > 0 ? '-10px' : 0
          }}>
            {m.user.photoUrl ? <img src={m.user.photoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon size={16} style={{ margin: '6px' }} />}
          </div>
        ))}
        {group.members?.length > 3 && (
          <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px', fontWeight: 600 }}>
            +{group.members.length - 3} más
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button variant="danger" size="sm" icon={LogOut} onClick={onLeave} style={{ padding: '8px' }} />
        <Button variant="secondary" size="sm" icon={MessageSquare} onClick={onChat}>
          Chat Grupal
        </Button>
      </div>
    </div>
  </Card>
);

const SearchForm = ({ onJoin, loading }) => {
  const [form, setForm] = useState({ year: '', programName: '', groupName: '' });
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    promotionsService.getPrograms().then(setPrograms);
  }, []);

  return (
    <Card title="Unirse a una Promoción">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <Input 
          label="Año de Graduación" 
          type="number" 
          placeholder="Ej: 2023"
          value={form.year}
          onChange={e => setForm({...form, year: e.target.value})}
        />
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Programa</label>
          <select 
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
            value={form.programName}
            onChange={e => setForm({...form, programName: e.target.value})}
          >
            <option value="">Seleccionar Programa</option>
            {programs.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
        </div>
        <Input 
          label="Grupo / Sección" 
          placeholder="Ej: 11-A o Grupo 1"
          value={form.groupName}
          onChange={e => setForm({...form, groupName: e.target.value})}
        />
      </div>
      <div style={{ textAlign: 'center', padding: '32px', border: '2px dashed #f1f5f9', borderRadius: '16px' }}>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>
          Si el grupo aún no existe para tu año y programa, se creará automáticamente para que puedas invitar a otros compañeros.
        </p>
        <Button 
          size="lg" 
          loading={loading}
          disabled={!form.year || !form.programName || !form.groupName}
          onClick={() => onJoin(form)}
        >
          Unirse a mi Promoción
        </Button>
      </div>
    </Card>
  );
};

const ChatRoom = ({ group, onLeave }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      const data = await promotionsService.getMessages(group.id);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Polling cada 5 seg
    return () => clearInterval(interval);
  }, [group.id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await promotionsService.sendMessage(group.id, newMessage);
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '600px' }}>
      {/* Chat Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <Users size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontWeight: 700 }}>{group.groupName} - Promo {group.year}</h4>
            <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>Online</span>
          </div>
        </div>
        <Button variant="danger" size="sm" icon={LogOut} onClick={onLeave}>
          Salir del Grupo
        </Button>
      </div>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#f8fafc' }}>
        {messages.map((m, i) => (
          <div key={m.id} style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignSelf: m.user.id === authService.getUser()?.id ? 'flex-end' : 'flex-start',
            maxWidth: '70%'
          }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', marginLeft: '4px' }}>
              {m.user.firstName} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: '16px',
              backgroundColor: m.user.id === authService.getUser()?.id ? '#2563eb' : 'white',
              color: m.user.id === authService.getUser()?.id ? 'white' : '#1e293b',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              fontSize: '14px'
            }}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <form onSubmit={handleSend} style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
        <input 
          type="text" 
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
        />
        <button type="submit" style={{ 
          width: '48px', height: '48px', borderRadius: '12px', background: '#2563eb', color: 'white', 
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <Send size={20} />
        </button>
      </form>
    </Card>
  );
};

export default PromotionModule;
