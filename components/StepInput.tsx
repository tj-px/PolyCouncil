import React, { useCallback, useState, useEffect } from 'react';
import { SavedPrompt } from '../types';

interface StepInputProps {
  question: string;
  setQuestion: (q: string) => void;
  setImage: (base64: string | null, mimeType: string | null) => void;
  imageBase64: string | null;
  onNext: () => void;
}

export const StepInput: React.FC<StepInputProps> = ({ 
  question, 
  setQuestion, 
  setImage, 
  imageBase64, 
  onNext 
}) => {
  const [promptName, setPromptName] = useState('');
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

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const matches = result.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          setImage(matches[2], matches[1]);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [setImage]);

  const handleClearImage = () => {
    setImage(null, null);
  };

  const handleSavePrompt = () => {
    if (!question.trim() || !promptName.trim()) return;
    
    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      name: promptName.trim(),
      text: question,
      timestamp: Date.now()
    };
    
    const newPrompts = [newPrompt, ...savedPrompts];
    setSavedPrompts(newPrompts);
    localStorage.setItem('poly_saved_prompts', JSON.stringify(newPrompts));
    setPromptName('');
  };

  const handleLoadPrompt = (prompt: SavedPrompt) => {
    setQuestion(prompt.text);
  };

  const handleDeletePrompt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPrompts = savedPrompts.filter(p => p.id !== id);
    setSavedPrompts(newPrompts);
    localStorage.setItem('poly_saved_prompts', JSON.stringify(newPrompts));
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

  return (
    <div className="space-y-6 animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
               <span className="bg-blue-600 text-xs px-2 py-1 rounded-full">Step 1</span>
               Prompt Disperser
             </h2>
             <button 
                onClick={() => handleCopyPrompt(question, 'main')}
                disabled={!question}
                className={`text-xs flex items-center gap-1 transition-colors px-2 py-1 rounded border ${copyFeedback === 'main' ? 'bg-green-900/30 border-green-700 text-green-400' : 'bg-slate-700 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-600'}`}
             >
                {copyFeedback === 'main' ? (
                   <>
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                     Copied
                   </>
                ) : (
                   <>
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                     Copy Text
                   </>
                )}
             </button>
          </div>
          
          <div className="mb-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none text-base leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2 mb-8">
             <input
               type="text"
               value={promptName}
               onChange={(e) => setPromptName(e.target.value)}
               placeholder="Name to save prompt..."
               className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-600"
             />
             <button
               onClick={handleSavePrompt}
               disabled={!question.trim() || !promptName.trim()}
               className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-600"
             >
               Save
             </button>
          </div>

          <div className="mb-4">
            {!imageBase64 ? (
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:bg-slate-750 hover:border-slate-500 transition-all relative group cursor-pointer bg-slate-900/30">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-slate-500 group-hover:text-slate-300 transition-colors">
                  <svg className="w-8 h-8 mx-auto mb-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="text-sm font-medium">Click or paste to upload reference image (Optional)</p>
                </div>
              </div>
            ) : (
              <div className="relative inline-block group">
                 <style>{`
                 img[alt="Upload preview"] {
                   content: url(data:image/png;base64,${imageBase64});
                 }
               `}</style>
                <img 
                  src={`data:image/jpeg;base64,${imageBase64}`}
                  className="max-h-48 rounded-lg border border-slate-600 shadow-md"
                  alt="Upload preview" 
                />
                <button 
                  onClick={handleClearImage}
                  className="absolute -top-2 -right-2 bg-slate-800 border border-slate-600 hover:bg-red-900 text-slate-300 hover:text-white p-1 rounded-full shadow-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={onNext}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40"
            >
              Next Step
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 h-full max-h-[600px] flex flex-col">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Saved Library</h3>
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {savedPrompts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-60 min-h-[200px]">
                    <p className="text-sm font-medium">Library is empty</p>
                </div>
            ) : (
              savedPrompts.map(prompt => (
                <div 
                  key={prompt.id}
                  onClick={() => handleLoadPrompt(prompt)}
                  className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-lg p-3 cursor-pointer group transition-all relative"
                >
                  <div className="pr-14">
                    <h4 className="font-bold text-slate-200 text-sm truncate group-hover:text-blue-400">{prompt.name}</h4>
                    <p className="text-slate-500 text-xs truncate mt-1 opacity-70 group-hover:opacity-100">{prompt.text}</p>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1">
                      {/* Copy Button */}
                      <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopyPrompt(prompt.text, prompt.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                        title="Copy Prompt"
                      >
                         {copyFeedback === prompt.id ? (
                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                         ) : (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                         )}
                      </button>

                      {/* Delete Button */}
                      <button 
                        onClick={(e) => handleDeletePrompt(prompt.id, e)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
                        title="Delete prompt"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
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