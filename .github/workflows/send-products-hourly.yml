name: Enviar achadinhos ao grupo (a cada hora)

on:
  # Roda automaticamente todo santo dia, de hora em hora, no minuto 0.
  schedule:
    - cron: '0 * * * *'
  # Permite clicar em "Run workflow" na aba Actions do GitHub para testar na hora.
  workflow_dispatch: {}

jobs:
  send-products:
    runs-on: ubuntu-latest
    steps:
      - name: Baixar o repositório
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Instalar dependências
        run: npm install firebase-admin

      - name: Enviar produtos ao grupo
        run: node scripts/send-group-products.mjs
        env:
          FIREBASE_SERVICE_ACCOUNT_KEY: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_KEY }}
