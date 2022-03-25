const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    nivel: Number,
    UF: String,
    ano_entrada: Number,
    idade_entrada_cut: Number,
    cod_sexo_pessoa_eq: Number,
    n: Number,
    variavel: String,
  },
  {
    collection: "univariada",
  }
);

const dataModel = mongoose.model("univariada", dataSchema);

module.exports = dataModel;
