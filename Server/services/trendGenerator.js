const DEFAULT_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2';
const DEFAULT_ENDPOINT = 'https://router.huggingface.co/hf-inference';
const MAX_ITEMS = Number(process.env.TREND_MAX_ITEMS || 150);
const MAX_COMMENTS_PER_POST = Number(process.env.TREND_MAX_COMMENTS || 3);
const MOMENTUM_VALUES = new Set(['rising', 'stable', 'cooling']);

const toMomentum = (value) => {
  if (typeof value !== 'string') {
    return 'stable';
  }
  const normalized = value.trim().toLowerCase();
  return MOMENTUM_VALUES.has(normalized) ? normalized : 'stable';
};

const extractJson = (text) => {
  if (typeof text !== 'string') {
    return null;
  }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }
  try {
    const parsed = JSON.parse(text.slice(start, end + 1));
    return parsed;
  } catch (_error) {
    return null;
  }
};

const buildPrompt = (documents, windowStart, windowEnd) => {
  const header = `You are a social media analyst. Review the recent activity and extract up to five trending topics.
Return strict JSON with the following structure:
{
  "trends": [
    {
      "topic": string (<=3 words, no leading '#'),
      "summary": string,
      "postIds": ["post-id"],
      "momentum": "rising" | "stable" | "cooling"
    }
  ]
}
If there is no meaningful trend, respond with {"trends": []}.
Avoid inventing content.
`;

  const metadata = `Window start: ${windowStart.toISOString()}
Window end: ${windowEnd.toISOString()}`;

  const body = documents
    .map((item, index) => {
      const comments = (item.comments || [])
        .slice(0, MAX_COMMENTS_PER_POST)
        .map((comment) => `      - Comment: ${comment}`)
        .join('\n');
      return `Post #${index + 1}
    id: ${item.id}
    text: ${item.text}
    likes: ${item.likes}
    shares: ${item.shares}
${comments ? `${comments}\n` : ''}`;
    })
    .join('\n');

  return `${header}\n${metadata}\n\n${body}`.trim();
};

const normalizeTrends = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return [];
  }
  const trends = Array.isArray(payload.trends) ? payload.trends : [];
  return trends
    .map((trend) => {
      if (!trend || typeof trend !== 'object') {
        return null;
      }
      const topic = (trend.topic || trend.name || '').toString().trim();
      if (!topic) {
        return null;
      }
      const summary = (trend.summary || trend.description || '').toString().trim();
      const postIds = Array.isArray(trend.postIds)
        ? trend.postIds.map((value) => (value ? value.toString() : null)).filter(Boolean)
        : [];
      const momentum = toMomentum(trend.momentum);
      return {
        topic,
        summary,
        postIds,
        momentum,
        score: typeof trend.score === 'number' ? trend.score : 0,
      };
    })
    .filter(Boolean);
};

const callInference = async ({ token, model, prompt, parameters }) => {
  const baseUrl = (process.env.HF_INFERENCE_URL || DEFAULT_ENDPOINT).replace(/\/$/, '');
  const payload = JSON.stringify({ inputs: prompt, parameters, model });
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const candidates = [
    `${baseUrl}/models/${encodeURIComponent(model)}`,
    `${baseUrl}/v1/text-generation?model=${encodeURIComponent(model)}`,
    `${baseUrl}/text-generation?model=${encodeURIComponent(model)}`,
  ];

  let lastError = null;

  for (const url of candidates) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...headers,
          'x-wait-for-model': 'true',
        },
        body: payload,
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`HF inference error ${response.status}: ${message}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return response.json();
      }
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (_error) {
        return text;
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Unable to call Hugging Face inference endpoint');
};

const generateTrends = async ({ documents, windowStart, windowEnd }) => {
  const token = process.env.HF_TOKEN;
  if (!token) {
    return null;
  }
  console.log('token', token);
  const model = process.env.HF_TREND_MODEL || DEFAULT_MODEL;
  console.log('model', model);
  const limitedDocuments = Array.isArray(documents) ? documents.slice(0, MAX_ITEMS) : [];
  if (limitedDocuments.length === 0) {
    return [];
  }
  console.log('limitedDocuments', limitedDocuments);
  const prompt = buildPrompt(limitedDocuments, windowStart, windowEnd);
  console.log('prompt', prompt);
  try {
    const raw = await callInference({
      token,
      model,
      prompt,
      parameters: {
        max_new_tokens: Number(process.env.TREND_MAX_TOKENS || 800),
        temperature: Number(process.env.TREND_TEMPERATURE || 0.5),
        return_full_text: false,
      },
    });
    console.log('raw', raw);
    let completion = '';
    if (typeof raw === 'string') {
      completion = raw;
    } else if (Array.isArray(raw)) {
      completion = raw[0]?.generated_text || '';
    } else if (raw?.generated_text) {
      completion = raw.generated_text;
    }
    const json = extractJson(completion);
    const normalized = normalizeTrends(json);
    return normalized;
  } catch (error) {
    console.error('Trend generation failed', error.message || error);
    return null;
  }
};

module.exports = { generateTrends };
