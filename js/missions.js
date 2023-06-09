// missions.js
"use strict";

var Missions = [
  {
    id: 1,
    name: "Missão 1",
    description: "Esta é a descrição da Missão 1",
    points: 10,
    completed: false,
  },
  {
    id: 2,
    name: "Missão 2",
    description: "Esta é a descrição da Missão 2",
    points: 20,
    completed: false,
  },
  // adicione mais missões conforme necessário
];

var NiveiDeIntegriade =  [
  {
    id: 1,
    name: "Iniciante",
    descricao: "Pessoas Iniciantes"
  },
  {
    id: 2,
    name: "Intermediário",
    descricao: "Pessoas Intermediárias"
  },
  {
    id: 3,
    name: "Avançado",
    descricao: "Pessoas Avançadas"
  }
]

class InteractMissionAndLevel: {
  function completeMission(missionId) {
    // Encontre a missão pelo ID
    var mission = Missions.find((mission) => mission.id === missionId);

    // Marque a missão como concluída
    if (mission) mission.completed = true;

    // Verifique se o nível do usuário deve ser atualizado
    checkLevelUpgrade();
  }

  function getScore() {
    // Calcule a pontuação total das missões concluídas
    var score = Missions.reduce((total, mission) => {
      if (mission.completed) {
        return total + mission.points;
      } else {
        return total;
      }
    }, 0);

    return score;
  }

  function checkLevelUpgrade() {
    var score = getScore();
    
    // Aqui você pode definir a lógica para atualizar o nível do usuário
    // No exemplo abaixo, o nível do usuário é atualizado para "Médio" quando eles atingem 1000 pontos
    if (score >= 1000) {
      DefaultExtensionOptions2.level = "Médio";
    }

    // Você pode adicionar mais condições para outros níveis aqui
  }

  function verifyChangeNivel() {
    // Aqui vai subir o nível do código. 
  }
}
