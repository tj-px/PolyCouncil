import React, { useState } from 'react';
import { CouncilMember } from '../types';

interface StepCollectProps {
  question: string;
  imageBase64: string | null;
  councilMembers: CouncilMember[];
  updateMemberResponse: (id: string, response: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const StepCollect: React.FC<StepCollectProps> = ({
  question,
  imageBase64,
  councilMembers,
  updateMemberResponse,
  onBack,
  onNext
}) => {
  const [copySuccess, setCopySuccess] = useState('');
  const [cleanStatus, setCleanStatus] = useState<'idle' | 'cleaning' | 'done'>('idle');

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(question);
      setCopySuccess('Prompt copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleCutCitations = () => {
    setCleanStatus('cleaning');
    let changeCount = 0;

    councilMembers.forEach(member => {
      if (!member.response) return;

      let text = member.response;

      // 1. Remove URLs
      // Matches http/https URLs until a space or common end-of-sentence punctuation
      text = text.replace(/https?:\/\/[^\s\]\)]+/g, '');

      // 2. Remove standard bracket citations like [1], [1, 2], [1-3]
      // Regex looks for brackets containing numbers, commas, dashes
      text = text.replace(/\[\s*\d+(?:[\s,-]+\d+)*\s*\]/g, '');

      // 3. Remove ChatGPT style citations like 【13:0†source】
      text = text.replace(/【.*?】/g, '');

      // 4. Cleanup double spaces created by removals
      text = text.replace(/  +/g, ' ');
      text = text.trim();

      if (text !== member.response) {
        updateMemberResponse(member.id, text);
        changeCount++;
      }
    });

    setCleanStatus('done');
    setTimeout(() => setCleanStatus('idle'), 2000);
  };

  const filledCount = councilMembers.filter(m => m.response.trim().length > 0).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Utility Bar */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-4 z-10 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="bg-blue-600 text-xs px-2 py-1 rounded-full">Step 2</span>
            Consult the Council
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Copy the prompt below and paste it into external AI tools (Grok, Perplexity, Gemini, etc.).
          </p>
        </div>
        <button
          onClick={handleCopyPrompt}
          className="flex-shrink-0 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium border border-slate-600 transition-all flex items-center gap-2"
        >
          {copySuccess ? (
            <span className="text-green-400 font-bold">{copySuccess}</span>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              Copy Prompt
            </>
          )}
        </button>
      </div>

      {/* Image Reference for Manual Drag/Drop if needed */}
      {imageBase64 && (
        <div className="bg-slate-900/50 p-4 rounded-lg border border-dashed border-slate-700 flex items-center gap-4">
          <div className="w-16 h-16 flex-shrink-0 bg-slate-800 rounded overflow-hidden">
             {/* Simple preview for reference */}
             <style>{`
                 img[alt="ref"] {
                   content: url(data:image/png;base64,${imageBase64});
                 }
               `}</style>
             <img src={`data:image/png;base64,${imageBase64}`} className="w-full h-full object-cover" alt="ref" />
          </div>
          <div className="text-sm text-slate-400">
            <span className="text-white font-semibold">Image Attached.</span> You may need to manually drag/drop your image into the other AI tools alongside the text prompt.
          </div>
        </div>
      )}

      {/* Council Inputs */}
      <div className="flex flex-col gap-6">
        {councilMembers.map((member) => (
          <div key={member.id} className={`${member.color} bg-opacity-20 border border-slate-700 rounded-xl p-4 transition-all hover:border-slate-500`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-200">{member.name}</h3>
              {member.response.length > 0 && (
                <span className="text-green-400 text-xs flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Collected
                </span>
              )}
            </div>
            <textarea
              value={member.response}
              onChange={(e) => updateMemberResponse(member.id, e.target.value)}
              placeholder={`Paste output from ${member.name} here...`}
              className="w-full h-40 bg-black/30 border border-slate-600 rounded-lg p-3 text-sm text-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-slate-700">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white px-4 py-2 font-medium transition-colors"
        >
          Back
        </button>
        
        <div className="flex gap-3">
          <button
            onClick={handleCutCitations}
            disabled={cleanStatus !== 'idle'}
            className="bg-amber-700/50 hover:bg-amber-600 text-amber-100 border border-amber-600/50 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 hover:shadow-lg hover:shadow-amber-900/20"
          >
            {cleanStatus === 'done' ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Cleaned
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm8.486-8.486a5 5 0 010 7.072 5 5 0 01-7.072 0 5 5 0 010-7.072z" /></svg>
                Cut Citations
              </>
            )}
          </button>

          <button
            onClick={onNext}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
          >
            Export Responses
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};