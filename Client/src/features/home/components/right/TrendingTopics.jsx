import { useEffect, useState } from 'react';

import { getLatestTrends } from '../../api/TrendRequests';
import { trendingTopics as fallbackTopics } from '../../data/trendingTopics';

const normalize = (topics) => {
  if (!Array.isArray(topics) || topics.length === 0) {
    return fallbackTopics.map((topic) => ({
      topic: topic.name,
      summary: `${topic.shares} shares` || '',
      momentum: 'stable',
    }));
  }
  return topics.map((item) => ({
    topic: item.topic || item.name || 'Trending',
    summary: item.summary || '',
    momentum: item.momentum || 'stable',
  }));
};

const TrendingTopics = ({ className = '' }) => {
  const [topics, setTopics] = useState(normalize(fallbackTopics));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await getLatestTrends();
        if (cancelled) {
          return;
        }
        setTopics(normalize(response?.topics));
      } catch {
        if (!cancelled) {
          setTopics(normalize(fallbackTopics));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-[var(--color-text-base)] shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[var(--color-text-base)]">Trends for you</h2>
        {loading && <span className="text-xs text-[var(--color-text-muted)]">Loading…</span>}
      </div>
      <div className="flex flex-col gap-4">
        {topics.map((topic) => (
          <div key={topic.topic} className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[var(--color-text-base)]">#{topic.topic}</span>
            {topic.summary && <span className="text-xs text-[var(--color-text-muted)]">{topic.summary}</span>}
            <span className="text-[10px] uppercase text-[var(--color-text-muted)]">
              {topic.momentum}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics;


