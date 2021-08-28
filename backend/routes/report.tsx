import express from "express";
const bcrypt = require("bcrypt");
let decodeToken = require("../library/decodeToken");
import _ from "underscore";
let Report = require("../models/report/chatReportModel");
import dotenv from "dotenv";

let app = express.Router();
dotenv.config();

app.get("/getAllReports", async (req, res) => {
  let reports = await Report.find({});

  res.status(200).send(reports);
});

module.exports = app;
