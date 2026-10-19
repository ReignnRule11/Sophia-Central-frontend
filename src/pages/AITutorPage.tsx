import { useState } from 'react';
import { BrainCircuit, SendHorizonal } from 'lucide-react';
import { OverviewCard, SectionTitle } from '../components/layout/AppShell';
import { sophiaApi } from '../api/sophiaApi';

export function AITutorPage() {
  const [question, setQuestion] = useState('How should I revise for my digital logic exam in the next 48 hours?');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    setIsLoading(true);
    setAnswer('');

    try {
      const response = await sophiaApi.ai.ask({
        question,
        resourceId: 'res-1',
      });

      setAnswer(response.answer || 'Here is the study plan: 1) Review key definitions, 2) Solve 10 past questions, 3) Revisit weak topics with lecture notes and diagrams.');
    } catch {
      setAnswer('Here is a practical study plan: review the key topics, solve 10 past questions, and revisit logic gates and truth tables before your next revision block.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="AI tutor" title="Ask Sophia" />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <OverviewCard title="Study support" action="Always on">
          <div className="space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="mb-1 flex items-center gap-2 text-violet-200">
                <BrainCircuit size={16} />
                <span>Suggested prompts</span>
              </div>
              <ul className="mt-3 space-y-2 text-slate-300">
                <li>• Summarize this chapter in 5 key points.</li>
                <li>• Give me a 48-hour revision plan.</li>
                <li>• Explain why this concept is important for exams.</li>
              </ul>
            </div>
          </div>
        </OverviewCard>

        <div className="glass-panel p-5">
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">Your question</span>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="min-h-28 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-violet-400"
            />
          </label>

          <button
            onClick={handleAsk}
            disabled={isLoading}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SendHorizonal size={16} />
            {isLoading ? 'Thinking...' : 'Ask Sophia'}
          </button>

          {answer ? (
            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm leading-7 text-slate-200">
              {answer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
