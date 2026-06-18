import { getDailyQuote } from "@/lib/quotes";

export default function QuoteWidget() {
  const quote = getDailyQuote();

  return (
    <div className="card bg-indigo-50 border border-indigo-100">
      <p className="widget-label text-indigo-400">Daily Inspiration</p>
      <blockquote className="mt-2">
        <p className="text-gray-800 text-base leading-relaxed italic">
          &ldquo;{quote.text}&rdquo;
        </p>
        <footer className="mt-3 text-sm font-medium text-indigo-500">
          — {quote.author}
        </footer>
      </blockquote>
    </div>
  );
}
