# Financial Reporting Tool

## Overview

This project is a financial reporting tool that processes transaction data and generates financial reports. It can calculate balances and create monthly series data for income, expenses, and net values from financial transactions.

## Features

- Process transaction data with amounts and dates
- Calculate total balance across all transactions
- Generate monthly series reports including:
  - Income totals per month
  - Expense totals per month
  - Net balance per month
- TypeScript implementation with strong typing
- Comprehensive test coverage

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Danielpinedasalazar/prueba_tecnica.git
cd Prueba-Tecnica
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
bun install
```

## Usage

### Basic Usage

```typescript
import { computeReport } from './utils/report';

// Sample transaction data
const transactions = [
  { amount: 1000, date: '2023-01-15' },
  { amount: -250, date: '2023-01-20' },
  { amount: 300, date: '2023-02-05' },
];

// Generate report
const report = computeReport(transactions);

console.log('Total Balance:', report.balance);
console.log('Monthly Series:', report.series);
```

### Report Structure

The `computeReport` function returns an object with the following structure:

```typescript
{
  balance: number; // Total balance across all transactions
  series: Array<{
    month: string; // Format: 'YYYY-MM'
    income: number; // Total positive amounts for the month
    expense: number; // Total negative amounts for the month (as positive value)
    net: number; // Income minus expense for the month
  }>;
}
```

## Project Structure

```
.
├── public/                  # Static files
│   ├── assets/              # Asset files (images, icons, etc.)
│   └── ...
├── src/
│   ├── components/          # React components
│   │   ├── common/          # Commonly used components
│   │   └── layout/          # Layout components
│   ├── pages/               # Next.js pages
│   │   ├── api/             # API routes
│   │   └── _app.tsx         # Custom App component
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── ...
├── .env                      # Environment variables
├── .gitignore                # Git ignore file
├── next.config.js           # Next.js configuration
├── package.json             # Package configuration
└── tsconfig.json            # TypeScript configuration
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
