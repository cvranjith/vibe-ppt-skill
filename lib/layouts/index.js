"use strict";

const { addTitleSlide }       = require("./title-slide");
const { addThreeColumnCards } = require("./three-column");
const { addCardGrid }         = require("./card-grid");
const { addProcessFlow }      = require("./process-flow");
const { addIconRows }         = require("./icon-rows");
const { addStatCallouts }     = require("./stat-callouts");
const { addSplitLayout }      = require("./split-layout");
const { addDarkClosing }      = require("./dark-closing");
const { addArchDiagram }      = require("./arch-diagram");

module.exports = {
  addTitleSlide,
  addThreeColumnCards,
  addCardGrid,
  addProcessFlow,
  addIconRows,
  addStatCallouts,
  addSplitLayout,
  addDarkClosing,
  addArchDiagram,
};
