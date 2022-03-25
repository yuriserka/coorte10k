const { Router } = require("express");
const dataModel = require("../models/data");
const dictionaryModel = require("../models/dictionary");
const labelsModel = require("../models/label");

const router = Router();

router.get("/dict", async (_req, res) => {
  const result = await dictionaryModel.find({
    disponibilidade: 1,
    variavel: "cod_destino_lixo_domic_fam_eq",
  });

  return res.json({
    size: result.length,
    result,
  });
});

router.get("/labels/:varName", async (req, res) => {
  const { varName } = req.params;
  const result = await labelsModel.find({ variavel: varName });
  return res.json({
    size: result.length,
    result,
  });
});

router.get("/data/:varName", async (req, res) => {
  const { varName } = req.params;
  const result = await dataModel.find({ variavel: varName });

  return res.json({
    size: result.length,
    result,
  });
});

module.exports = router;
