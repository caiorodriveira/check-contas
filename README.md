# 💰 Check Contas — Controle Financeiro Mensal

Aplicativo mobile de controle financeiro pessoal, desenvolvido com **React Native + Expo + TypeScript**.

Funciona 100% offline. Todos os dados são armazenados localmente no dispositivo com **SQLite**.

---

## 📱 Funcionalidades

- **Dashboard** com resumo financeiro do mês (saldo, receitas, despesas, progresso de pagamentos)
- **Despesas** — cadastro com categoria, forma de pagamento e vínculo a cartão de crédito
- **Receitas** — cadastro e remoção de receitas mensais
- **Cartões de Crédito** — gerenciamento com barra de uso do limite
- **Navegação entre meses** para acompanhar o histórico financeiro
- **Marcar como pago** com toggle direto na listagem

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|-----------|-----|
| [React Native](https://reactnative.dev/) | Framework mobile |
| [Expo](https://expo.dev/) | Ambiente de desenvolvimento |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) | Banco de dados local |
| [React Navigation](https://reactnavigation.org/) | Navegação entre telas |
| [Zustand](https://github.com/pmndrs/zustand) | Gerenciamento de estado |

---

## 📂 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis (SummaryCard, ProgressBar)
├── screens/          # Telas (Dashboard, Despesas, Receitas, Cartões)
├── navigation/       # Configuração do Stack Navigator
├── database/         # Inicialização do SQLite e schema
├── repositories/     # Acesso aos dados (CRUD)
├── services/         # Regras de negócio e cálculos
├── models/           # Interfaces TypeScript
├── store/            # Zustand store global
└── utils/            # Funções auxiliares
```

---

## 🗄️ Banco de Dados

| Tabela | Descrição |
|--------|-----------|
| `receitas` | Receitas do mês (salário, freelance, etc.) |
| `despesas` | Despesas com categoria, forma de pagamento e status |
| `cartoes` | Cartões de crédito com limite |
| `pagamentos` | Registro de pagamentos realizados |

---

## 🚀 Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Emulador Android/iOS ou dispositivo com [Expo Go](https://expo.dev/client)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/caiorodriveira/check-contas.git
cd check-contas

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm start

# Ou rodar direto no Android
npm run android
```

---

## 📋 Regras de Negócio

- **Saldo do mês** = soma das receitas − soma das despesas
- **Valor pago** = soma das despesas marcadas como pagas
- **Valor a pagar** = soma das despesas ainda pendentes
- Despesas vinculadas a **cartão de crédito** só são pagas quando a fatura do cartão é paga
- Cada mês funciona de forma independente (filtrado por `mes_referencia`)

---

## 📄 Licença

Este projeto é de uso pessoal.
