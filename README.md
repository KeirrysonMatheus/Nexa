# Nexa

> ⚠️ **Projeto em desenvolvimento**
>
> Este repositório ainda está em construção e pode receber mudanças frequentes em funcionalidades, estrutura e APIs.

Nexa é uma aplicação social construída com Next.js, React e Prisma. O projeto inclui autenticação (e-mail/senha e Google), feed de posts, comentários, curtidas e perfis de usuário.

## Stack principal

- Next.js 16
- React 19
- TypeScript
- Prisma + PostgreSQL
- Better Auth
- Tailwind CSS

## Funcionalidades atuais

- Cadastro e login com e-mail/senha
- Login social com Google (opcional)
- Feed de publicações
- Criação de posts com imagem
- Comentários e curtidas
- Perfil de usuário e conexões
- Notificações web push transacionais via OneSignal

## Pré-requisitos

- Node.js 20+
- npm 10+
- Banco PostgreSQL

## Instalação e execução local

```bash
npm install
npm run dev
```

## Notificações web push em produção

A entrega de push usa o OneSignal, não a tabela local `push_subscription`. Antes do deploy, configure no provedor de hospedagem:

```bash
NEXT_PUBLIC_ONESIGNAL_APP_ID=seu-app-id
ONESIGNAL_APP_ID=seu-app-id
ONESIGNAL_REST_API_KEY=sua-chave-de-api-do-app
NEXT_PUBLIC_URL=https://seu-dominio.example
```

- Cadastre exatamente o domínio HTTPS de produção em **Settings > Push & In-App > Web** no OneSignal.
- Mantenha `/OneSignalSDKWorker.js` público, sem redirecionamento ou autenticação. O app já o serve com o MIME type, escopo e política de cache necessários.
- Faça um teste real em uma janela normal de Chrome, Firefox, Edge ou Safari: aceite a permissão, confirme a assinatura no painel OneSignal e envie um evento de curtida, novo seguidor ou novo post para validar recebimento e clique.
- Não envie conteúdo sensível por push. A verificação de identidade do OneSignal não está disponível para o Web SDK, portanto uma pessoa com controle do JavaScript no próprio navegador pode tentar associar sua assinatura ao ID externo de outro usuário.
- As mensagens são enviadas depois de a transação da aplicação concluir. Falhas de entrega são registradas, mas não há fila persistente nem retentativas automáticas. Para notificações que não podem ser perdidas, implemente uma outbox/fila com retentativas antes de classificá-las como críticas.
