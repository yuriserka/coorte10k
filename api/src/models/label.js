const mongoose = require("mongoose");

const labelsSchema = new mongoose.Schema(
  {
    nivel: Number,
    label: String,
    label_en: String,
    variavel: String,
  },
  {
    collection: "labels",
  }
);

const labelsModel = mongoose.model("labels", labelsSchema);

module.exports = labelsModel;
