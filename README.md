# AtlasFit AI

Personal trainer autonomo com avaliacao inicial completa, geracao de plano por IA, treino guiado, check-in e oferta comercial.

## Rodar localmente

```powershell
npm start
```

Abra:

```text
http://127.0.0.1:4174
```

## Ativar IA real

Defina a chave antes de iniciar o servidor:

```powershell
$env:OPENAI_API_KEY="sua_chave_aqui"
npm start
```

Opcionalmente, escolha o modelo:

```powershell
$env:OPENAI_MODEL="gpt-4.1-mini"
npm start
```

Sem `OPENAI_API_KEY`, o app continua funcionando com o motor demo local.

## Colocar no ar com Render

1. Crie um repositorio no GitHub.
2. Envie estes arquivos para o repositorio.
3. Acesse https://render.com e clique em **New +**.
4. Escolha **Web Service**.
5. Conecte o repositorio do GitHub.
6. Configure:

```text
Name: atlasfit-ai
Runtime: Node
Build Command: npm install
Start Command: npm start
```

7. Em **Environment**, adicione:

```text
OPENAI_API_KEY=sua_chave_da_openai
OPENAI_MODEL=gpt-4.1-mini
```

8. Clique em **Deploy Web Service**.

Quando terminar, o Render vai gerar uma URL publica parecida com:

```text
https://atlasfit-ai.onrender.com
```

O arquivo `render.yaml` tambem permite criar o servico como Blueprint no Render.

## Proximo passo de produto

- Persistir alunos e planos em banco de dados.
- Criar login para personal e aluno.
- Adicionar checkout via Stripe, Mercado Pago ou WhatsApp.
- Trocar o demo local por regras clinicas/treinamento revisadas por um profissional de educacao fisica.
