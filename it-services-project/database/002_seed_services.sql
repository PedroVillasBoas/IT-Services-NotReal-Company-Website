INSERT INTO ServicoTI (nome, preco, prazo_dias)
VALUES
    ('Migração para a Nuvem', 5000.00, 14),
    ('Auditoria de Cibersegurança', 3500.00, 7),
    ('Serviços de TI Gerenciados', 2500.00, 30),
    ('Configuração de Rede', 4200.00, 10)
ON CONFLICT (nome) DO NOTHING;