import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './Icons';
import { getDisplayConfig } from '../api';

interface ApiConfigurationProps {
  onClose: () => void;
  onSave: () => void;
}

const ApiConfiguration: React.FC<ApiConfigurationProps> = ({ onClose, onSave }) => {
    const [apiUrl, setApiUrl] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const { apiUrl: currentApiUrl, apiKey: currentApiKey } = getDisplayConfig();
        setApiUrl(currentApiUrl);
        setApiKey(currentApiKey);
    }, []); // Run once on mount

    const handleSave = () => {
        if (!apiUrl.trim() || !apiKey.trim()) {
            setError('Both API URL and API Key are required.');
            return;
        }
        localStorage.setItem('API_URL', apiUrl.trim());
        localStorage.setItem('API_KEY', apiKey.trim());
        onSave();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-slate-100">Backend API Configuration</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="Close API configuration">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </header>
                <div className="p-6 space-y-4">
                    {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md text-sm">{error}</div>}
                    <div>
                        <label htmlFor="api-url" className="block text-sm font-medium text-slate-300 mb-1">Apps Script Web App URL</label>
                        <input
                            id="api-url"
                            type="text"
                            value={apiUrl}
                            onChange={(e) => setApiUrl(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg shadow-sm py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                            placeholder="https://script.google.com/macros/s/.../exec"
                        />
                         <p className="text-xs text-slate-500 mt-1">A default can be set in `public/config.js`.</p>
                    </div>
                     <div>
                        <label htmlFor="api-key" className="block text-sm font-medium text-slate-300 mb-1">API Key</label>
                        <input
                            id="api-key"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg shadow-sm py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                            placeholder="Your secret key from Script Properties"
                        />
                         <p className="text-xs text-slate-500 mt-1">This is stored securely in your browser's local storage.</p>
                    </div>
                     <div className="text-xs text-slate-400 mt-2 p-3 bg-slate-700/50 rounded-md border border-slate-600">
                        <p className="font-bold mb-1">Important:</p>
                        <p>When deploying your Apps Script, ensure you set "Who has access" to <span className="font-semibold text-amber-300">"Anyone"</span>. Your API key will keep it secure.</p>
                    </div>
                </div>
                <footer className="p-4 border-t border-slate-700 flex justify-end gap-4 bg-slate-800/50">
                     <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-600 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
                     >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm font-medium rounded-md transition-colors"
                    >
                        Save and Reload
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ApiConfiguration;