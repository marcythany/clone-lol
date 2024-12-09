# Arquitetura do Projeto: Clone Legends

## Estrutura de Diretórios

```plaintext
clone-legends/
┣ .vscode/                      # Configurações do VS Code
┣ components/                   # Componentes reutilizáveis
┃ ┣ auth/                       # Componentes relacionados à autenticação
┃ ┣ profile/                    # Componentes para perfil de usuário
┃ ┗ ui/                         # Componentes genéricos de UI
┣ hooks/                        # Hooks customizados
┣ lib/                          # Bibliotecas e configurações
┃ ┣ riot/                       # Integração com Riot API (Twisted)
┃ ┣ supabase/                   # Configuração do cliente Supabase
┃ ┗ utils/                      # Funções auxiliares e helpers
┣ messages/                     # Arquivos de mensagens para internacionalização
┣ public/                       # Arquivos estáticos (imagens, fontes, etc.)
┣ src/                          # Diretório principal do Next.js (App Router)
┃ ┣ app/                        # Rotas e lógica principal
┃ ┃ ┣ api/                      # Rotas de API
┃ ┃ ┃ ┣ avatar/
┃ ┃ ┃ ┃ ┗ [id]/                # Endpoint para obter avatares
┃ ┃ ┃ ┣ champion-icon/
┃ ┃ ┃ ┃ ┗ [id]/                # Endpoint para ícones de campeões
┃ ┃ ┃ ┗ riot/
┃ ┃ ┃   ┗ account/             # Rotas relacionadas a contas Riot
┃ ┃ ┣ auth/                    # Configurações de autenticação
┃ ┃ ┃ ┗ callback/              # Callback para autenticação OAuth
┃ ┃ ┗ [locale]/                # Suporte a múltiplos idiomas com next-intl
┃ ┃   ┣ (auth)/                # Rotas protegidas para autenticação
┃ ┃   ┃ ┣ login/               # Página de login
┃ ┃   ┃ ┗ register/            # Página de registro
┃ ┃   ┗ (main)/                # Rotas principais do aplicativo
┃ ┃     ┣ play/                # Página principal para jogar
┃ ┃     ┗ profile/             # Página de perfil do usuário
┃ ┣ components/                # Componentes reutilizáveis e modulares
┃ ┣ hooks/                     # Hooks específicos da aplicação
┃ ┣ i18n/                      # Configurações e loaders de internacionalização
┃ ┣ lib/                       # Configurações e integrações
┃ ┗ services/                  # Serviços externos
┣ supabase/                    # Arquivos relacionados ao banco de dados Supabase
┣ types/                       # Tipos globais do TypeScript
┣ tailwind.config.js           # Configurações do TailwindCSS
┣ tsconfig.json                # Configurações do TypeScript
┣ package.json                 # Dependências e scripts do projeto
┗ README.md                    # Documentação do projeto
```
