import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper: Resilient Gemini API caller with automatic exponential retry and model fallback chain
async function callGeminiWithFallback(params: {
  contents: any;
  config?: any;
  preferredModel?: string;
  maxAttemptsPerModel?: number;
}): Promise<{ text: string; modelUsed: string }> {
  const modelsToTry = [
    params.preferredModel || 'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ];

  let lastError: any = null;

  for (const model of modelsToTry) {
    const attempts = params.maxAttemptsPerModel || 2;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        console.log(`[Gemini Engine] Calling ${model} (attempt ${attempt}/${attempts})...`);
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });

        const text = response.text;
        if (text && text.trim().length > 0) {
          console.log(`[Gemini Engine] Success with ${model}`);
          return { text, modelUsed: model };
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const is503OrHighDemand =
          errMsg.includes('503') ||
          errMsg.includes('high demand') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('temporarily') ||
          errMsg.includes('429') ||
          errMsg.includes('RESOURCE_EXHAUSTED');

        console.warn(`[Gemini Engine] ${model} attempt ${attempt} failed: ${errMsg}`);

        if (is503OrHighDemand) {
          // Pause with backoff before retry or switching model
          await new Promise((r) => setTimeout(r, 600 * attempt));
        } else {
          // Non-transient error, move to next model
          break;
        }
      }
    }
  }

  throw lastError || new Error('Todos os modelos de IA estão temporariamente indisponíveis.');
}

// Helper: Pedagogical Fallback Generator when upstream AI suffers severe 503 service outages
function generateSmartPedagogicalFallback(params: {
  topic: string;
  rawNotes?: string;
  targetAudience: string;
  pageCount: number;
  artStyle: string;
  mentorName: string;
  mentorDesc?: string;
  learnerName: string;
  learnerDesc?: string;
  tone?: string;
}) {
  const {
    topic,
    targetAudience,
    pageCount,
    artStyle,
    mentorName,
    learnerName,
  } = params;

  const pages = [];
  const chapters = [
    {
      title: `Fundamentos & O Grande Desafio de ${topic.slice(0, 30)}`,
      p1: `Apresentação panorâmica do conceito de ${topic}. O especialista introduz a motivação central.`,
      p2: `Metáfora do mundo real explicando a mecânica básica de ${topic}.`,
      p3: `Aprofundamento com diagrama esquemático e primeiro detalhe técnico.`,
    },
    {
      title: `Mecânica Interna & O Funcionamento Detalhado`,
      p1: `Visão em corte (cutaway) detalhando as engrenagens e fluxo de dados de ${topic}.`,
      p2: `O aprendiz questiona um caso especial ou dúvida comum sobre o processo.`,
      p3: `Comparação prática entre a abordagem recomendada e os erros típicos.`,
      p4: `Síntese intermediária conectando teoria à aplicação prática.`,
    },
    {
      title: `Aplicações do Mundo Real & Síntese Conceitual`,
      p1: `Cenário de aplicação real em escala global demonstrando a relevância de ${topic}.`,
      p2: `O aprendiz conecta todos os pontos e expressa a compreensão alcançada.`,
      p3: `Quadro de síntese com checklist pedagógico dos 4 pilares dominados.`,
    },
  ];

  for (let p = 1; p <= pageCount; p++) {
    const chapter = chapters[(p - 1) % chapters.length];
    const isHero = p % 2 !== 0;

    pages.push({
      page_number: p,
      layout_type: isHero ? 'hero_top_two_bottom' : 'grid_4_uniform',
      page_summary: `Capítulo ${p}: ${chapter.title}`,
      panels: [
        {
          panel_index: 1,
          visual_prompt: `${artStyle} style, wide-angle cinematic pedagogical illustration of ${topic}. ${mentorName} guides ${learnerName} through an expansive high-tech concept laboratory, volumetric lighting, clear focus, no text.`,
          camera_angle: 'wide-angle',
          narration_box: `CAPÍTULO ${p} • Para dominar ${topic}, precisamos primeiro compreender o problema essencial que essa disciplina resolve.`,
          bubbles: [
            {
              character_id: 'char_mentor',
              type: 'speech',
              text: `${learnerName}, quando olhamos para ${topic}, o maior segredo é focar na arquitetura fundamental antes dos detalhes!`,
              position_anchor: 'top-left',
            },
            {
              character_id: 'char_learner',
              type: 'speech',
              text: `Entendi, ${mentorName}! Então é como decompor um sistema complexo em etapas menores e testáveis?`,
              position_anchor: 'top-right',
            },
          ],
        },
        {
          panel_index: 2,
          visual_prompt: `${artStyle} style, close-up isometric diagrammatic view of the core mechanics of ${topic}. Floating holographic schematic nodes, crisp lineart, no text.`,
          camera_angle: 'isometric',
          narration_box: `CONCEITO CHAVE • A interação entre os componentes segue regras estritas de causa e efeito.`,
          bubbles: [
            {
              character_id: 'char_mentor',
              type: 'speech',
              text: `Exatamente! Observe como cada módulo tem uma responsabilidade única e bem definida.`,
              position_anchor: 'top-left',
            },
            {
              character_id: 'char_learner',
              type: 'thought',
              text: `Isso elimina a complexidade e torna tudo rastreável!`,
              position_anchor: 'bottom-right',
            },
          ],
        },
        {
          panel_index: 3,
          visual_prompt: `${artStyle} style, medium-shot of ${mentorName} e ${learnerName} analisando os resultados em um terminal interativo com gráficos luminosos, no text.`,
          camera_angle: 'medium-shot',
          narration_box: `SÍNTESE DIDÁTICA • A teoria ganha vida quando aplicada à resolução de problemas reais do cotidiano.`,
          bubbles: [
            {
              character_id: 'char_learner',
              type: 'shout',
              text: `Agora todas as peças do quebra-cabeça se encaixaram perfeitamente!`,
              position_anchor: 'top-left',
            },
            {
              character_id: 'char_mentor',
              type: 'speech',
              text: `Excelente trabalho! O domínio de ${topic} começa com a curiosidade e se consolida com a prática.`,
              position_anchor: 'bottom-right',
            },
          ],
        },
      ],
    });
  }

  return {
    book_metadata: {
      title: `${topic}: A Jornada Ilustrada`,
      topic,
      target_audience: targetAudience,
      art_style: artStyle,
      characters: [
        {
          id: 'char_mentor',
          name: mentorName,
          role: 'mentor',
          visual_description: params.mentorDesc || 'Especialista acolhedor com olhar perspicaz e postura didática.',
          avatar_color: '#2563EB',
        },
        {
          id: 'char_learner',
          name: learnerName,
          role: 'learner',
          visual_description: params.learnerDesc || 'Estudante curioso e expressivo sempre pronto para perguntar.',
          avatar_color: '#F59E0B',
        },
      ],
      tone: params.tone || 'socratic',
      created_at: new Date().toISOString().split('T')[0],
      is_fallback: true,
    },
    pages,
  };
}

// Endpoint: Generate full pedagogical comic storyboard
app.post('/api/generate-storyboard', async (req: Request, res: Response) => {
  try {
    const {
      topic,
      raw_notes,
      target_audience = 'beginner',
      page_count = 3,
      art_style = 'clean_vector_bd',
      mentor_name = 'Dr. Byte',
      mentor_desc,
      learner_name = 'Leo',
      learner_desc,
      tone = 'socratic',
    } = req.body;

    if (!topic || typeof topic !== 'string') {
      res.status(400).json({ error: 'O tema do estudo é obrigatório.' });
      return;
    }

    const pagesRequested = Math.min(Math.max(parseInt(String(page_count), 10) || 2, 1), 5);

    const systemPrompt = `Você é o "ComicDocs AI Engine", especialista em transposição didática e roteirização sequencial de histórias em quadrinhos pedagógicas (Graphic Novels & Webtoons educativos).
Sua missão é transformar o tema fornecido em uma apostila sequencial ilustrada de alto impacto pedagógico com ${pagesRequested} páginas.

Diretrizes Pedagógicas:
1. Condução por Dupla: O Mentor didático (${mentor_name}) e o Aprendiz curioso (${learner_name}) conduzem a explicação através de perguntas autênticas, metáforas visuais memoráveis e analogias do cotidiano.
2. Cada página deve ter entre 3 e 4 painéis com progressão clara de conceitos (Introdução do conceito -> Metáfora/Diagrama -> Aprofundamento -> Conclusão/Síntese).
3. Balões curtos, diretos e expressivos. Evite blocos de texto maçantes dentro dos balões. Use a caixa de narração (narration_box) para a síntese teórica formal e os balões (bubbles) para o diálogo vivo.
4. Os visual_prompts devem ser detalhados, especificando composição, iluminação, ângulo de câmera e metáforas visuais.`;

    const userPrompt = `Gere o Storyboard completo no formato JSON para o tema:
TEMA: "${topic}"
PÚBLICO-ALVO: ${target_audience}
ESTILO ARTÍSTICO: ${art_style}
TOM: ${tone}
NÚMERO DE PÁGINAS: ${pagesRequested}
${raw_notes ? `NOTAS/CONTEÚDO ADICIONAL:\n${raw_notes}` : ''}
PERSONAGEM MENTOR: ${mentor_name} (${mentor_desc || 'Especialista acolhedor e entusiasta'})
PERSONAGEM APRENDIZ: ${learner_name} (${learner_desc || 'Estudante curioso e expressivo'})

Retorne estritamente o JSON estruturado conforme o schema.`;

    const storyboardSchema = {
      type: Type.OBJECT,
      properties: {
        book_metadata: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Título marcante da apostila em HQ' },
            topic: { type: Type.STRING },
            target_audience: { type: Type.STRING, enum: ['beginner', 'intermediate', 'advanced'] },
            art_style: {
              type: Type.STRING,
              description: 'Identificador do estilo visual escolhido (ex: cartoon, hand_drawn, doodle, cartoon_educacional, scientific_illustration, futuristic_digital, infografico_moderno, minimalista, three_d_educacional, realista, livro_didatico, colorido_infantil, modern_manga, anime_cinematic, clean_vector_bd, etc.)',
            },
            tone: { type: Type.STRING },
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  role: { type: Type.STRING, enum: ['mentor', 'learner'] },
                  visual_description: { type: Type.STRING },
                  avatar_color: { type: Type.STRING },
                },
                required: ['id', 'name', 'role', 'visual_description'],
              },
            },
          },
          required: ['title', 'topic', 'target_audience', 'art_style', 'characters'],
        },
        pages: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              page_number: { type: Type.INTEGER },
              layout_type: {
                type: Type.STRING,
                enum: ['grid_4_uniform', 'hero_top_two_bottom', 'dynamic_action_5', 'two_vertical_split'],
              },
              page_summary: { type: Type.STRING, description: 'Resumo didático do capítulo ou página' },
              panels: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    panel_index: { type: Type.INTEGER },
                    visual_prompt: { type: Type.STRING, description: 'Prompt de difusão rico para ilustração' },
                    camera_angle: {
                      type: Type.STRING,
                      enum: ['close-up', 'wide-angle', 'isometric', 'bird-eye', 'medium-shot'],
                    },
                    narration_box: { type: Type.STRING, description: 'Texto explicativo no topo ou rodapé do painel' },
                    bubbles: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          character_id: { type: Type.STRING },
                          type: { type: Type.STRING, enum: ['speech', 'thought', 'shout'] },
                          text: { type: Type.STRING },
                          position_anchor: {
                            type: Type.STRING,
                            enum: [
                              'top-left',
                              'top-right',
                              'bottom-left',
                              'bottom-right',
                              'bottom-center',
                              'center-left',
                              'center-right',
                            ],
                          },
                        },
                        required: ['character_id', 'type', 'text', 'position_anchor'],
                      },
                    },
                  },
                  required: ['panel_index', 'visual_prompt', 'camera_angle', 'narration_box', 'bubbles'],
                },
              },
            },
            required: ['page_number', 'layout_type', 'panels'],
          },
        },
      },
      required: ['book_metadata', 'pages'],
    };

    let parsedJson: any = null;

    try {
      const { text, modelUsed } = await callGeminiWithFallback({
        preferredModel: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
          responseMimeType: 'application/json',
          responseSchema: storyboardSchema,
        },
      });

      parsedJson = JSON.parse(text);
      console.log(`[Storyboard] Generated successfully via Gemini model: ${modelUsed}`);
    } catch (apiErr: any) {
      console.warn(
        '[Storyboard] All Gemini models experiencing temporary high demand (503/429). Activating smart pedagogical fallback generator:',
        apiErr?.message
      );
      parsedJson = generateSmartPedagogicalFallback({
        topic,
        rawNotes: raw_notes,
        targetAudience: target_audience,
        pageCount: pagesRequested,
        artStyle: art_style,
        mentorName: mentor_name,
        mentorDesc: mentor_desc,
        learnerName: learner_name,
        learnerDesc: learner_desc,
        tone,
      });
    }

    res.json(parsedJson);
  } catch (err: any) {
    console.error('Error in /api/generate-storyboard:', err);
    res.status(500).json({
      error: 'Falha interna ao processar a geração.',
      details: err?.message || String(err),
    });
  }
});

// Endpoint: Regenerate single panel prompt and dialogue
app.post('/api/regenerate-panel', async (req: Request, res: Response) => {
  try {
    const { topic, art_style, panel_index, current_panel, characters } = req.body;

    const prompt = `Você está aprimorando um painel específico de uma história em quadrinhos pedagógica sobre "${topic}".
Estilo: ${art_style}
Painel atual:
- Visual Prompt: ${current_panel?.visual_prompt || ''}
- Narração: ${current_panel?.narration_box || ''}
- Diálogos atuais: ${JSON.stringify(current_panel?.bubbles || [])}
Personagens: ${JSON.stringify(characters || [])}

Gere uma versão aprimorada e mais marcante pedagogicamente para este painel, com uma metáfora visual mais forte e diálogos mais dinâmicos.`;

    let panelJson: any = null;

    try {
      const { text } = await callGeminiWithFallback({
        preferredModel: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              panel_index: { type: Type.INTEGER },
              visual_prompt: { type: Type.STRING },
              camera_angle: {
                type: Type.STRING,
                enum: ['close-up', 'wide-angle', 'isometric', 'bird-eye', 'medium-shot'],
              },
              narration_box: { type: Type.STRING },
              bubbles: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    character_id: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['speech', 'thought', 'shout'] },
                    text: { type: Type.STRING },
                    position_anchor: {
                      type: Type.STRING,
                      enum: [
                        'top-left',
                        'top-right',
                        'bottom-left',
                        'bottom-right',
                        'bottom-center',
                        'center-left',
                        'center-right',
                      ],
                    },
                  },
                  required: ['character_id', 'type', 'text', 'position_anchor'],
                },
              },
            },
            required: ['panel_index', 'visual_prompt', 'camera_angle', 'narration_box', 'bubbles'],
          },
        },
      });

      panelJson = JSON.parse(text || '{}');
    } catch (err: any) {
      console.warn('[Regenerate Panel] Fallback engaged due to upstream demand spike:', err?.message);
      panelJson = {
        panel_index: panel_index || 1,
        visual_prompt: `${art_style} style, ${
          current_panel?.camera_angle === 'isometric' ? 'wide-angle' : 'isometric'
        } view illustrating ${topic}. Focused concept lighting, sharp composition, no text.`,
        camera_angle: current_panel?.camera_angle === 'isometric' ? 'wide-angle' : 'isometric',
        narration_box:
          current_panel?.narration_box ||
          `CONCEITO REFINADO • Observe o fluxo estruturado de causa e efeito em ${topic}.`,
        bubbles: current_panel?.bubbles?.length
          ? current_panel.bubbles
          : [
              {
                character_id: characters?.[0]?.id || 'char_mentor',
                type: 'speech',
                text: 'Analisando sob esta nova perspectiva, a lógica se torna evidente e imediata!',
                position_anchor: 'top-left',
              },
            ],
      };
    }

    res.json(panelJson);
  } catch (err: any) {
    console.error('Error in /api/regenerate-panel:', err);
    res.status(500).json({
      error: 'Falha ao regenerar o painel.',
      details: err?.message || String(err),
    });
  }
});

// Endpoint: Generate panel image via Gemini image model (Nano Banana 2.1 & Flash Lite Image)
app.post('/api/generate-panel-image', async (req: Request, res: Response) => {
  try {
    const { prompt, art_style, aspect_ratio = '1:1', image_size = '1K' } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'O prompt visual é obrigatório.' });
      return;
    }

    const fullPrompt = `${prompt}, comic book illustration style: ${art_style || 'graphic novel'}, high detail graphic novel art, sharp ink lines, clean composition, educational storyboard panel, no text in image`;

    const validAspectRatio = aspect_ratio === '16:9' ? '16:9' : aspect_ratio === '4:3' ? '4:3' : aspect_ratio === '3:4' ? '3:4' : '1:1';
    let imageUrl: string | null = null;
    let modelUsed = 'gemini-nano-banana-2.1';

    // 1. Try gemini-nano-banana-2.1 first
    try {
      const bananaResponse = await ai.models.generateContent({
        model: 'gemini-nano-banana-2.1',
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: validAspectRatio as any,
            imageSize: (image_size === '2K' ? '2K' : '1K') as any,
          },
        },
      });

      const parts = bananaResponse.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }
    } catch (bananaErr: any) {
      const isQuota = String(bananaErr?.message || '').includes('429') || String(bananaErr?.message || '').includes('RESOURCE_EXHAUSTED');
      console.log(`[Panel Image] gemini-nano-banana-2.1 ${isQuota ? 'quota 429' : 'unavailable'}, trying fallback...`);
    }

    // 2. Fallback to gemini-3.1-flash-lite-image if needed
    if (!imageUrl) {
      try {
        modelUsed = 'gemini-3.1-flash-lite-image';
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: fullPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: validAspectRatio as any,
            },
          },
        });

        const parts = imageResponse.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      } catch (flashErr: any) {
        const isQuota = String(flashErr?.message || '').includes('429') || String(flashErr?.message || '').includes('RESOURCE_EXHAUSTED');
        console.log(`[Panel Image] gemini-3.1-flash-lite-image ${isQuota ? 'quota 429' : 'unavailable'}, fallback to procedural vector.`);
      }
    }

    // 3. Fallback to styled procedural illustration if models are unavailable or quota reached
    if (!imageUrl) {
      modelUsed = 'procedural_vector_engine';
      imageUrl = createProceduralSvgScene({
        prompt,
        artStyle: art_style || 'graphic_novel',
        aspectRatio: validAspectRatio,
        cameraAngle: 'close-up',
      });
    }

    res.json({ success: true, imageUrl, modelUsed });
  } catch (err: any) {
    console.log('[Panel Image] Fallback engaged, returning stylized vector panel illustration.');
    const validAspectRatio = (req.body?.aspect_ratio === '16:9' ? '16:9' : '1:1') as any;
    const fallbackUrl = createProceduralSvgScene({
      prompt: req.body?.prompt || 'Cena didática de quadrinho',
      artStyle: req.body?.art_style || 'graphic_novel',
      aspectRatio: validAspectRatio,
      cameraAngle: 'wide-angle',
    });
    res.status(200).json({
      success: true,
      imageUrl: fallbackUrl,
      modelUsed: 'procedural_vector_engine',
    });
  }
});

// Endpoint: AI service to suggest optimized diffusion visual prompts based on topic & art style
app.post('/api/suggest-visual-prompts', async (req: Request, res: Response) => {
  try {
    const {
      topic,
      art_style = 'clean_vector_bd',
      characters = [],
      count = 4,
      custom_idea = '',
      target_audience = 'beginner',
    } = req.body;

    if (!topic || typeof topic !== 'string') {
      res.status(400).json({ error: 'O tema de estudo é obrigatório.' });
      return;
    }

    const promptCount = Math.min(Math.max(parseInt(String(count), 10) || 4, 1), 6);

    const systemPrompt = `Você é um Engenheiro de Prompts Sênior para Modelos de Difusão de Imagem (Flux.1 Dev, Midjourney v6, SDXL e Imagen 3), especializado em Graphic Novels Pedagógicas e Ilustrações de Conceitos Científicos/Técnicos.
Sua missão é sugerir exatamente ${promptCount} descrições visuais ('visual_prompt') de alto impacto pedagógico e estético para o tema fornecido.

Regras de Prompt Engineering para Difusão:
1. NÃO inclua texto ou palavras literais desenhadas no prompt (ex: "no text, no speech bubbles, typography-free"), pois o texto será sobreposto vetorialmente depois em SVG.
2. Defina composição clara, iluminação atmosférica (ex: volumetric rim light, soft studio ambient, dramatic rim glow), ângulo de câmera intencional e profundidade de campo.
3. Reserve deliberadamente "espaço negativo" em um dos quadrantes (ex: céu limpo, parede com gradiente suave) para os balões de fala repousarem sem cobrir o ponto focal.
4. Inclua âncoras de consistência estilística de acordo com o estilo selecionado (${art_style}).
5. Crie metáforas visuais pedagógicas memoráveis (ex: analogias do mundo real, mapas em corte, dioramas isométricos, cutaway schematics).`;

    const userPrompt = `TEMA: "${topic}"
ESTILO ARTÍSTICO: "${art_style}"
PÚBLICO-ALVO: "${target_audience}"
${custom_idea ? `IDEIA/CONCEITO ESPECÍFICO DO USUÁRIO: "${custom_idea}"` : ''}
${characters.length > 0 ? `PERSONAGENS DISPONÍVEIS: ${JSON.stringify(characters)}` : ''}

Gere ${promptCount} sugestões de prompts visuais otimizados para difusão no formato JSON estruturado.`;

    const suggestSchema = {
      type: Type.OBJECT,
      properties: {
        topic: { type: Type.STRING },
        art_style: { type: Type.STRING },
        suggestions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Título curto da cena ou metáfora' },
              pedagogical_concept: { type: Type.STRING, description: 'Conceito didático ilustrado' },
              visual_prompt: {
                type: Type.STRING,
                description: 'Descrição rica para modelo de difusão (Flux/Midjourney) com câmera, luz e sujeito',
              },
              style_anchor_prompt: { type: Type.STRING, description: 'Tags imutáveis de estilo artístico' },
              camera_angle: {
                type: Type.STRING,
                enum: ['close-up', 'wide-angle', 'isometric', 'bird-eye', 'medium-shot'],
              },
              negative_space_tip: {
                type: Type.STRING,
                description: 'Instrução de onde posicionar os balões sem atrapalhar a arte',
              },
              flux_tags: { type: Type.STRING, description: 'Tags de qualidade e renderização' },
            },
            required: [
              'title',
              'pedagogical_concept',
              'visual_prompt',
              'style_anchor_prompt',
              'camera_angle',
              'negative_space_tip',
            ],
          },
        },
      },
      required: ['topic', 'art_style', 'suggestions'],
    };

    let parsedJson: any = null;

    try {
      const { text } = await callGeminiWithFallback({
        preferredModel: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.8,
          responseMimeType: 'application/json',
          responseSchema: suggestSchema,
        },
      });

      parsedJson = JSON.parse(text || '{}');
    } catch (err: any) {
      console.warn('[Suggest Visual Prompts] Fallback engaged due to upstream 503 load:', err?.message);
      parsedJson = {
        topic,
        art_style,
        suggestions: [
          {
            title: `Metáfora Panorâmica: O Ecossistema de ${topic.slice(0, 24)}`,
            pedagogical_concept: `Visão geral do ambiente e dos fluxos operacionais de ${topic}`,
            visual_prompt: `${art_style} style, wide-angle cinematic concept laboratory illustrating ${topic}. Expansive workspace with glowing schematic holographic projections, volumetric rim lighting, sharp ink contours, clean focal depth, no text`,
            style_anchor_prompt: `${art_style} graphic novel art, high detail lineart, cinematic lighting, no text`,
            camera_angle: 'wide-angle',
            negative_space_tip: 'Amplo espaço negativo no canto superior esquerdo para balões de fala.',
          },
          {
            title: `Diorama Isométrico dos Módulos`,
            pedagogical_concept: `Arquitetura modular e interconexão de ${topic}`,
            visual_prompt: `${art_style} style, isometric cutaway schematic diorama of ${topic}. Interconnected glowing nodes, crisp lineart, modular layout, vibrant color accents, volumetric lighting, no text`,
            style_anchor_prompt: `${art_style} illustration, sharp technical lines, vibrant palette, no text`,
            camera_angle: 'isometric',
            negative_space_tip: 'Espaço limpo no topo e canto superior direito para caixa de narração.',
          },
          {
            title: `Close-up de Ação & Interação Direta`,
            pedagogical_concept: `Execução prática e resposta imediata em ${topic}`,
            visual_prompt: `${art_style} style, medium close-up of interactive digital terminal visualizing ${topic}. Sparkling energy sparks, expressive character reaction, glowing holographic touch screen, no text`,
            style_anchor_prompt: `${art_style} aesthetic, high detail, sharp composition, no text`,
            camera_angle: 'close-up',
            negative_space_tip: 'Espaço reservado na lateral inferior esquerda.',
          },
        ],
      };
    }

    res.json(parsedJson);
  } catch (err: any) {
    console.error('Error in /api/suggest-visual-prompts:', err);
    res.status(500).json({
      error: 'Falha ao sugerir prompts visuais para modelos de difusão.',
      details: err?.message || String(err),
    });
  }
});

// Endpoint: Optimize a specific visual prompt for diffusion
app.post('/api/optimize-visual-prompt', async (req: Request, res: Response) => {
  try {
    const { current_prompt, topic, art_style, camera_angle } = req.body;

    if (!current_prompt) {
      res.status(400).json({ error: 'O prompt atual é obrigatório.' });
      return;
    }

    const systemPrompt = `Você é um Especialista em Prompt Crafting para Modelos de Difusão (Flux.1 / Midjourney v6 / SDXL / Imagen 3).
Sua tarefa é transformar uma descrição visual básica em um prompt de difusão cinematográfico e altamente detalhado, preservando o conceito didático original e adaptando-o ao estilo artístico especificado (${art_style}).
Garanta que não haja texto no prompt gerado e que haja espaço para balões de quadrinhos.`;

    let parsed: any = null;

    try {
      const { text } = await callGeminiWithFallback({
        preferredModel: 'gemini-3.8-flash',
        contents: `TEMA: ${topic || 'Estudo geral'}
ESTILO: ${art_style || 'clean_vector_bd'}
ÂNGULO DESEJADO: ${camera_angle || 'wide-angle'}
PROMPT ATUAL DO USUÁRIO: "${current_prompt}"

Otimize este prompt para máxima fidelidade visual em geradores de difusão.`,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              optimized_prompt: { type: Type.STRING },
              style_anchor_prompt: { type: Type.STRING },
              recommended_camera: {
                type: Type.STRING,
                enum: ['close-up', 'wide-angle', 'isometric', 'bird-eye', 'medium-shot'],
              },
              negative_space_tip: { type: Type.STRING },
              improvements_summary: { type: Type.STRING },
            },
            required: ['optimized_prompt', 'style_anchor_prompt', 'recommended_camera', 'improvements_summary'],
          },
        },
      });

      parsed = JSON.parse(text || '{}');
    } catch (err: any) {
      console.warn('[Optimize Prompt] Fallback engaged due to upstream 503 load:', err?.message);
      parsed = {
        optimized_prompt: `${art_style} style, ${camera_angle || 'wide-angle'} cinematic composition: ${current_prompt}. Volumetric rim lighting, sharp ink contours, rich depth of field, clear focal hierarchy, atmospheric background, no text, no speech bubbles`,
        style_anchor_prompt: `${art_style} aesthetic, high detail graphic novel art, sharp linework, no text`,
        recommended_camera: camera_angle || 'wide-angle',
        negative_space_tip: 'Espaço negativo reservado nos cantos superiores para inserção de balões tipográficos.',
        improvements_summary: 'Injeção de iluminação volumétrica, enquadramento cinematográfico, âncoras de consistência e garantia de zero texto embutido na difusão.',
      };
    }

    res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/optimize-visual-prompt:', err);
    res.status(500).json({
      error: 'Falha ao otimizar o prompt visual.',
      details: err?.message || String(err),
    });
  }
});

// Helper: Generate elegant procedural SVG graphic scene for single image fallback
function createProceduralSvgScene(params: {
  prompt: string;
  artStyle: string;
  aspectRatio: string;
  cameraAngle: string;
}): string {
  const { prompt, artStyle, aspectRatio, cameraAngle } = params;

  let width = 800;
  let height = 800;
  if (aspectRatio === '3:4') {
    width = 600;
    height = 800;
  } else if (aspectRatio === '4:3') {
    width = 800;
    height = 600;
  } else if (aspectRatio === '16:9') {
    width = 960;
    height = 540;
  } else if (aspectRatio === '9:16') {
    width = 540;
    height = 960;
  }

  // Theme colors based on artStyle
  const isDark = !artStyle.includes('watercolor') && !artStyle.includes('livro_didatico');
  const bg1 = isDark ? '#080D1A' : '#F8FAFC';
  const bg2 = isDark ? '#020617' : '#E2E8F0';
  const accent = '#06B6D4';
  const secondary = '#F59E0B';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#475569';

  const cleanPrompt = prompt.slice(0, 70).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const styleLabel = artStyle.replace(/_/g, ' ').toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg1}" />
      <stop offset="100%" stop-color="${bg2}" />
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="${secondary}" stop-opacity="0.05" />
    </linearGradient>
    <radialGradient id="sunGlow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.25" />
      <stop offset="100%" stop-color="transparent" />
    </radialGradient>
    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${accent}" stroke-width="0.5" stroke-opacity="0.12" />
    </pattern>
  </defs>

  <!-- Background Canvas -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
  <rect width="${width}" height="${height}" fill="url(#gridPattern)" />
  <rect width="${width}" height="${height}" fill="url(#sunGlow)" />

  <!-- Compositional Decorative Frame -->
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" rx="16" fill="none" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.3" stroke-dasharray="8 4" />

  <!-- Thematic Illustration Elements (Abstract Scientific / Geometric Diagram) -->
  <g transform="translate(${width / 2}, ${height * 0.42})">
    <!-- Glowing concentric orbits -->
    <circle r="140" fill="none" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.2" />
    <circle r="100" fill="none" stroke="${secondary}" stroke-width="2" stroke-opacity="0.3" stroke-dasharray="6 6" />
    <circle r="60" fill="url(#glowGrad)" stroke="${accent}" stroke-width="2" />
    
    <!-- Central Icon: Atom / Spark / Light -->
    <circle r="24" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-width="2" />
    <circle r="8" fill="${secondary}" />
    
    <!-- Dynamic orbital nodes -->
    <circle cx="100" cy="0" r="7" fill="${accent}" />
    <circle cx="-70" cy="70" r="6" fill="${secondary}" />
    <circle cx="-50" cy="-86" r="5" fill="#38BDF8" />
    
    <!-- Radiating connection vectors -->
    <line x1="-120" y1="0" x2="120" y2="0" stroke="${accent}" stroke-width="1" stroke-opacity="0.2" />
    <line x1="0" y1="-120" x2="0" y2="120" stroke="${accent}" stroke-width="1" stroke-opacity="0.2" />
  </g>

  <!-- Bottom Visual Card with Prompt info -->
  <g transform="translate(${width * 0.08}, ${height * 0.72})">
    <rect width="${width * 0.84}" height="${height * 0.22}" rx="14" fill="#0A1122" fill-opacity="0.88" stroke="${accent}" stroke-width="1.2" stroke-opacity="0.4" />
    
    <!-- Badges -->
    <rect x="20" y="18" width="130" height="24" rx="6" fill="${accent}" fill-opacity="0.15" stroke="${accent}" stroke-width="1" />
    <text x="28" y="34" font-family="monospace" font-size="11" font-weight="bold" fill="${accent}">${styleLabel}</text>
    
    <rect x="160" y="18" width="110" height="24" rx="6" fill="${secondary}" fill-opacity="0.15" stroke="${secondary}" stroke-width="1" />
    <text x="168" y="34" font-family="monospace" font-size="11" font-weight="bold" fill="${secondary}">${cameraAngle.toUpperCase()}</text>

    <!-- Prompt title -->
    <text x="20" y="68" font-family="sans-serif" font-size="15" font-weight="bold" fill="${textColor}">${cleanPrompt}...</text>
    <text x="20" y="90" font-family="sans-serif" font-size="11" fill="${subtextColor}">ComicDocs AI • Ilustração Didática em Proporção ${aspectRatio}</text>
  </g>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Endpoint: Generate Single Unique Image according to user prompt
app.post('/api/generate-single-image', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      art_style = 'cartoon_educacional',
      aspect_ratio = '1:1',
      camera_angle = 'wide-angle',
      color_theme = 'default',
      character_name,
      speech_bubble,
      narration,
      engine = 'gemini-nano-banana-2.1',
      image_size = '1K',
    } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({ error: 'O prompt da imagem é obrigatório.' });
      return;
    }

    console.log(`[Single Image] Request received: "${prompt.slice(0, 50)}...", style: ${art_style}, ar: ${aspect_ratio}, engine: ${engine}`);

    // Map aspect ratio for Gemini/Flux
    const validAspectRatio = ['1:1', '3:4', '4:3', '16:9', '9:16'].includes(aspect_ratio)
      ? aspect_ratio
      : '1:1';

    // 1. Synthesize an enriched, professional image prompt with Gemini (fast race with fallback)
    let optimizedPrompt = `${art_style} style, ${camera_angle} pedagogical illustration: ${prompt.trim()}. Crisp lineart, volumetric lighting, rich composition, no text, no speech bubbles`;
    try {
      const enrichPromise = ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `PROMPT ORIGINAL: "${prompt}"
ESTILO ARTÍSTICO: ${art_style}
ENQUADRAMENTO: ${camera_angle}
PERSONAGEM: ${character_name || 'Nenhum'}

Gere um único prompt em inglês ultra detalhado para modelos de imagem (Nano Banana 2.1 / Flux.1 / Midjourney v6), mantendo o caráter didático e visual, sem incluir textos ou balões de fala embutidos na imagem. Retorne apenas o prompt textual final.`,
      });
      const enrichTimeout = new Promise<null>((r) => setTimeout(() => r(null), 2500));
      const enrichRes: any = await Promise.race([enrichPromise, enrichTimeout]);

      if (enrichRes?.text && enrichRes.text.trim()) {
        optimizedPrompt = enrichRes.text.trim().replace(/^["']|["']$/g, '');
      }
    } catch (enrichErr: any) {
      // Gentle prompt fallback without dumping raw errors
      console.log('[Single Image] Using direct prompt for image generation.');
    }

    // Prepare commands for external diffusion engines
    const midjourneyCommand = `/imagine prompt: ${optimizedPrompt} --ar ${validAspectRatio.replace(':', ':')} --v 6.0`;
    const fluxPrompt = `${optimizedPrompt}, flux dev, 8k resolution, masterpiece, trending on artstation`;

    // 2. Attempt real image generation with Nano Banana 2.1 or Flash Lite
    let imageUrl: string | null = null;
    let source: 'ai_generated' | 'svg_fallback' = 'ai_generated';
    let modelUsed: string = 'gemini-nano-banana-2.1';
    let quotaNotice: string | null = null;

    // Primary: Try gemini-nano-banana-2.1 first (or user selected engine)
    const primaryModel = engine === 'gemini-3.1-flash-lite-image' ? 'gemini-3.1-flash-lite-image' : 'gemini-nano-banana-2.1';
    
    try {
      const imageConfig: any = {
        aspectRatio: validAspectRatio as any,
      };
      if (primaryModel === 'gemini-nano-banana-2.1') {
        imageConfig.imageSize = image_size === '2K' ? '2K' : '1K';
      }

      const imgPromise = ai.models.generateContent({
        model: primaryModel,
        contents: {
          parts: [{ text: optimizedPrompt }],
        },
        config: {
          imageConfig,
        },
      });
      const imgTimeout = new Promise<null>((r) => setTimeout(() => r(null), 6000));
      const imageResponse: any = await Promise.race([imgPromise, imgTimeout]);

      if (imageResponse?.candidates?.[0]?.content?.parts) {
        for (const part of imageResponse.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
            modelUsed = primaryModel;
            break;
          }
        }
      }
    } catch (primaryErr: any) {
      const isQuota = String(primaryErr?.message || '').includes('429') || String(primaryErr?.message || '').includes('RESOURCE_EXHAUSTED');
      console.log(`[Single Image] ${primaryModel} ${isQuota ? 'quota 429' : 'unavailable'}, evaluating fallback...`);
      if (isQuota) {
        quotaNotice = 'Cota do plano gratuito para difusão direta excedida. Gerada arte vetorial estilizada para manter seu fluxo ativo.';
      }
    }

    // Fallback: If primary model didn't return image and it wasn't flash-lite, try flash-lite
    if (!imageUrl && primaryModel !== 'gemini-3.1-flash-lite-image') {
      try {
        const fallbackPromise = ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: optimizedPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: validAspectRatio as any,
            },
          },
        });
        const fallbackTimeout = new Promise<null>((r) => setTimeout(() => r(null), 5000));
        const fallbackRes: any = await Promise.race([fallbackPromise, fallbackTimeout]);

        if (fallbackRes?.candidates?.[0]?.content?.parts) {
          for (const part of fallbackRes.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              const mimeType = part.inlineData.mimeType || 'image/png';
              imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
              modelUsed = 'gemini-3.1-flash-lite-image';
              quotaNotice = null;
              break;
            }
          }
        }
      } catch (fallbackErr: any) {
        const isQuota = String(fallbackErr?.message || '').includes('429') || String(fallbackErr?.message || '').includes('RESOURCE_EXHAUSTED');
        console.log(`[Single Image] gemini-3.1-flash-lite-image ${isQuota ? 'quota 429' : 'unavailable'}, fallback to procedural vector.`);
      }
    }

    // 3. Fallback to procedural vector scene if diffusion models did not return image data
    if (!imageUrl) {
      source = 'svg_fallback';
      modelUsed = 'procedural_vector_engine';
      imageUrl = createProceduralSvgScene({
        prompt,
        artStyle: art_style,
        aspectRatio: validAspectRatio,
        cameraAngle: camera_angle,
      });
    }

    res.json({
      success: true,
      imageUrl,
      prompt,
      optimizedPrompt,
      artStyle: art_style,
      aspectRatio: validAspectRatio,
      cameraAngle: camera_angle,
      colorTheme: color_theme,
      midjourneyCommand,
      fluxPrompt,
      speechBubbleText: speech_bubble || undefined,
      narrationText: narration || undefined,
      source,
      modelUsed,
      quotaNotice,
      createdAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.log('[Single Image] Fallback engaged, generating procedural SVG scene.');
    const validAspectRatio = ['1:1', '3:4', '4:3', '16:9', '9:16'].includes(req.body?.aspect_ratio) ? req.body.aspect_ratio : '1:1';
    const fallbackUrl = createProceduralSvgScene({
      prompt: req.body?.prompt || 'Ilustração temática didática',
      artStyle: req.body?.art_style || 'cartoon_educacional',
      aspectRatio: validAspectRatio,
      cameraAngle: req.body?.camera_angle || 'wide-angle',
    });
    res.json({
      success: true,
      imageUrl: fallbackUrl,
      prompt: req.body?.prompt || '',
      optimizedPrompt: req.body?.prompt || '',
      artStyle: req.body?.art_style || 'cartoon_educacional',
      aspectRatio: validAspectRatio,
      cameraAngle: req.body?.camera_angle || 'wide-angle',
      colorTheme: req.body?.color_theme || 'default',
      midjourneyCommand: '',
      fluxPrompt: '',
      speechBubbleText: req.body?.speech_bubble || undefined,
      narrationText: req.body?.narration || undefined,
      source: 'svg_fallback',
      modelUsed: 'procedural_vector_engine',
      createdAt: new Date().toISOString(),
    });
  }
});

// Endpoint: Generate comprehensive Prompt da Apostila (Flux.1 / Midjourney v6 / SDXL / Imagen 3)
app.post('/api/generate-apostila-prompt', async (req: Request, res: Response) => {
  try {
    const {
      disciplina = '',
      assunto = '',
      publico = '',
      objetivo = '',
      nivel = 'Intermediário',
      tipoMaterial = 'Apostila didática',
      formato = 'Formato A4',
      art_style = 'livro_didatico',
      estilo_escrita = 'Didático',
      paleta_visual = 'Automática',
      color_theme = 'default',
      mentor = 'Dr. Byte',
      learner = 'Leo',
    } = req.body;

    if (!assunto) {
      res.status(400).json({ error: 'O assunto principal é obrigatório.' });
      return;
    }

    const systemPrompt = `Você é o "Gerador Apostila AI Prompt Master".
Sua função é gerar o pacote definitivo de Prompts de Imagem e Roteiro Visual para uma apostila pedagógica de alto nível.
Construa o prompt estruturado contendo:
1. Prompt da Capa (Cover Prompt)
2. Prompts Sequenciais dos Painéis Principais (com iluminação, enquadramento, ângulos de câmera, ausência de texto embutido na imagem)
3. Âncoras de Estilo Imutáveis (Style Anchors)
4. Dicas de Espaço Negativo para Balões e Tipografia
5. Parâmetros técnicos para Midjourney v6 e Flux.1 Dev.`;

    const userPrompt = `DISCIPLINA: ${disciplina}
ASSUNTO PRINCIPAL: ${assunto}
PÚBLICO / FAIXA ETÁRIA: ${publico}
OBJETIVO PEDAGÓGICO: ${objetivo}
NÍVEL DE PROFUNDIDADE: ${nivel}
TIPO DE MATERIAL: ${tipoMaterial}
FORMATO: ${formato}
ESTILO ARTÍSTICO VISUAL: ${art_style}
ESTILO DE ESCRITA: ${estilo_escrita}
PALETA VISUAL: ${paleta_visual}
TEMA DE CORES E FILTRO CSS: ${color_theme}
PERSONAGEM GUIA MENTOR: ${mentor}
PERSONAGEM GUIA APRENDIZ: ${learner}

Gere o pacote de prompts estruturado em JSON.`;

    let resultJson: any = null;

    try {
      const { text } = await callGeminiWithFallback({
        preferredModel: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              cover_prompt: { type: Type.STRING },
              style_anchor: { type: Type.STRING },
              aspect_ratio_recommendation: { type: Type.STRING },
              panels_prompts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    panel_number: { type: Type.INTEGER },
                    concept: { type: Type.STRING },
                    camera_angle: { type: Type.STRING },
                    prompt: { type: Type.STRING },
                    negative_space: { type: Type.STRING },
                  },
                  required: ['panel_number', 'concept', 'camera_angle', 'prompt'],
                },
              },
              midjourney_command: { type: Type.STRING },
              flux_tags: { type: Type.STRING },
              pedagogical_summary: { type: Type.STRING },
            },
            required: ['title', 'cover_prompt', 'style_anchor', 'panels_prompts', 'midjourney_command'],
          },
        },
      });

      resultJson = JSON.parse(text || '{}');
    } catch (err: any) {
      console.warn('[Generate Apostila Prompt] Fallback engaged due to upstream load:', err?.message);
      resultJson = {
        title: `Apostila Ilustrada: ${assunto}`,
        cover_prompt: `${art_style} style, heroic front cover illustration for didactic booklet on ${assunto}. ${mentor} and ${learner} exploring an expansive concept laboratory with glowing volumetric diagrams, rich depth of field, vibrant editorial colors, clean composition, no text --ar 3:4`,
        style_anchor: `${art_style} art style, crisp ink lineart, consistent character design, educational infographic clarity, no embedded text`,
        aspect_ratio_recommendation: formato.includes('A4') ? '3:4 (A4)' : '9:16 (Webtoon)',
        panels_prompts: [
          {
            panel_number: 1,
            concept: 'Apresentação Panorâmica do Conceito',
            camera_angle: 'wide-angle',
            prompt: `${art_style} style, wide-angle cinematic laboratory introducing ${assunto}. Glowing holographic schematic nodes, volumetric rim light, ${mentor} gesturing towards interactive visual board, no text`,
            negative_space: 'Amplo espaço no topo e canto superior esquerdo para caixas de texto.',
          },
          {
            panel_number: 2,
            concept: 'Mecânica Interna & Diagrama Isométrico',
            camera_angle: 'isometric',
            prompt: `${art_style} style, isometric cutaway schematic diorama of ${assunto}. Interconnected glowing nodes, crisp lineart, modular layout, volumetric lighting, no text`,
            negative_space: 'Espaço limpo no topo direito para balões de fala.',
          },
          {
            panel_number: 3,
            concept: 'Aplicação Prática e Fechamento',
            camera_angle: 'medium-shot',
            prompt: `${art_style} style, medium shot of ${mentor} and ${learner} smiling in front of a resolved visual puzzle of ${assunto}, warm ambient light, triumphant pedagogical mood, no text`,
            negative_space: 'Espaço inferior para síntese explicativa.',
          },
        ],
        midjourney_command: `/imagine prompt: ${art_style} style, educational graphic novel illustration of ${assunto}, volumetric lighting, clean ink contours, no text --ar 3:4 --v 6.0`,
        flux_tags: 'flux dev, 8k, graphic novel, clean lineart, educational illustration, masterpiece, no text',
        pedagogical_summary: `Estrutura voltada a ${publico} com foco em ${objetivo || 'ensino visual e progressivo'}.`,
      };
    }

    res.json(resultJson);
  } catch (err: any) {
    console.error('Error in /api/generate-apostila-prompt:', err);
    res.status(500).json({
      error: 'Falha ao gerar o prompt da apostila.',
      details: err?.message || String(err),
    });
  }
});

// Endpoint: Generate Didactic Activities & Exercises
app.post('/api/generate-activities', async (req: Request, res: Response) => {
  try {
    const { disciplina, assunto, publico, nivel } = req.body;

    const systemPrompt = `Você é um Criador Especialista em Atividades Pedagógicas e Exercícios de Fixação para Apostilas.
Gere 4 atividades ricas e desafiadoras (3 questões de múltipla escolha com 4 alternativas e gabarito comentado, e 1 atividade prática / desafio de pensamento visual).`;

    let activitiesJson: any = null;

    try {
      const { text } = await callGeminiWithFallback({
        preferredModel: 'gemini-3.8-flash',
        contents: `DISCIPLINA: ${disciplina || 'Geral'}
ASSUNTO: ${assunto || 'Tema de estudo'}
PÚBLICO: ${publico || 'Estudantes'}
NÍVEL: ${nivel || 'Intermediário'}

Gere as atividades em JSON estruturado com perguntas, alternativas, resposta correta e explicação pedagógica.`,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    type: { type: Type.STRING, enum: ['multiple_choice', 'practical_challenge'] },
                    title: { type: Type.STRING },
                    statement: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correct_answer_index: { type: Type.INTEGER },
                    pedagogical_explanation: { type: Type.STRING },
                  },
                  required: ['id', 'type', 'title', 'statement', 'pedagogical_explanation'],
                },
              },
            },
            required: ['topic', 'questions'],
          },
        },
      });

      activitiesJson = JSON.parse(text || '{}');
    } catch (err: any) {
      console.warn('[Activities] Fallback engaged due to upstream load:', err?.message);
      activitiesJson = {
        topic: assunto || 'Atividades Didáticas',
        questions: [
          {
            id: 1,
            type: 'multiple_choice',
            title: 'Fixação Conceitual',
            statement: `Qual é o objetivo principal ao analisar o tema "${assunto}" segundo a apostila ilustrada?`,
            options: [
              'Compreender a estrutura fundamental antes de se preocupar com minúcias decorativas.',
              'Apenas memorizar fórmulas sem aplicar a problemas do mundo real.',
              'Ignorar o papel dos componentes intermediários no sistema.',
              'Nenhuma das alternativas anteriores está correta.',
            ],
            correct_answer_index: 0,
            pedagogical_explanation: 'A compreensão arquitetural e dos princípios de base é o fundamento que permite resolver problemas complexos com autonomia.',
          },
          {
            id: 2,
            type: 'multiple_choice',
            title: 'Mecanismo de Causa e Efeito',
            statement: `Na mecânica de funcionamento de "${assunto}", como os componentes interagem de forma harmoniosa?`,
            options: [
              'Cada módulo opera de forma caótica sem comunicação padronizada.',
              'Através de regras estritas de entrada, processamento e saída com responsabilidade única.',
              'Apenas de forma síncrona com bloqueio total de recursos.',
              'Sem nenhuma verificação de integridade ou retorno.',
            ],
            correct_answer_index: 1,
            pedagogical_explanation: 'A modularidade garante que cada componente resolva uma tarefa isolada, facilitando depuração e escalabilidade.',
          },
          {
            id: 3,
            type: 'practical_challenge',
            title: 'Desafio Prático & Desenho Esquemático',
            statement: `Crie um mapa mental ou desenho esquemático em 3 blocos resumindo como ${assunto} funciona na prática, identificando quem desempenha o papel de Mentor e quem é o Aprendiz no seu exemplo.`,
            options: [],
            correct_answer_index: -1,
            pedagogical_explanation: 'A externalização visual de conceitos técnicos consolida a retenção na memória de longo prazo.',
          },
        ],
      };
    }

    res.json(activitiesJson);
  } catch (err: any) {
    console.error('Error in /api/generate-activities:', err);
    res.status(500).json({
      error: 'Falha ao gerar atividades pedagógicas.',
      details: err?.message || String(err),
    });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ComicDocs AI running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
