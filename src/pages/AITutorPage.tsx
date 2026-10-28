import { useState } from 'react';
import { BrainCircuit, SendHorizonal, Sparkles } from 'lucide-react';
import { OverviewCard, SectionTitle } from '../components/layout/AppShell';
import { sophiaApi } from '../api/sophiaApi';

const suggestedPrompts = [
  'Summarize this chapter in 5 key points.',
  'Give me a 48-hour revision plan.',
  'Explain this concept in simple terms.',
];

export function AITutorPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [pointsRemaining, setPointsRemaining] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) return;
    setIsLoading(true); setAnswer(''); setError('');
    try {
      const response = await sophiaApi.ai.ask({ question: trimmedQuestion, sessionId });
      setAnswer(response.answer);
      if (response.sessionId) setSessionId(response.sessionId);
      if (typeof response.balanceRemaining === 'number') setPointsRemaining(response.balanceRemaining);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to get a response from Sophia AI. Please try again.');
    } finally { setIsLoading(false); }
  };

  return <div className="space-y-6">
    <SectionTitle eyebrow="AI tutor" title="Ask Sophia" />
    <section className="rounded-3xl bg-[#2C36D9] p-5 text-white shadow-[0_18px_45px_rgba(44,54,217,0.18)] sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-white/80"><Sparkles size={16} /><span className="text-xs font-semibold uppercase tracking-[0.2em]">AI study support</span></div><h2 className="mt-2 text-2xl font-semibold">Study smarter with Sophia</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/85">Ask questions, build revision plans, clarify difficult concepts, and use your Sophia study context more effectively.</p></div>{typeof pointsRemaining === 'number' && <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">{pointsRemaining} Wisdom Points left</span>}</div></section>

    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <OverviewCard title="Suggested prompts" action="Try one">
        <div className="space-y-3"><div className="flex items-center gap-2 text-sm font-semibold text-[#6121D0]"><BrainCircuit size={16} /> Study support</div>{suggestedPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => setQuestion(prompt)} className="w-full rounded-xl border border-[#DCE4EF] bg-white p-3 text-left text-sm leading-5 text-[#091F5B] transition hover:border-[#6121D0] hover:bg-[#FCF9FF]">{prompt}</button>)}</div>
      </OverviewCard>

      <div className="rounded-3xl border border-[#DCE4EF] bg-white p-5 shadow-sm sm:p-6">
        <label className="block text-sm font-medium text-[#091F5B]"><span className="mb-2 block">Your question</span><textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask Sophia a study question..." className="brand-input min-h-36 w-full resize-y" /></label>
        {error && <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-800">{error}</div>}
        <button type="button" onClick={() => void handleAsk()} disabled={isLoading || !question.trim()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#6121D0] px-4 py-2.5 font-semibold text-white transition hover:bg-[#2C36D9] disabled:cursor-not-allowed disabled:opacity-50"><SendHorizonal size={16} />{isLoading ? 'Thinking…' : 'Ask Sophia'}</button>
        {answer && <div role="status" aria-live="polite" className="mt-5 rounded-2xl border border-[#E1D3F5] bg-[#FCF9FF] p-5"><div className="text-xs font-bold uppercase tracking-[0.18em] text-[#6121D0]">Sophia’s answer</div><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#091F5B]">{answer}</p></div>}
      </div>
    </div>
  </div>;
}
