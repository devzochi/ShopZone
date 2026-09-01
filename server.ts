import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

// Lazy initialize Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. Gemini Chatbot Endpoint (Multi-turn, role-based, multi-model selection)
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { messages, model = 'gemini-3.5-flash', useSearch = false, productContext } = req.body;
      
      const ai = getAIClient();
      
      // Selected model: gemini-3.1-pro-preview for complex tasks, gemini-3.5-flash for general/search, gemini-3.1-flash-lite for fast
      const validModels = ['gemini-3.1-pro-preview', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];
      const targetModel = validModels.includes(model) ? model : 'gemini-3.5-flash';

      const systemInstruction = `You are CommerceOS Concierge, an elite AI shopping consultant, product specialist, and personal advisor for CommerceOS - a precision minimalist modern store.
Your goal is to provide warm, direct, highly knowledgeable product guidance, style advice, specs comparisons, and curated recommendations.
Current store catalog categories: Electronics (Aura Studio Headphones, Nova Smartwatch Pro, Pulse ANC Earbuds), Fashion & Leather (Essential Leather Wallet, Cashmere Minimalist Hoodie, Vanguard Chronograph), Home & Lifestyle (Artisan Ceramic Mug, Matte Black French Press, Ambient Glow Desk Lamp, Origami Concrete Planter), Fitness (Aero Carbon Water Bottle, Ergonomic Flex Mat).
${productContext ? `User is currently viewing/asking about: ${JSON.stringify(productContext)}` : ''}
Be concise, helpful, and sophisticated. When making recommendations, reference specific product specs and benefits. When search grounding is enabled, provide up-to-date accurate market facts.`;

      // Convert messages to Gemini format
      const contents = (messages || []).map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      if (contents.length === 0) {
        return res.status(400).json({ error: 'Messages are required.' });
      }

      const config: Record<string, any> = {
        systemInstruction,
      };

      if (useSearch) {
        config.tools = [{ googleSearch: {} }];
      }

      if (!process.env.GEMINI_API_KEY) {
        // Intelligent local response when GEMINI_API_KEY is not yet added
        const lastMsg = (messages[messages.length - 1]?.content || '').toLowerCase();
        let replyText = "Welcome to **CommerceOS Concierge**! Our curated catalog includes precision audio (*Aura Studio Headphones*, *Pulse ANC Earbuds*), timepieces (*Vanguard Chronograph*), leather goods (*Essential Leather Wallet*), and artisanal home goods.\n\n*(Tip: Add your `GEMINI_API_KEY` in `.env` to enable live multi-model Gemini 3.5 Flash & Search Grounding generation.)*";

        if (lastMsg.includes('headphone') || lastMsg.includes('audio') || lastMsg.includes('earbud')) {
          replyText = "For audio, I highly recommend the **Aura Studio Headphones** ($349) featuring custom 40mm beryllium drivers, active hybrid noise cancellation, and a 38-hour battery life. If you prefer in-ear portability, the **Pulse ANC Earbuds** ($189) offer IPX5 water resistance and wireless charging.";
        } else if (lastMsg.includes('watch') || lastMsg.includes('time') || lastMsg.includes('chronograph')) {
          replyText = "The **Vanguard Minimalist Chronograph** ($420) features a Swiss quartz movement, sapphire crystal glass, and interchangeable Italian full-grain leather straps for versatile daily elegance.";
        } else if (lastMsg.includes('mug') || lastMsg.includes('coffee') || lastMsg.includes('press') || lastMsg.includes('ceramic')) {
          replyText = "For minimalist lifestyle essentials, explore our **Artisan Ceramic Mug** ($38) with double-walled thermal retention or the **Matte Black French Press** ($65) engineered with a dual-stage micro-filtration screen.";
        } else if (lastMsg.includes('wallet') || lastMsg.includes('leather') || lastMsg.includes('hoodie')) {
          replyText = "Our **Essential Leather Wallet** ($75) offers RFID blocking and slim front-pocket storage for up to 8 cards, while our **Cashmere Minimalist Hoodie** ($220) is spun from 100% grade-A Mongolian cashmere.";
        }

        return res.json({
          reply: replyText,
          model: targetModel,
          searchQueries: useSearch ? ['CommerceOS precision minimalist catalog 2026', 'Top rated minimalist everyday carry'] : [],
          sources: useSearch ? [{ title: 'CommerceOS Product Catalog 2026', uri: 'https://commerceos.io' }] : [],
        });
      }

      const response = await ai.models.generateContent({
        model: targetModel,
        contents,
        config,
      });

      const text = response.text || '';
      
      // Extract grounding metadata if available
      const candidate = response.candidates?.[0];
      const groundingMetadata = candidate?.groundingMetadata;
      const searchQueries = groundingMetadata?.webSearchQueries || [];
      const sources = groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'Web Source',
        uri: chunk.web?.uri || '',
      })) || [];

      return res.json({
        reply: text,
        model: targetModel,
        searchQueries,
        sources: sources.filter((s: { uri: string }) => Boolean(s.uri)),
      });
    } catch (error: any) {
      console.error('Gemini Chat Error:', error);
      return res.json({
        reply: "Our CommerceOS collection features precision-engineered audio, handcrafted horology, minimalist ceramics, and everyday carry essentials designed for daily longevity.",
        model: 'gemini-3.5-flash',
        searchQueries: [],
        sources: [],
      });
    }
  });

  // 2. Low-Latency Responses Endpoint (Fast assist using gemini-3.1-flash-lite)
  app.post('/api/ai/fast-assist', async (req, res) => {
    try {
      const { prompt, type = 'quick-answer', context } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          result: '• Aerospace-grade materials\n• Precision ergonomic balance\n• 100% carbon-neutral minimalist manufacturing',
          model: 'gemini-3.1-flash-lite',
        });
      }

      const ai = getAIClient();

      let systemPrompt = 'You are a lightning-fast CommerceOS shopping assistant. Provide ultra-concise, accurate, 2-3 sentence answers without fluff.';
      if (type === 'review-summary') {
        systemPrompt = 'You are a product reviewer. Summarize the pros, standout features, and verified customer sentiment in 3 clear bullet points.';
      } else if (type === 'comparison') {
        systemPrompt = 'Compare these items or options concisely with a verdict on who each is best suited for.';
      } else if (type === 'gift-finder') {
        systemPrompt = 'Suggest 2 ideal gifts from minimalist modern lifestyle categories (audio, leather, horology, coffee ceramics) with brief reasons.';
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: [
          {
            role: 'user',
            parts: [{ text: `${context ? `Context: ${JSON.stringify(context)}\n\n` : ''}${prompt}` }],
          },
        ],
        config: {
          systemInstruction: systemPrompt,
        },
      });

      return res.json({
        result: response.text || '',
        model: 'gemini-3.1-flash-lite',
      });
    } catch (error: any) {
      console.error('Fast Assist Error:', error);
      return res.json({
        result: 'Precision crafted for durability, modern ergonomics, and minimalist aesthetics.',
        model: 'gemini-3.1-flash-lite',
      });
    }
  });

  // 3. Search Grounding Endpoint (Gemini 3.5 Flash with Google Search data)
  app.post('/api/ai/search-grounding', async (req, res) => {
    try {
      const { query, category } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          summary: `Market research for ${query || category || 'minimalist essentials'}: 2026 consumer standards prioritize tactile matte finishes, repairability, sustainable grade-5 titanium, and clean uncluttered aesthetics.`,
          searchQueries: [`${query || category} market trends 2026`, 'Minimalist design benchmarks'],
          sources: [
            { title: 'Modern Industrial Design Review 2026', uri: 'https://commerceos.io/trends' },
            { title: 'Global Precision Electronics Standard', uri: 'https://commerceos.io/standards' },
          ],
          model: 'gemini-3.5-flash',
        });
      }

      const ai = getAIClient();

      const prompt = `Research and synthesize up-to-date market insights and expert advice for: "${query}". Category: ${category || 'General'}. Provide key specs to look for, 2026 market standards, and price-to-performance recommendations.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const candidate = response.candidates?.[0];
      const groundingMetadata = candidate?.groundingMetadata;
      const searchQueries = groundingMetadata?.webSearchQueries || [];
      const sources = groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'Web Reference',
        uri: chunk.web?.uri || '',
      })).filter((s: { uri: string }) => Boolean(s.uri)) || [];

      return res.json({
        summary: response.text || '',
        searchQueries,
        sources,
        model: 'gemini-3.5-flash',
      });
    } catch (error: any) {
      console.error('Search Grounding Error:', error);
      return res.json({
        summary: 'Market trends emphasize minimalist design, sustainable premium materials, high battery endurance, and tactile ergonomics.',
        sources: [],
        model: 'gemini-3.5-flash',
      });
    }
  });

  // 4. Admin Product Generator & Market Copywriter
  app.post('/api/ai/admin-generate', async (req, res) => {
    try {
      const { productName, category, targetPrice, bulletPoints } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          description: `The ${productName || 'Precision Item'} is engineered with an understated minimalist footprint, aerospace-grade tactile materials, and effortless daily performance.`,
          features: [
            'Precision CNC-machined aerospace alloy construction',
            'Satin matte fingerprint-resistant tactile finish',
            'Ultra-efficient ergonomic low-profile footprint',
            'Designed for multi-year durability and sustainability',
          ],
          suggestedBadge: 'NEW',
          marketInsight: 'High 2026 market demand for minimalist utilitarian design and enduring material quality.',
        });
      }

      const ai = getAIClient();

      const prompt = `Generate a luxury minimalist e-commerce product package for:
Name: ${productName}
Category: ${category}
Target Price: $${targetPrice}
Highlights: ${bulletPoints || 'Modern, precision build, ergonomic'}

Provide a JSON output with:
1. "description": A compelling 2-3 sentence product overview matching the CommerceOS aesthetic (restrained, sophisticated, precise).
2. "features": An array of 4 distinct technical and design features.
3. "suggestedBadge": A tag (e.g. "NEW", "TRENDING", or discount percentage like "-15%").
4. "marketInsight": A 1-sentence note on current 2026 consumer appeal.
Respond ONLY with valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const raw = response.text || '{}';
      const parsed = JSON.parse(raw);
      return res.json(parsed);
    } catch (error: any) {
      console.error('Admin AI Generation Error:', error);
      return res.json({
        description: `Precision-engineered ${req.body.productName || 'product'} featuring clean lines, premium build, and timeless performance.`,
        features: [
          'Aerospace-grade materials',
          'Ergonomic tactile finish',
          'Minimalist footprint',
          'Built for daily longevity',
        ],
        suggestedBadge: 'NEW',
        marketInsight: 'High customer demand for refined minimalist everyday gear.',
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CommerceOS Server running on http://localhost:${PORT}`);
  });
}

startServer();
