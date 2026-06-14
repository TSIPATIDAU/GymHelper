
import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface LockScreenProps {
    onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/verify_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            if (!response.ok) throw new Error('API error');
            const data = await response.json();
            if (data.success) {
                onUnlock();
            } else {
                setError(true);
                setPassword('');
            }
        } catch (err) {
            console.error(err);
            setError(true);
            setPassword('');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-700">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <Lock className="text-white" size={32} />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white text-center mb-2">VoimaAI</h2>
                <p className="text-slate-400 text-center mb-6 text-sm">Sovellus on suojattu salasanalla.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(false);
                            }}
                            placeholder="Syötä pääsykoodi"
                            className={`w-full bg-slate-700/50 border-2 ${error ? 'border-red-500' : 'border-slate-600 focus:border-blue-500'} rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition-all text-center text-lg tracking-widest`}
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-900/20 active:scale-95 transform"
                    >
                        AVAA
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LockScreen;
