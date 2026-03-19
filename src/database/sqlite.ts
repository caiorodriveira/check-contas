import * as SQLite from 'expo-sqlite';

export const dbName = 'finance.db';

export const initDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(dbName);

    // Create Receitas table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS receitas (
        id TEXT PRIMARY KEY NOT NULL,
        descricao TEXT NOT NULL,
        valor REAL NOT NULL,
        tipo TEXT,
        data_recebimento TEXT,
        mes_referencia TEXT NOT NULL
      );
    `);

    // Create Despesas table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS despesas (
        id TEXT PRIMARY KEY NOT NULL,
        nome TEXT NOT NULL,
        valor REAL NOT NULL,
        categoria TEXT NOT NULL,
        forma_pagamento TEXT NOT NULL,
        cartao_id TEXT,
        pago INTEGER NOT NULL DEFAULT 0,
        data_vencimento TEXT NOT NULL,
        mes_referencia TEXT NOT NULL
      );
    `);

    // Create Cartoes table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS cartoes (
        id TEXT PRIMARY KEY NOT NULL,
        nome TEXT NOT NULL,
        limite REAL NOT NULL,
        data_vencimento TEXT NOT NULL DEFAULT ""
      );
    `);

    // Create Pagamentos table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS pagamentos (
        id TEXT PRIMARY KEY NOT NULL,
        despesa_id TEXT NOT NULL,
        valor_pago REAL NOT NULL,
        data_pagamento TEXT NOT NULL,
        observacao TEXT
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};
