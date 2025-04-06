import React, { useState, useEffect, useRef } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import '../styles/CommandPalette.css';

function CommandPalette({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const inputRef = useRef(null);

    const commands = [
        { id: 'add-application', name: 'Add New Application', action: () => navigate('/dashboard/add') },
        { id: 'view-applications', name: 'View Applications', action: () => navigate('/dashboard/applications') },
        { id: 'profile', name: 'View Profile', action: () => navigate('/profile') },
        {
            id: 'logout',
            name: 'Logout',
            action: async () => {
                try {
                    await fetch('/api/logout');
                    navigate('/');
                } catch (err) {
                    console.error('Logout failed:', err);
                }
            }
        }
    ];

    
    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                isOpen ? onClose() : onClose(true);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="command-overlay">
            <div className="command-container">
                <Command>
                    <div className="command-input-container">
                        <Command.Input
                            ref={inputRef}
                            value={search}
                            onValueChange={setSearch}
                            placeholder="Search commands..."
                            className="command-input"
                        />
                    </div>
                    <Command.List className="command-list">
                        <Command.Empty className="command-empty">No results found.</Command.Empty>
                        {commands.map((command) => (
                            <Command.Item
                                key={command.id}
                                onSelect={() => {
                                    command.action();
                                    setSearch('');
                                    onClose();
                                }}
                                className="command-item"
                            >
                                {command.name}
                            </Command.Item>
                        ))}
                    </Command.List>
                </Command>
            </div>
        </div>
    );
}

export default CommandPalette;
