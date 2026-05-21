const { Client } = require('pg');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const d = JSON.parse(event.body);

    await client.connect();

    await client.query(
      `INSERT INTO recibos
        (numero, nome_firma, endereco, municipio, estado, insc_mun,
         cnpj, insc_est, nat_operacao, data_emissao, itens, total)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        d.numero, d.nomeFirma, d.endereco, d.municipio, d.estado,
        d.inscMun, d.cnpj, d.inscEst, d.natOperacao, d.dataEmissao,
        JSON.stringify(d.itens), d.total,
      ]
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ ok: true, numero: d.numero }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  } finally {
    await client.end();
  }
};
