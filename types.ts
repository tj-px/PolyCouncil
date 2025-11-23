export interface CouncilMember {
  id: string;
  name: string;
  response: string;
  color: string;
}

export interface SavedPrompt {
  id: string;
  name: string;
  text: string;
  timestamp: number;
}

export interface AppState {
  step: 'INPUT' | 'COLLECT' | 'EXPORT';
  question: string;
  imageBase64: string | null;
  imageMimeType: string | null;
  councilMembers: CouncilMember[];
}

export const INITIAL_COUNCIL_MEMBERS: CouncilMember[] = [
  { id: '1', name: 'Grok', response: '', color: 'bg-slate-800' },
  { id: '2', name: 'Perplexity', response: '', color: 'bg-teal-900' },
  { id: '3', name: 'Gemini', response: '', color: 'bg-blue-900' },
  { id: '4', name: 'Claude', response: '', color: 'bg-amber-900' },
  { id: '5', name: 'ChatGPT', response: '', color: 'bg-emerald-900' },
];