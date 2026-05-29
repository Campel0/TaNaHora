-- Script de Criação do Banco de Dados PostgreSQL (TaNaHora)
-- Execute este script no painel SQL do seu NeonDB

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS medicamentos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    dosagem VARCHAR(100) NOT NULL,
    intervalo VARCHAR(50) NOT NULL,
    hora_inicio VARCHAR(5) NOT NULL,
    horarios TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS historico (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    medicamento_id INTEGER NOT NULL REFERENCES medicamentos(id) ON DELETE CASCADE,
    medicamento VARCHAR(255) NOT NULL,
    data VARCHAR(20) NOT NULL,
    hora VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Tomado', 'Pular'))
);
