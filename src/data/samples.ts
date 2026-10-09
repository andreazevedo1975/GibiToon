import { ComicBook } from '../types/comic';

export const TCP_IP_SAMPLE_BOOK: ComicBook = {
  book_metadata: {
    title: 'A Odisseia dos Pacotes: Redes e TCP/IP Explicados',
    topic: 'Introdução a Redes de Computadores e a Pilha de Protocolos TCP/IP',
    target_audience: 'beginner',
    art_style: 'clean_vector_bd',
    tone: 'socratic',
    created_at: '2026-10-08',
    characters: [
      {
        id: 'char_byte',
        name: 'Dr. Byte',
        role: 'mentor',
        visual_description:
          'Especialista veterano com óculos de aro fino, jaleco com bordas azuis e um apontador holográfico com ponta de fibra óptica.',
        avatar_color: '#2563EB',
      },
      {
        id: 'char_leo',
        name: 'Leo',
        role: 'learner',
        visual_description:
          'Estudante curioso com moletom amarelo e fones de ouvido no pescoço, segurando um tablet piscando em vermelho com erro 404.',
        avatar_color: '#F59E0B',
      },
    ],
  },
  pages: [
    {
      page_number: 1,
      layout_type: 'hero_top_two_bottom',
      page_summary: 'Capítulo 1: O Que é a Internet e a Anatomia de um Pacote de Dados',
      panels: [
        {
          panel_index: 1,
          visual_prompt:
            'Ligne claire style, wide-angle interior of an advanced network lab. Dr. Byte points to a glowing holographic globe with fiber optic lines pulsating across continents. Leo looks amazed with wide eyes.',
          camera_angle: 'wide-angle',
          narration_box:
            'CAPÍTULO 1 • A internet não é uma nuvem mística; é a maior malha física e lógica já construída pela humanidade.',
          bubbles: [
            {
              character_id: 'char_leo',
              type: 'speech',
              text: 'Dr. Byte, quando eu clico num link, o que realmente viaja pelo ar e pelos cabos?',
              position_anchor: 'top-left',
            },
            {
              character_id: 'char_byte',
              type: 'speech',
              text: 'Nada viaja inteiro, Leo! A internet fatia sua mensagem em bilhões de pequenos envelopes chamados PACOTES.',
              position_anchor: 'top-right',
            },
          ],
        },
        {
          panel_index: 2,
          visual_prompt:
            'Medium close-up of a digital envelope glowing with turquoise header lines and byte payloads. Mechanical robotic arms stamp IP addresses onto the envelope.',
          camera_angle: 'close-up',
          narration_box:
            'CADA PACOTE contém o endereço de Origem, o Destino e o número de sequência para ser remontado na ordem certa.',
          bubbles: [
            {
              character_id: 'char_byte',
              type: 'speech',
              text: 'Pense no IP (Internet Protocol) como o carteiro universal. Ele não se importa com o conteúdo, apenas com o CEP!',
              position_anchor: 'top-left',
            },
            {
              character_id: 'char_leo',
              type: 'thought',
              text: 'Então um vídeo de 10 minutos é picado em milhares de pedacinhos numerados?',
              position_anchor: 'bottom-right',
            },
          ],
        },
        {
          panel_index: 3,
          visual_prompt:
            'Diagrammatic isometric view of two computers shaking hands across a glowing cable. Speech balloons between the machines showing SYN, SYN-ACK and ACK symbols with sparks of electricity.',
          camera_angle: 'isometric',
          narration_box:
            'O FAMOSO HANDSHAKE EM TRÊS VIAS (Three-Way Handshake) garante que o servidor esteja pronto antes do primeiro byte útil ser enviado.',
          bubbles: [
            {
              character_id: 'char_byte',
              type: 'speech',
              text: 'Cliente: "Posso falar?" (SYN). Servidor: "Pode, e você me ouve?" (SYN-ACK). Cliente: "Perfeito, começando!" (ACK).',
              position_anchor: 'top-left',
            },
            {
              character_id: 'char_leo',
              type: 'shout',
              text: 'É uma conversa formal de cavalheiros digitais!',
              position_anchor: 'bottom-right',
            },
          ],
        },
      ],
    },
    {
      page_number: 2,
      layout_type: 'grid_4_uniform',
      page_summary: 'Capítulo 2: A Pilha de 4 Camadas e a Grande Batalha: TCP vs UDP',
      panels: [
        {
          panel_index: 1,
          visual_prompt:
            'A vertical architectural diagram visualized as a 4-story high-tech building. Dr. Byte stands on an elevator platform explaining each floor: Aplicação, Transporte, Rede e Enlace.',
          camera_angle: 'medium-shot',
          narration_box:
            'A PILHA TCP/IP organiza o tráfego em 4 camadas de abstração. Cada camada resolve um problema isolado.',
          bubbles: [
            {
              character_id: 'char_byte',
              type: 'speech',
              text: 'Aplicação (HTTP, DNS) fala com humanos. Transporte (TCP, UDP) cuida da entrega. Rede (IP) guia a rota. Enlace transmite bits físicos!',
              position_anchor: 'top-left',
            },
          ],
        },
        {
          panel_index: 2,
          visual_prompt:
            'Metaphor of Russian Matryoshka nesting dolls or layered mail envelopes. Data payload inside TCP segment, inside IP packet, inside Ethernet frame with mac address.',
          camera_angle: 'close-up',
          narration_box:
            'ENCAPSULAMENTO: Conforme os dados descem as camadas, recebem cabeçalhos extras. No destino, ocorre o desencapsulamento.',
          bubbles: [
            {
              character_id: 'char_leo',
              type: 'speech',
              text: 'Como bonecas russas! A carta vai dentro do envelope, que vai dentro do container do navio!',
              position_anchor: 'top-left',
            },
            {
              character_id: 'char_byte',
              type: 'speech',
              text: 'Exatamente! Cada camada só lê o rótulo que lhe diz respeito.',
              position_anchor: 'bottom-right',
            },
          ],
        },
        {
          panel_index: 3,
          visual_prompt:
            'Split panel illustration. On the left side, a meticulous robotic courier in uniform meticulously checking signed receipts and re-sending dropped boxes (TCP).',
          camera_angle: 'medium-shot',
          narration_box:
            'TCP (Transmission Control Protocol) é orientado a conexão. Se um pacote cair na estrada, ele retransmite automaticamente.',
          bubbles: [
            {
              character_id: 'char_byte',
              type: 'speech',
              text: 'TCP garante 100% de integridade. Ideal para páginas web, e-mails e transações bancárias!',
              position_anchor: 'top-left',
            },
          ],
        },
        {
          panel_index: 4,
          visual_prompt:
            'On the right side of the split, a speedy motorcycle messenger tossing newspapers at high speed without looking back, while gaming pixels and audio waves fly through the air (UDP).',
          camera_angle: 'medium-shot',
          narration_box:
            'UDP (User Datagram Protocol) prefere velocidade extrema a garantias de entrega. Pacotes perdidos são simplesmente ignorados.',
          bubbles: [
            {
              character_id: 'char_leo',
              type: 'speech',
              text: 'Ah! Por isso minha voz em chamadas ao vivo pode engasgar, mas a chamada não para pra esperar!',
              position_anchor: 'top-left',
            },
            {
              character_id: 'char_byte',
              type: 'speech',
              text: 'Perfeito! Em streaming e games online, um milissegundo de atraso é pior do que um frame perdido.',
              position_anchor: 'bottom-right',
            },
          ],
        },
      ],
    },
    {
      page_number: 3,
      layout_type: 'hero_top_two_bottom',
      page_summary: 'Capítulo 3: A Jornada de um Clique: Do Navegador aos Cabos Submarinos',
      panels: [
        {
          panel_index: 1,
          visual_prompt:
            'Wide panoramic shot showing a giant celestial library where an owl librarian consults a glowing phonebook labeled DNS. A web user types google.com, and the owl translates it to IP 142.250.190.46.',
          camera_angle: 'wide-angle',
          narration_box:
            'DNS (Domain Name System): A lista telefônica da Internet que traduz nomes amigáveis em coordenadas numéricas de IP.',
          bubbles: [
            {
              character_id: 'char_leo',
              type: 'speech',
              text: 'Computadores não entendem palavras como "youtube.com", eles só navegam por números!',
              position_anchor: 'top-left',
            },
            {
              character_id: 'char_byte',
              type: 'speech',
              text: 'O resolvedor DNS busca a resposta em milissegundos nos Root Servers mundiais.',
              position_anchor: 'top-right',
            },
          ],
        },
        {
          panel_index: 2,
          visual_prompt:
            'Deep ocean cutaway showing bioluminescent fish swimming past a massive armored submarine fiber-optic cable on the seafloor, carrying laser pulses between continents.',
          camera_angle: 'wide-angle',
          narration_box:
            'MAIS DE 95% do tráfego internacional não vai por satélite, mas por mais de 500 cabos submarinos no fundo do oceano.',
          bubbles: [
            {
              character_id: 'char_leo',
              type: 'thought',
              text: 'Meus pacotes de dados estão literalmente nadando com tubarões e baleias agora mesmo!',
              position_anchor: 'top-left',
            },
          ],
        },
        {
          panel_index: 3,
          visual_prompt:
            'Dr. Byte and Leo smiling warmly at the camera inside the command center. Leo closes his notebook with a badge "Network Explorer" glowing on his hoodie. Summary checklist on screen.',
          camera_angle: 'medium-shot',
          narration_box:
            'SÍNTESE PEDAGÓGICA • Pacotes + Endereçamento IP + Confiabilidade TCP + Tradução DNS = A infraestrutura que conecta a humanidade.',
          bubbles: [
            {
              character_id: 'char_leo',
              type: 'speech',
              text: 'Agora toda vez que eu carregar uma página, vou enxergar o handshake e os pacotes cruzando oceanos!',
              position_anchor: 'top-left',
            },
            {
              character_id: 'char_byte',
              type: 'speech',
              text: 'Missão cumprida, Leo! O conhecimento técnico nos dá o poder de enxergar o invisível.',
              position_anchor: 'bottom-right',
            },
          ],
        },
      ],
    },
  ],
};
