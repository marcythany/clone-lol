# Clone Legends - Aplicação Fullstack Clone do cliente do League of Legends

## Visão Geral do Projeto

Clone Legends é uma aplicação fullstack moderna que replica a experiência do cliente do League of Legends, construída com Next.js 14 e Supabase.

### Arquitetura Fullstack

- **Frontend**: Next.js 14 com App Router para renderização híbrida (SSR/CSR)
- **Backend**: Supabase para banco de dados, autenticação e storage
- **API Layer**: Next.js API Routes e Supabase Edge Functions
- **Cache**: React Query + Supabase Cache

## Stack Tecnológica Detalhada

### Core Framework e Runtime

- **Next.js** (v14.2.18): Framework React fullstack com App Router
  - Server Components
  - API Routes
  - Middleware
- **React** (v18): Biblioteca UI core
- **TypeScript** (v5): Linguagem principal com tipagem estática
- **Node.js**: Runtime JavaScript

### Backend e Banco de Dados

- **Supabase** (v1.223.10): Plataforma de backend completa
  - `@supabase/ssr` (v0.5.2): Integração SSR
  - `@supabase/supabase-js` (v2.46.2): Cliente JavaScript
  - PostgreSQL: Banco de dados principal
  - Row Level Security (RLS)
  - Realtime subscriptions
  - Edge Functions
  - Storage

### Integrações com API Riot

- **Twisted** (v1.61.4): Cliente oficial para Riot API
- **Axios** (v1.7.8): Cliente HTTP para requisições
- **Cache personalizado**: Otimização de requisições

### UI/UX e Estilização

- **Tailwind CSS** (v3.4.1): Framework CSS utilitário
  - `tailwind-merge` (v2.5.5): Utilitário para merge de classes
  - `tailwindcss-animate` (v1.0.7): Animações
- **Shadcn/UI** (v0.0.4): Componentes base
  - `@radix-ui/*`: Primitivos de UI acessíveis
  - `class-variance-authority` (v0.7.1): Variantes de estilo
  - `clsx` (v2.1.1): Utilitário de classes condicionais
- **Framer Motion** (v11.12.0): Biblioteca de animações

### Gerenciamento de Estado e Forms

- **Zustand** (v5.0.1): Gerenciamento de estado global
- **React Query** (@tanstack/react-query v5.62.0): Cache e estado servidor
- **React Hook Form** (v7.53.2): Gerenciamento de formulários
- **Zod** (v3.23.8): Validação de schemas

### Internacionalização e Temas

- **Next-Intl** (v3.25.3): Internacionalização
- **Next-Themes** (v0.4.3): Gerenciamento de temas

### Utilidades

- **React Hot Toast** (v2.4.1): Notificações

### Ferramentas de Desenvolvimento

- **ESLint** (v8): Linting de código
- **PostCSS** (v8): Processamento de CSS
- **TypeScript** e tipos (@types/*)
  - @types/node (v20)
  - @types/react (v18)
  - @types/react-dom (v18)

### Características Especiais

1. **Servidor HTTPS Customizado**
   - Desenvolvimento local seguro
   - Suporte a WebSockets

2. **Otimizações de Performance**
   - Server-side Rendering (SSR)
   - Static Site Generation (SSG)
   - Streaming e Suspense
   - Cache em múltiplas camadas

3. **Segurança**
   - Autenticação via Supabase
   - Row Level Security
   - Validação de dados com Zod
   - HTTPS em desenvolvimento

4. **Developer Experience**
   - TypeScript strict mode
   - ESLint configurado
   - Hot reload
   - Ambiente HTTPS local

## Arquitetura de Componentes

### Componentes Atômicos

- **Button**: Botão genérico
- **Input**: Campo de texto
- **Select**: Campo de seleção

### Componentes de Layout

- **Header**: Cabeçalho da aplicação
- **Main**: Conteúdo principal
- **Footer**: Rodapé da aplicação
- **Sidebar**: Barra lateral

### Componentes de Funcionalidade

- **LoginForm**: Formulário de login
- **RSO Integration**: RSO or Riot Sign On, allows players to safely link their Riot Account to other applications.
- **RegisterForm**: Formulário de registro
- **MatchHistory**: Histórico de partidas

## Fluxo de Dados

### Autenticação

- **Login**: Autenticação via Supabase
- **RSO**: RSO or Riot Sign On
- **Registro**: Registro de usuário via Supabase

### Histórico de Partidas

- **Listagem**: Listagem de partidas
- **Detalhes**: Detalhes de uma partida

## Padrões de Desenvolvimento

### Convenções de Código

- ESLint + Prettier
- Conventional Commits
- TypeScript com strict mode
- Princípios SOLID

### Git Flow

- `main`: Versão estável
- `develop`: Branch de desenvolvimento

## Deploy e Infraestrutura

### Plataformas

- Vercel (recomendado para Next.js)

### CI/CD

- GitHub Actions
- Deploys automatizados
- Verificação de qualidade de código
- Testes automatizados

## Monitoramento

### Ferramentas

- Sentry (erros)
- LogRocket (sessões)
- Google Analytics
- Performance Web Vitals

## Documentação

- README detalhado
- Documentação de componentes
- Guia de contribuição
- Changelog

## Boas Práticas e Padrões

### Server Components e Client Components

1. **Server Components (Padrão)**
   - Páginas e layouts
   - Componentes de dados
   - Componentes estáticos

2. **Client Components (use client)**
   - Componentes interativos
   - Componentes com estado local
   - Componentes que usam hooks

### Gerenciamento de Estado

1. **Server State**
   - Dados do Supabase via Server Components
   - Cache no banco de dados
   - Revalidação com Server Actions

2. **Client State**
   - Estado local com `useState`
   - Estado de formulários
   - UI state (modais, dropdowns)

### Tratamento de Erros

1. **Error Boundaries**

```typescript
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="error-container">
      <h2>Algo deu errado!</h2>
      <button onClick={() => reset()}>Tentar novamente</button>
    </div>
  )
}
```

2. **Loading States**

```typescript
export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
    </div>
  )
}
```

### Organização de Código

1. **Convenções de Nomenclatura**
   - PascalCase para componentes
   - camelCase para funções e variáveis
   - UPPER_CASE para constantes
   - kebab-case para arquivos CSS

2. **Estrutura de Arquivos**

```
/app
├── lib/
│   ├── services/
│   │   ├── authService.ts    # Novo serviço RSO
│   │   └── riotService.ts    # API da Riot atualizada
│   └── utils/
│       └── placeholderUtils.ts
├── api/
│   └── auth/                 # Novos endpoints RSO
│       ├── login/
│       ├── callback/
│       └── refresh/
└── hooks/
    └── useAuth.ts           # Hook para RSO
```

### Performance

1. **Otimização de Renderização**

   ```typescript
   // Memoização de componentes pesados
   const MemoizedFriendList = memo(FriendList, (prev, next) => {
     return prev.friends.length === next.friends.length &&
            prev.friends.every((f, i) => f.id === next.friends[i].id);
   });
   ```

2. **Lazy Loading de Componentes**

   ```typescript
   // Carregamento sob demanda de features pesadas
   const MatchHistory = lazy(() => import('./MatchHistory'));
   const ChampionStats = lazy(() => import('./ChampionStats'));
   ```

3. **Suspense Boundaries**

   ```typescript
   <Suspense 
     fallback={
       <div className="animate-pulse">
         <div className="h-48 bg-gray-200 rounded-lg"></div>
       </div>
     }
   >
     <MatchHistory />
   </Suspense>
   ```

### Testes

1. **Estrutura de Testes**

   ```
   /__tests__/
   ├── components/      # Testes de componentes
   ├── services/        # Testes de serviços
   └── utils/           # Testes de utilitários
   ```

2. **Exemplo de Teste**

   ```typescript
   import { render, screen } from '@testing-library/react'
   import { ChampionCard } from '@/components/champions'
   
   describe('ChampionCard', () => {
     it('renders champion information correctly', () => {
       render(<ChampionCard id={1} name="Annie" />)
       expect(screen.getByText('Annie')).toBeInTheDocument()
     })
   })
   ```

### Deploy e CI/CD

1. **Vercel Deploy**
   - Automatic deployments
   - Preview deployments
   - Environment variables

2. **GitHub Actions**

   ```yaml
   name: CI
   on: [push, pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - run: npm ci
         - run: npm test
   ```

## Boas Práticas por Tecnologia

### Next.js 14

1. **App Router**
   - Utilizar Server Components por padrão
   - Colocar 'use client' apenas quando necessário
   - Implementar loading.tsx para Suspense
   - Usar error.tsx para tratamento de erros
   - Implementar layout.tsx para layouts compartilhados

2. **Roteamento**
   - Organizar rotas por funcionalidade
   - Usar dynamic routes quando necessário
   - Implementar middleware para autenticação
   - Utilizar parallel routes para layouts complexos

3. **Performance**
   - Priorizar Server Components
   - Implementar Streaming com Suspense
   - Usar generateMetadata para SEO
   - Implementar Image component para otimização
   - Utilizar font optimization

### React

1. **Componentes**
   - Manter componentes pequenos e focados
   - Usar composição sobre herança
   - Implementar Error Boundaries
   - Utilizar React.memo quando necessário
   - Evitar prop drilling com Context

2. **Hooks**
   - Criar hooks customizados para lógica reutilizável
   - Usar useCallback para funções props
   - Implementar useMemo para cálculos pesados
   - Seguir regras de hooks
   - Evitar hooks aninhados

3. **Estado**
   - Usar useState para estado local
   - Implementar useReducer para estado complexo
   - Utilizar Context para estado global
   - Evitar estado desnecessário

### TypeScript

1. **Tipos**
   - Criar interfaces para props de componentes
   - Usar tipos em vez de any
   - Implementar type guards
   - Utilizar generics quando apropriado
   - Criar tipos utilitários

2. **Configuração**
   - Usar strict mode
   - Implementar path aliases
   - Configurar baseUrl
   - Usar noEmit com Next.js
   - Manter types atualizados

3. **Boas Práticas**
   - Evitar type assertions
   - Usar discriminated unions
   - Implementar error types
   - Criar barrel exports
   - Manter tipos DRY

### Tailwind CSS

1. **Organização**
   - Usar @layer para organização
   - Implementar design tokens
   - Criar componentes reutilizáveis
   - Usar prefixos consistentes
   - Manter classes ordenadas

2. **Customização**
   - Estender theme no tailwind.config.js
   - Criar plugins quando necessário
   - Usar CSS variables para temas
   - Implementar presets
   - Manter consistência visual

3. **Performance**
   - Usar JIT mode
   - Purgar classes não utilizadas
   - Minimizar uso de @apply
   - Otimizar para produção
   - Usar clsx/tailwind-merge

### Shadcn/UI

1. **Componentes**
   - Customizar temas via CSS variables
   - Estender componentes base
   - Manter consistência visual
   - Usar variants
   - Implementar acessibilidade

2. **Integração**
   - Seguir padrões de composição
   - Usar com Tailwind
   - Implementar dark mode
   - Manter componentes atualizados
   - Criar variantes personalizadas

### Supabase

1. **Autenticação**
   - Implementar middleware
   - Usar Row Level Security (RLS)
   - Configurar OAuth providers
   - Manter tokens seguros
   - Implementar refresh token

2. **Database**
   - Criar tipos para tabelas
   - Usar migrations
   - Implementar foreign keys
   - Otimizar queries
   - Usar policies

3. **Storage**
   - Implementar upload seguro
   - Usar buckets organizados
   - Configurar CORS
   - Otimizar assets
   - Implementar cache

4. **Edge Functions**
   - Usar TypeScript
   - Implementar error handling
   - Otimizar performance
   - Usar environment variables
   - Manter funções pequenas

### Scripts Disponíveis

```json
{
  "dev": "node server.js",     // Desenvolvimento com HTTPS
  "build": "next build",       // Build de produção
  "start": "next start",       // Servidor de produção
  "lint": "next lint",         // Análise de código
  "type-check": "tsc",        // Verificação de tipos
  "test": "jest",             // Testes unitários
  "test:e2e": "cypress run"   // Testes E2E
}
```

## Autenticação e Persistência

### Supabase Integration (Server-Side Auth)

O projeto utiliza o Supabase como backend para autenticação e persistência de dados, implementando o novo padrão de autenticação server-side do Next.js 14+.

#### Implementação (lib/services/supabaseService.ts)

```typescript
class SupabaseService {
  // Singleton pattern para instância única
  private static instance: SupabaseService;
  
  // Cliente Supabase inicializado com credenciais
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  // Métodos para autenticação e banco de dados
  async signUp(email: string, password: string) { ... }
  async signIn(email: string, password: string) { ... }
  async getUser(userId: string) { ... }
  async saveMatchHistory(userId: string, matchData: any) { ... }
}
```

#### Estrutura do Banco de Dados

1. **Users**
   - id (uuid)
   - email
   - summoner_name
   - region
   - created_at

2. **Match History**
   - id (uuid)
   - user_id (foreign key)
   - match_id
   - champion_id
   - result
   - kda
   - created_at

3. **Cache**
   - key (string)
   - value (jsonb)
   - expires_at

## Rate Limiting

O projeto implementa um controle rigoroso de rate limiting para a API da Riot, que possui os seguintes limites:

- 20 requisições a cada 1 segundo
- 100 requisições a cada 2 minutos

#### Implementação (lib/services/rateLimit.ts)

```typescript
class RateLimiter {
  private shortTermRequests: number = 0;  // 20/1s
  private longTermRequests: number = 0;   // 100/2min
  
  async executeWithRateLimit<T>(fn: () => Promise<T>): Promise<T> {
    await this.checkLimit();
    return fn();
  }
}
```

#### Uso no Serviço da API

```typescript
class RiotApiService {
  // Wrapper para requisições com rate limit
  private async request<T>(url: string, config = {}): Promise<T> {
    return rateLimiter.executeWithRateLimit(() =>
      axios.get<T>(url, {
        ...config,
        headers: this.getHeaders()
      }).then(response => response.data)
    );
  }
}
```

#### Estratégias de Rate Limiting

1. **Controle de Janela Dupla**:
   - Janela curta: 20 requests/1s
   - Janela longa: 100 requests/2min

2. **Fila de Requisições**:
   - Requisições são enfileiradas quando limite é atingido
   - Espera automática pelo reset do limite

3. **Recuperação de Erros**:
   - Retry automático após espera
   - Backoff exponencial em caso de falhas

## Atualizações e Novas Funcionalidades (2024)

### Autenticação Riot Sign On (RSO)

O sistema agora utiliza autenticação oficial da Riot Games:

```typescript
// /app/lib/services/authService.ts
const RSO_CONFIG = {
  provider: 'https://auth.riotgames.com',
  clientId: process.env.NEXT_PUBLIC_RIOT_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_RIOT_CLIENT_SECRET,
  redirectUri: process.env.NEXT_PUBLIC_RIOT_REDIRECT_URI,
  scopes: ['openid', 'cpid', 'offline_access'],
};

export interface RSOTokens {
  access_token: string;
  id_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

class AuthService {
  public async getTokens(code: string): Promise<RSOTokens> {
    // Exchange authorization code for tokens
    const tokens = await this.exchangeCode(code);
    return tokens;
  }
}
```

### Sistema de Placeholders

Implementação de fallback visual para recursos não carregados:

```typescript
// /app/lib/utils/placeholderUtils.ts
function generateSvgPlaceholder(text: string, size: number = 60, bgColor: string = '#4A5568'): string {
  const initials = text
    .split(/\s+/)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial" font-size="${size * 0.4}px" fill="white" text-anchor="middle" dy=".3em">
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
```

### Sistema Social Atualizado

Novo sistema de amigos com suporte a status em tempo real:

```typescript
// /components/layout/social-sidebar.tsx
type Friend = {
  id: string;
  username: string;
  status: 'online' | 'offline' | 'in_game';
  game: 'league' | 'mobile';
  champion_id?: string;
};

type FriendGroup = {
  name: string;
  count: number;
  friends: Friend[];
};
```

### Cores por Rank Atualizadas

Suporte ao novo rank Emerald e cores oficiais:

```typescript
const rankColors = {
  IRON: '#51565A',
  BRONZE: '#7A5A3C',
  SILVER: '#7D8998',
  GOLD: '#EDB93B',
  EMERALD: '#4BA0B0',  // Novo rank
  PLATINUM: '#4BA0B0',
  DIAMOND: '#576BCE',
  MASTER: '#9D3EB5',
  GRANDMASTER: '#E0484C',
  CHALLENGER: '#F4C874'
};
```

### Novas Variáveis de Ambiente

```env
# Riot Games API e RSO
NEXT_PUBLIC_RIOT_API_KEY=
NEXT_PUBLIC_RIOT_CLIENT_ID=
NEXT_PUBLIC_RIOT_CLIENT_SECRET=
NEXT_PUBLIC_RIOT_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Existentes
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE=
```

### Estrutura de Arquivos Atualizada

```
/app
├── lib/
│   ├── services/
│   │   ├── authService.ts    # Novo serviço RSO
│   │   └── riotService.ts    # API da Riot atualizada
│   └── utils/
│       └── placeholderUtils.ts
├── api/
│   └── auth/                 # Novos endpoints RSO
│       ├── login/
│       ├── callback/
│       └── refresh/
└── hooks/
    └── useAuth.ts           # Hook para RSO
```

### Segurança RSO

1. **Armazenamento de Tokens**
   - Access tokens em cookies httpOnly
   - Refresh tokens com expiração de 30 dias
   - Verificação de estado CSRF
   - Renovação automática de tokens

2. **Proteção de Rotas**
   - Middleware atualizado para RSO
   - Verificação de tokens
   - Renovação transparente

3. **Headers de Segurança**

   ```typescript
   // Configuração de cookies seguros
   cookies().set('access_token', token, {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     sameSite: 'lax',
     maxAge: expires_in,
   });
   ```

4. **Validação de Estado CSRF**

   ```typescript
   // Geração de estado seguro
   const state = uuidv4();
   cookies().set('oauth_state', state, {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     sameSite: 'lax',
     maxAge: 60 * 10, // 10 minutos
   });

   // Verificação no callback
   if (!state || !storedState || state !== storedState) {
     throw new Error('Invalid state - possible CSRF attack');
   }
   ```

### Integração com Data Dragon Atualizada

1. **Hook useDataDragon**

   ```typescript
   export function useDataDragon() {
     const [version, setVersion] = useState<string>('');
     
     const getChampionImage = useCallback(async (championId: string, type: 'loading' | 'square' = 'square') => {
       if (!version) return null;
       
       const baseUrl = `https://ddragon.leagueoflegends.com/cdn/${version}`;
       return type === 'square'
         ? `${baseUrl}/img/champion/${championId}.png`
         : `${baseUrl}/img/champion/loading/${championId}_0.jpg`;
     }, [version]);

     return { getChampionImage };
   }
   ```

2. **Cache de Recursos**

   ```typescript
   // Armazenamento em cache de URLs de imagens
   const championAvatars = useMemo(() => {
     const cache: Record<string, string> = {};
     
     friends.forEach(friend => {
       if (friend.champion_id) {
         cache[friend.champion_id] = getImageWithPlaceholder(
           getChampionImage(friend.champion_id),
           friend.username
         );
       }
     });

     return cache;
   }, [friends, getChampionImage]);
   ```

### Sistema de Notificações

1. **Tipos de Notificação**

   ```typescript
   type NotificationType = 
     | 'friend_request'
     | 'friend_online'
     | 'friend_in_game'
     | 'game_invite'
     | 'ranked_update';

   interface Notification {
     id: string;
     type: NotificationType;
     title: string;
     message: string;
     timestamp: Date;
     read: boolean;
     data?: Record<string, any>;
   }
   ```

2. **Toast Notifications**

   ```typescript
   // Configuração do sistema de toast
   const notify = {
     friend_online: (friend: Friend) => 
       toast.success(`${friend.username} está online`, {
         icon: '🟢',
         duration: 3000,
       }),
     
     friend_in_game: (friend: Friend) => 
       toast.success(`${friend.username} está em partida`, {
         icon: '⚔️',
         duration: 5000,
       }),
   };
   ```

### Melhorias de Performance

1. **Otimização de Renderização**

   ```typescript
   // Memoização de componentes pesados
   const MemoizedFriendList = memo(FriendList, (prev, next) => {
     return prev.friends.length === next.friends.length &&
            prev.friends.every((f, i) => f.id === next.friends[i].id);
   });
   ```

2. **Lazy Loading de Componentes**

   ```typescript
   // Carregamento sob demanda de features pesadas
   const MatchHistory = lazy(() => import('./MatchHistory'));
   const ChampionStats = lazy(() => import('./ChampionStats'));
   ```

3. **Suspense Boundaries**

   ```typescript
   <Suspense 
     fallback={
       <div className="animate-pulse">
         <div className="h-48 bg-gray-200 rounded-lg"></div>
       </div>
     }
   >
     <MatchHistory />
   </Suspense>
   ```

### Riot Games API (Twisted)

A integração com a API da Riot Games é feita através da biblioteca Twisted, que oferece uma interface tipada e organizada para acessar os endpoints:

```typescript
// /app/lib/services/riotService.ts
import { LolApi, RiotApi } from 'twisted';
import { RegionGroups } from 'twisted/dist/constants/regions';

export class RiotService {
  // Instâncias da API
  private riotApi = new RiotApi({ key: RIOT_CONFIG.apiKey });
  private lolApi = new LolApi({ key: RIOT_CONFIG.apiKey });

  // Endpoints que usam RegionGroups (AMERICAS, EUROPE, ASIA)
  async getAccountByRiotId(gameName: string, tagLine: string) {
    const response = await this.riotApi.Account.getByRiotId(
      gameName,
      tagLine,
      RegionGroups.AMERICAS
    );
    return response.response;
  }

  // Endpoints que usam região específica (BR1, NA1, etc)
  async getCurrentGame(summonerId: string) {
    try {
      const response = await this.lolApi.SpectatorV5.activeGame(
        summonerId,
        RIOT_CONFIG.defaultRegion
      );
      return response.response;
    } catch (error) {
      if (error.status === 404) return null; // Jogador não está em partida
      throw error;
    }
  }

  // Endpoints de histórico usando região dinâmica
  async getMatchHistory(puuid: string, start = 0, count = 20) {
    const regionGroup = getRegionGroup(RIOT_CONFIG.defaultRegion);
    const response = await this.lolApi.MatchV5.list(
      puuid,
      regionGroup,
      { start, count }
    );
    return response.response;
  }
}
```

#### Configuração de Região

A configuração de região é gerenciada centralmente:

```typescript
// /app/lib/config/riot.ts
export const RIOT_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_RIOT_API_KEY,
  defaultRegion: Regions.BR1,
  riotApiConfig: {
    debug: process.env.NODE_ENV === 'development',
    cache: { ttl: 900 } // 15 minutos
  }
};

// Mapeamento de regiões para grupos de região
export function getRegionGroup(region: Regions): RegionGroups {
  switch (region) {
    case Regions.BR1:
    case Regions.NA1:
      return RegionGroups.AMERICAS;
    // ... outros casos
  }
}
```

Esta implementação oferece:

- Tipagem forte para regiões e endpoints
- Gerenciamento automático de rate limits
- Cache integrado para reduzir chamadas à API
- Tratamento adequado de erros específicos da API

#### Proxy da API (CORS)

Para evitar problemas de CORS ao chamar a API da Riot diretamente do frontend, implementamos um proxy usando as rotas de API do Next.js:

```typescript
// /app/api/riot/route.ts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint');
  const params = Object.fromEntries(searchParams.entries());

  // Chamada dinâmica do serviço Riot
  const data = await riotService[endpoint](...Object.values(params));
  return NextResponse.json(data);
}
```

Exemplo de uso no frontend:

```typescript
// Chamada ao proxy em vez da API direta
async function getSummonerData(name: string) {
  const params = new URLSearchParams({
    endpoint: 'getSummonerByName',
    name
  });
  
  const response = await fetch(`/api/riot?${params}`);
  return response.json();
}
