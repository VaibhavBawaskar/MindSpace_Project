import React, { useState, useEffect } from 'react';
// Trash2 आयकॉन आता खाली वापरला आहे, त्यामुळे वॉर्निंग येणार नाही
import { Trash2, Plus, Loader2 } from 'lucide-react';

const TaskSession = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form States
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // १. बॅकएंडवरून नोट्स मिळवणे
    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/notes/');
            const data = await response.json();
            setNotes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching notes:", err);
        } finally {
            setLoading(false);
        }
    };

    // २. नवीन नोट बॅकएंडला सेव्ह करणे
    const handleSaveNote = async () => {
        if (!title || !content) {
            alert("Please fill all fields");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/notes/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });

            if (response.ok) {
                setTitle("");
                setContent("");
                setShowForm(false);
                fetchNotes();
            }
        } catch (err) {
            console.error("Failed to save note:", err);
        }
    };

    // ३. नोट डिलीट करणे
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/notes/${id}/`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setNotes(notes.filter(n => n.id !== id));
            }
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    return (
        <section id="tasks" className="content-section" style={{ display: 'block', padding: '20px', fontFamily: "'Inter', sans-serif" }}>
            <div className="page-header">
                <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Notes & Tasks</h1>
                <p style={{ color: '#6B7280' }}>Manage your daily professional records</p>
            </div>

            <div className="stats-row" style={{ display: 'flex', gap: '20px', marginBottom: '30px', marginTop: '20px' }}>
                <div className="stat-card" style={statCardStyle}>
                    <div className="stat-content">
                        <p className="stat-title" style={{ margin: 0, color: '#64748B' }}>Total Notes</p>
                        <p className="stat-number" style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>{notes.length}</p>
                    </div>
                    <div className="stat-icon" style={{ ...iconCircle, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <Plus size={20} color="white" />
                    </div>
                </div>
                <div className="stat-card" style={statCardStyle}>
                    <div className="stat-content">
                        <p className="stat-title" style={{ margin: 0, color: '#64748B' }}>Status</p>
                        <p className="stat-number" style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>{loading ? '...' : 'Live'}</p>
                    </div>
                    <div className="stat-icon" style={{ ...iconCircle, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        <Loader2 size={20} color="white" className={loading ? "animate-spin" : ""} />
                    </div>
                </div>
            </div>

            <div className="notes-container" style={{ background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <div className="notes-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, fontWeight: '700' }}>My Notes</h2>
                    <button onClick={() => setShowForm(!showForm)} style={btnStyle}>
                        {showForm ? 'Close Form' : '+ Add New Note'}
                    </button>
                </div>

                {showForm && (
                    <div className="add-note-form" style={{ marginBottom: '30px', padding: '20px', background: '#F8FAFC', borderRadius: '15px', border: '1px solid #E2E8F0' }}>
                        <input
                            type="text"
                            placeholder="Note Title"
                            style={inputStyle}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="Write your note here..."
                            rows="4"
                            style={{ ...inputStyle, marginTop: '10px', resize: 'none' }}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        ></textarea>
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <button onClick={handleSaveNote} style={{ ...btnStyle, background: '#10B981' }}>Save Note</button>
                            <button onClick={() => setShowForm(false)} style={{ ...btnStyle, background: '#64748B' }}>Cancel</button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 className="animate-spin" size={32} color="#6366F1" /></div>
                ) : (
                    <div className="notes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {notes.map((note) => (
                            <div key={note.id} style={noteCardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ margin: 0, fontSize: '18px', color: '#1E293B', fontWeight: '700' }}>{note.title}</h3>
                                    {/* इथे आता Trash2 आयकॉन वापरला आहे */}
                                    <button
                                        onClick={() => handleDelete(note.id)}
                                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8', transition: '0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <p style={{ color: '#475569', fontSize: '14px', margin: '15px 0', lineHeight: '1.6' }}>{note.content}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #F1F5F9' }}>
                                    <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '500' }}>
                                        {note.created_at ? new Date(note.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today'}
                                    </span>
                                    <span style={tagStyle}>Note</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && notes.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <p style={{ color: '#94A3B8', fontSize: '16px' }}>No notes found. Click '+ Add New Note' to start.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

// Styles
const statCardStyle = { flex: 1, background: '#fff', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
const iconCircle = { width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const btnStyle = { padding: '10px 22px', borderRadius: '12px', border: 'none', backgroundColor: '#6366F1', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', boxSizing: 'border-box', fontSize: '14px', transition: '0.2s' };
const noteCardStyle = { background: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' };
const tagStyle = { backgroundColor: '#EEF2FF', padding: '4px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: '800', color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.5px' };

export default TaskSession;