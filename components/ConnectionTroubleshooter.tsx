import React from 'react';
import { RefreshIcon } from './Icons';
import { getDisplayConfig } from '../api';

interface ConnectionTroubleshooterProps {
  error: string;
  onRetry: () => void;
  onConfigure: () => void;
}

const ConnectionTroubleshooter: React.FC<ConnectionTroubleshooterProps> = ({ error, onRetry, onConfigure }) => {
  const { apiUrl, apiKey } = getDisplayConfig();
  const testUrl = `${apiUrl}?key=${apiKey}&callback=test`;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800/50 rounded-2xl border border-slate-700 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Connection Failed</h2>
          <p className="text-slate-300 mb-6 font-mono bg-slate-900/50 p-3 rounded-md border border-red-800 text-red-300">{error}</p>
          
          <div className="flex gap-4">
              <button
                onClick={onConfigure}
                className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold rounded-md transition-colors"
              >
                Reconfigure API Settings
              </button>
              <button
                onClick={onRetry}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-600 rounded-md font-medium text-slate-300 hover:bg-slate-700 transition-colors"
              >
                <RefreshIcon className="h-4 w-4" />
                Retry Connection
              </button>
          </div>

          <div className="text-left text-xs text-slate-400 mt-8 p-4 bg-slate-900/50 rounded-md border border-slate-700">
            <h4 className="font-bold mb-2 text-slate-200">Troubleshooting Checklist:</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Test JSONP URL:</strong> Click the link below. If it works, you should see a block of text starting with `test({"{'{...}'}"})`. If you see a Google error page, the URL is wrong.
                <a href={testUrl} target="_blank" rel="noopener noreferrer" className="block mt-1 text-cyan-400 break-all hover:underline">{testUrl}</a>
              </li>
              <li><strong>Check API Key:</strong> If the test shows an "unauthorized" error, your API Key is incorrect in the app or in your Apps Script's "Script Properties".</li>
              <li><strong>Check Deployment:</strong> Ensure your Apps Script is deployed as a "Web app" with "Who has access" set to "Anyone". This is the most common cause of failure.</li>
              <li><strong>Re-Deploy:</strong> If you change the script, you **must** create a "New deployment" to get a new URL. Update the URL in the app's settings.</li>
            </ul>
          </div>
        </div>
    </div>
  );
};

export default ConnectionTroubleshooter;