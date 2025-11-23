import React, { useState, useEffect } from 'react';
import { CouncilMember, SavedPrompt } from '../types';

interface StepExportProps {
  councilMembers: CouncilMember[];
  onBack: () => void;
  onReset: () => void;
  onLoadPrompt: (question: string) => void;
}

export const StepAnalysis: React.FC<StepExportProps> = ({
  councilMembers,
  onBack,
  onReset,
}) => {
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('poly_saved_prompts');
    if (saved) {
      try {
        setSavedPrompts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load prompts", e);
      }
    }
  }, []);
  
  const handleDownloadReport = () => {
    const filledMembers = councilMembers.filter(m => m.response.trim().length > 0);
    const date = new Date().toLocaleString();
    
    let content = `POLYCOUNCIL ANONYMIZED DOSSIER\nGenerated: ${date}\n=====================================\n\n`;
    
    if (filledMembers.length === 0) {
      content += `[No responses collected]\n`;
    } else {
      filledMembers.forEach((member, index) => {
          // Convert index 0 -> 'A', 1 -> 'B', etc.
          const analystLabel = String.fromCharCode(65 + index); // 65 is ASCII for 'A'
          
          content += `ANALYST ${analystLabel}\n-------------------------------------\n`;
          content += `${member.response}\n\n`;
          content += `=====================================\n\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `PolyCouncil_Anonymized_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyPrompt = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(id);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const filledCount = councilMembers.filter(m => m.response.trim().length > 0).length;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pt-8 pb-20 px-4">
       
       {/* Main Export Card */}
       <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl text-center space-y-8 relative overflow-hidden mb-16">
          
          {/* Decorative background element */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          <div className="space-y-4 relative z-10">
             <div className="w-24 h-24 bg-purple-900/30 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </div>
             
             <h2 className="text-3xl font-bold text-white tracking-tight">Ready for Assessment</h2>
             <p className="text-slate-400 text-lg">
               <span className="text-white font-bold">{filledCount}</span> analyst responses have been aggregated.
             </p>
          </div>

          <div className="p-8 bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
             <p className="text-slate-300 mb-8 leading-relaxed text-base">
               To reduce bias, the generated dossier anonymizes all sources (Analyst A, Analyst B, etc.). 
               The original prompt is excluded to focus purely on the provided intelligence.
             </p>
             
             <button 
                onClick={handleDownloadReport}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-purple-900/20 flex items-center justify-center gap-3 transition-all transform hover:scale-105 hover:shadow-purple-900/40"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Download Anonymized Dossier
            </button>
          </div>

          <div className="flex justify-center gap-6 pt-6 border-t border-slate-700/50">
             <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 hover:text-white px-4 py-2 text-sm font-medium transition-colors group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Collection
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-2 text-slate-500 hover:text-red-400 px-4 py-2 text-sm font-medium transition-colors group"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Start New Inquiry
            </button>
          </div>
       </div>

       {/* Prompt Library View */}
       <div className="border-t border-slate-800 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
             <h3 className="text-2xl font-bold text-slate-200 flex items-center gap-2">
               <span className="bg-slate-800 p-2 rounded-lg text-blue-500 border border-slate-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
               </span>
               Saved Prompt Library
             </h3>
             <p className="text-slate-500 text-sm">Access your previously saved prompts.</p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {savedPrompts.length === 0 ? (
                   <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-600 opacity-60">
                      <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>
                      <p className="text-sm font-medium">Library is empty</p>
                   </div>
                ) : (
                   savedPrompts.map(prompt => (
                      <div key={prompt.id} className="bg-slate-900 p-4 rounded-lg border border-slate-800 hover:border-slate-600 transition-all shadow-sm flex flex-col">
                         <div className="flex justify-between items-start mb-3">
                            <div className="overflow-hidden">
                               <h5 className="font-bold text-slate-200 text-sm truncate" title={prompt.name}>{prompt.name}</h5>
                               <span className="text-[10px] text-slate-600">{new Date(prompt.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div className="flex-shrink-0 ml-2">
                               <button 
                                 onClick={() => handleCopyPrompt(prompt.text, prompt.id)}
                                 className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-2 border ${copyFeedback === prompt.id ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                               >
                                  {copyFeedback === prompt.id ? (
                                     <>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Copied
                                     </>
                                  ) : (
                                     <>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                        Copy
                                     </>
                                  )}
                               </button>
                            </div>
                         </div>
                         
                         <div className="bg-slate-950/50 p-3 rounded border border-slate-800/50 text-xs text-slate-400 font-mono line-clamp-3 flex-grow">
                            {prompt.text}
                         </div>
                      </div>
                   ))
                )}
             </div>
          </div>
       </div>
    </div>
  );
};