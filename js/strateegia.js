"use strict";

// Armazenar as opções atuais
var options = {
  evaluation_bar: true,
  depth_bar: true,
  show_hints: true,
  move_analysis: true
};


// Função para criar opções na tela
function createOptions() {
  var optionsDiv = document.createElement('div');
  optionsDiv.id = 'optionsDiv';

  var evalBarOption = createOption('evaluation_bar', 'Show Evaluation Bar');
  var depthBarOption = createOption('depth_bar', 'Show Depth Bar');
  var showHintsOption = createOption('show_hints', 'Show Hints');
  var moveAnalysisOption = createOption('move_analysis', 'Enable Move Analysis');

  optionsDiv.appendChild(evalBarOption);
  optionsDiv.appendChild(depthBarOption);
  optionsDiv.appendChild(showHintsOption);
  optionsDiv.appendChild(moveAnalysisOption);

  document.body.appendChild(optionsDiv);
}

// Criando uma classe de GameController
class GameController {
    constructor(options) {
        // Inicializar o GameController com as opções
        this.options = options || {};
    }

    // Método para atualizar as opções
    updateOptions(options) {
        this.options = options;

        // Aqui você pode adicionar código para fazer algo quando as opções são atualizadas,
        // como atualizar o estado do jogo, etc.

        console.log("As opções foram atualizadas: ", this.options);
    }
}
  
// Criando uma instância do GameController
var gameController = new GameController(options);

// Função para criar uma única opção
function createOption(id, label) {
  var optionDiv = document.createElement('div');
  
  var checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = id;
  checkbox.checked = options[id];
  checkbox.onchange = function() {
    options[id] = this.checked;
    // Atualize o GameController com as novas opções aqui
  }

  var labelElement = document.createElement('label');
  labelElement.htmlFor = id;
  labelElement.textContent = label;

  optionDiv.appendChild(checkbox);
  optionDiv.appendChild(labelElement);
  
  return optionDiv;
}

// Chamada da função para criar opções na tela
createOptions();
