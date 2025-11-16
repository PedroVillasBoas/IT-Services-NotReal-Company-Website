-- Table Cliente
CREATE TABLE IF NOT EXISTS Cliente (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    telefone TEXT,
    estado_civil VARCHAR(20) NOT NULL
        CHECK (estado_civil IN ('solteiro', 'casado', 'divorciado', 'viuvo')),
    escolaridade VARCHAR(50) NOT NULL
        CHECK (escolaridade IN ('1_incompleto', '1_completo', '2_completo', 'superior', 'pos_graduado')),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table ServicoTI
CREATE TABLE IF NOT EXISTS ServicoTI (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    preco NUMERIC(10, 2) NOT NULL CHECK (preco >= 0),
    prazo_dias INTEGER NOT NULL CHECK (prazo_dias >= 0)
);

-- Table SolicitacaoServico
CREATE TABLE IF NOT EXISTS SolicitacaoServico (
    id SERIAL PRIMARY KEY,
    
    -- Foreign Keys
    cliente_id INTEGER NOT NULL REFERENCES Cliente(id) ON DELETE CASCADE,
    servico_id INTEGER NOT NULL REFERENCES ServicoTI(id) ON DELETE RESTRICT,
    
    -- Service data
    data_pedido DATE NOT NULL DEFAULT CURRENT_DATE,
    numero_solicitacao VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'EM ELABORAÇÃO',
    preco_cobrado NUMERIC(10, 2) NOT NULL,
    data_prevista DATE NOT NULL
);

CREATE INDEX ON SolicitacaoServico (cliente_id);
CREATE INDEX ON SolicitacaoServico (servico_id);