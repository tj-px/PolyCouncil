import React, { useState } from 'react';
import { StepInput } from './components/StepInput';
import { StepCollect } from './components/StepCollect';
import { StepAnalysis } from './components/StepAnalysis';
import { AppState, INITIAL_COUNCIL_MEMBERS } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'INPUT',
    question: '',
    imageBase64: null,
    imageMimeType: null,
    councilMembers: INITIAL_COUNCIL_MEMBERS,
  });

  const setQuestion = (question: string) => {
    setState(prev => ({ ...prev, question }));
  };

  const setImage = (base64: string | null, mimeType: string | null) => {
    setState(prev => ({ ...prev, imageBase64: base64, imageMimeType: mimeType }));
  };

  const updateMemberResponse = (id: string, response: string) => {
    setState(prev => ({
      ...prev,
      councilMembers: prev.councilMembers.map(m => 
        m.id === id ? { ...m, response } : m
      )
    }));
  };

  const handleNextToExport = () => {
    setState(prev => ({ ...prev, step: 'EXPORT' }));
  };

  const handleReset = () => {
    setState({
      step: 'INPUT',
      question: '',
      imageBase64: null,
      imageMimeType: null,
      councilMembers: INITIAL_COUNCIL_MEMBERS.map(m => ({...m, response: ''})),
    });
  };

  const handleLoadPrompt = (questionText: string) => {
    setState({
      step: 'INPUT',
      question: questionText,
      imageBase64: null,
      imageMimeType: null,
      councilMembers: INITIAL_COUNCIL_MEMBERS.map(m => ({...m, response: ''})),
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-purple-900 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2 tracking-tight">
            PolyCouncil
          </h1>
          <p className="text-slate-500 text-sm tracking-widest uppercase">Offline Analysis Workbench</p>
        </header>

        {/* Progress Bar */}
        <div className="mb-8 flex justify-between items-center max-w-2xl mx-auto relative">
           <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 rounded"></div>
           <div 
             className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 rounded transition-all duration-500"
             style={{ width: state.step === 'INPUT' ? '0%' : state.step === 'COLLECT' ? '50%' : '100%' }}
           ></div>

           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${state.step === 'INPUT' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>1</div>
           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${state.step === 'COLLECT' ? 'bg-blue-600 text-white' : state.step === 'EXPORT' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>2</div>
           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${state.step === 'EXPORT' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>3</div>
        </div>

        {/* Main Content Area */}
        <main>
          {state.step === 'INPUT' && (
            <StepInput 
              question={state.question}
              setQuestion={setQuestion}
              imageBase64={state.imageBase64}
              setImage={setImage}
              onNext={() => setState(prev => ({ ...prev, step: 'COLLECT' }))}
            />
          )}

          {state.step === 'COLLECT' && (
            <StepCollect
              question={state.question}
              imageBase64={state.imageBase64}
              councilMembers={state.councilMembers}
              updateMemberResponse={updateMemberResponse}
              onBack={() => setState(prev => ({ ...prev, step: 'INPUT' }))}
              onNext={handleNextToExport}
            />
          )}

          {state.step === 'EXPORT' && (
            <StepAnalysis 
              councilMembers={state.councilMembers}
              onBack={() => setState(prev => ({ ...prev, step: 'COLLECT' }))}
              onReset={handleReset}
              onLoadPrompt={handleLoadPrompt}
            />
          )}
        </main>

        <footer className="mt-20 text-center text-slate-700 text-xs">
          <p>PolyCouncil Offline Mode</p>
        </footer>
      </div>
    </div>
  );
};

export default App;