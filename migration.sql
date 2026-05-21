-- Tabela para controle dos recibos
CREATE TABLE IF NOT EXISTS recibos (
  id SERIAL PRIMARY KEY,
  numero INTEGER NOT NULL UNIQUE,
  nome_firma TEXT,
  endereco TEXT,
  municipio TEXT,
  estado TEXT,
  insc_mun TEXT,
  cnpj TEXT,
  insc_est TEXT,
  nat_operacao TEXT,
  data_emissao TEXT,
  itens JSONB,
  total NUMERIC(10,2),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Sequência de número do recibo (começa em 752)
INSERT INTO recibos (numero, nome_firma, criado_em)
VALUES (751, 'SEED - recibo inicial', NOW())
ON CONFLICT (numero) DO NOTHING;

-- RLS: liberar leitura e inserção públicas (ajuste conforme necessidade)
ALTER TABLE recibos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública" ON recibos
  FOR SELECT USING (true);

CREATE POLICY "Inserção pública" ON recibos
  FOR INSERT WITH CHECK (true);
