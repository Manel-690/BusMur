# 🚌 BusMur — Transporte Público de Muriaé

Plataforma web para gerenciamento e consulta de transporte público urbano na cidade de Muriaé - MG.

## Funcionalidades

### 🧍 Passageiro
- Visualizar todas as linhas com status em tempo real
- Busca e filtros por status (ativa, atrasada, inativa)
- Detalhe da linha com horários completos e previsão de chegada
- Mapa interativo com ônibus ao vivo
- Notificações de atrasos com motivo

### 🚌 Motorista
- Cadastro com envio de imagem da CNH
- Status "aguardando aprovação" após cadastro
- Seleção da linha/rota a operar
- Botão de iniciar e parar compartilhamento de localização
- Temporizador de tempo em rota

### ⚙️ Administrador
- Dashboard com estatísticas do sistema
- Aprovação/rejeição de motoristas pendentes com visualização da CNH
- Gerenciamento de linhas (edição, criação)
- Monitoramento de motoristas ativos
- Mapa ao vivo com todos os ônibus

## Telas
| Rota | Descrição | Acesso |
|---|---|---|
| `/login` | Login com seleção de tipo de usuário | Público |
| `/cadastro-motorista` | Cadastro de motorista com upload CNH | Público |
| `/linhas` | Lista de linhas com busca e filtros | Passageiro / Admin |
| `/linhas/:id` | Detalhe da linha (horários, paradas, mapa) | Passageiro / Admin |
| `/mapa` | Mapa em tempo real | Passageiro / Admin |
| `/notificacoes` | Notificações de atrasos | Passageiro |
| `/motorista` | Painel do motorista | Motorista |
| `/admin` | Painel administrativo | Admin |

## Tech Stack
- **React 19** + Vite
- **Tailwind CSS 3** (dark mode via `class`)
- **React Router DOM v7**
- **Supabase** (auth + banco de dados — configurar .env)
- **react-hot-toast** para notificações

## Como rodar

```bash
# Instalar dependências
npm install

# Iniciar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Configuração do Supabase

Edite o arquivo `.env`:
```
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
```

## Tema
- Modo claro e escuro com alternância pelo sidebar
- Cores primárias: azul (`#1d4ed8`) e ciano (`#0ea5e9`)
- Tipografia: DM Sans + Space Mono
- Design mobile-first

## Usuários Demo (mock)
| Tipo | Role |
|---|---|
| Passageiro | `passenger` |
| Motorista | `driver` |
| Administrador | `admin` |

> No modo demo (sem Supabase), selecione o tipo de usuário na tela de login e clique em Entrar com qualquer e-mail/senha.
