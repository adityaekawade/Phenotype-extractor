#!/usr/bin/env node
const fs = require('fs');

const extractor = require('./extractor');
const processData = require('./processData');

const spawn = require("child_process").spawn;
const exec = require('child_process').exec
const DiseaseNames = require('./DiseaseNamesCleaned.json');
const natural = require('natural');
const FuzzySet = require('fuzzyset.js');
const util= require('util');
const HPO_Terms = require('./HPO_Terms')
const HPO_Phenotypes = require('./HPO_Phenotypes');

const args = process.argv.slice(2)

var fileName = args[0];


fs.readFile(fileName, 'utf-8', ((err, inputData) => {
  // runPhenotypeExtractor(data);
  var processedData = processData(inputData);
  processedData.then(data => {
    // console.log(data)
    var resp = util.inspect(data, { maxArrayLength: null })
    console.log(resp);
    return resp;
  })
}));

function runPhenotypeExtractor(notes){
  var pathToFile = `${__dirname}/lemmet.py`;
  const pythonProcess = spawn('python',[pathToFile, notes]);

  pythonProcess.stdout.on('data', (data) => {
    var decoder = new util.TextDecoder('utf-8');
    var decodedData = decoder.decode(data);
    var processedData = processData(decodedData);
    processedData.then(data => {
      console.log(data)
      return data
    })
  });
}
