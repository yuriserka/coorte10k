const mongoose = require("mongoose");

const dictionarySchema = new mongoose.Schema(
  {
    variavel: String,

    nome: String,
    nome_en: String,

    nome_viz_barras: String,
    nome_viz_mapa: String,
    nome_viz_serie: String,
    nome_viz_barras_en: String,
    nome_viz_mapa_en: String,
    nome_viz_serie_en: String,

    descricao: String,
    descricao_en: String,

    categorias: String,
    categorias_en: String,

    classe: String,
    classe_en: String,

    tipo: String,
    presenca: String,
    origem: String,
    organizacao: String,
    disponibilidade: Number,
    
    perc_preench: Number,
    n_invalidas: Number,
    n_validas: Number,
    n_total: Number,

  },
  {
    collection: "dictionary",
  }
);

const dictionaryModel = mongoose.model("dictionary", dictionarySchema);

module.exports = dictionaryModel;
