'use strict';

let MissionsIniciante = [
  {
    id: 1,
    name: 'Missão 1',
    description: 'Esta é a descrição da Missão 1',
    points: 50,
    completed: false,
  },
  {
    id: 2,
    name: 'Missão 2',
    description: 'Esta é a descrição da Missão 2',
    points: 50,
    completed: false,
  },
  // Adicione mais missões conforme necessário
];

let MissaoIntermediario = [
  {
    id: 3,
    name: 'Missão 3',
    description: 'Esta é a descrição da Missão 3',
    points: 50,
    completed: false,
  },
  {
    id: 4,
    name: 'Missão 4',
    description: 'Esta é a descrição da Missão 4',
    points: 50,
    completed: false,
  },
  // Adicione mais missões conforme necessário
];

let MissionsAvancado = [
  {
    id: 5,
    name: 'Missão 5',
    description: 'Esta é a descrição da Missão 5',
    points: 50,
    completed: false,
  },
  {
    id: 6,
    name: 'Missão 6',
    description: 'Esta é a descrição da Missão 6',
    points: 50,
    completed: false,
  },
  // Adicione mais missões conforme necessário
];

let Missions = MissionsIniciante;
let ConcludedMissions = [];

function getUserLevel() {
  return parseInt(localStorage.getItem('userLevel')) || 1;
}

function updateUserScore(points) {
  const score = parseInt(localStorage.getItem('userScore')) || 0;
  localStorage.setItem('userScore', score + points);

  updateUserLevel();
  updateScore(); // Adicione essa linha para atualizar os pontos na tela
}

function updateUserLevel() {
  let level = getUserLevel();
  let score = getScore();

  if (score >= 100 && score < 200) {
    level = 2;
    Missions = MissaoIntermediario;
  } else if (score >= 200) {
    level = 3;
    Missions = MissionsAvancado;
  }

  localStorage.setItem('userLevel', level);
}

function getLevelString() {
  const level = getUserLevel();

  if (level === 1) {
    return 'Iniciante';
  } else if (level === 2) {
    return 'Intermediário';
  } else if (level === 3) {
    return 'Avançado';
  }

  return 'Nível desconhecido';
}
function showPointsPopup(points) {
  alert(`Você ganhou ${points} pontos!`);
}

function markMissionCompleted(missionId, completed) {
  const mission = Missions.find((mission) => mission.id === missionId);

  if (mission) {
    mission.completed = completed;
    updateUserScore(completed ? mission.points : -mission.points);
    if (completed) {
      moveMissionToConquests(missionId);
    } else {
      moveMissionToMissions(missionId);
    }
    saveMissions();
    loadMissions();

    updateScore(); // Adicione essa linha para atualizar os pontos na tela

    showPointsPopup(completed ? mission.points : 0);
  }
}

function getScore() {
  return parseInt(localStorage.getItem('userScore')) || 0;
}

function saveMissions() {
  localStorage.setItem('missions', JSON.stringify(Missions));
  localStorage.setItem('concludedMissions', JSON.stringify(ConcludedMissions));
}

function loadMissions() {
  const level = getUserLevel();
  switch (level) {
    case 1:
      Missions =
        JSON.parse(localStorage.getItem('missions')) || MissionsIniciante;
      break;
    case 2:
      Missions =
        JSON.parse(localStorage.getItem('missions')) || MissaoIntermediario;
      break;
    case 3:
      Missions =
        JSON.parse(localStorage.getItem('missions')) || MissionsAvancado;
      break;
    default:
      console.error('Unknown level');
      return;
  }

  ConcludedMissions =
    JSON.parse(localStorage.getItem('concludedMissions')) || [];

  const missionsContainer = document.getElementById('missions-container');
  const conquestsContainer = document.getElementById('conquests-container');

  missionsContainer.innerHTML = '';
  conquestsContainer.innerHTML = '';

  Missions.forEach((mission) => {
    const listItem = document.createElement('li');
    const missionName = document.createElement('span');
    const descriptionButton = document.createElement('button');
    const missionDescription = document.createElement('p');

    missionName.textContent = mission.name;

    if (!mission.completed) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = mission.completed;
      checkbox.addEventListener('change', function () {
        markMissionCompleted(mission.id, this.checked);
      });

      listItem.appendChild(checkbox);
    }

    listItem.appendChild(missionName);

    descriptionButton.textContent = 'Mostrar Descrição';
    descriptionButton.addEventListener('click', function () {
      missionDescription.textContent = mission.description;
    });

    listItem.appendChild(descriptionButton);
    listItem.appendChild(missionDescription);

    if (mission.completed) {
      conquestsContainer.appendChild(listItem);
    } else {
      missionsContainer.appendChild(listItem);
    }
  });

  ConcludedMissions.forEach((mission) => {
    const listItem = document.createElement('li');
    const missionName = document.createElement('span');
    const descriptionButton = document.createElement('button');
    const missionDescription = document.createElement('p');

    missionName.textContent = mission.name;

    listItem.appendChild(missionName);

    descriptionButton.textContent = 'Mostrar Descrição';
    descriptionButton.addEventListener('click', function () {
      missionDescription.textContent = mission.description;
    });

    listItem.appendChild(descriptionButton);
    listItem.appendChild(missionDescription);

    if (mission.completed) {
      conquestsContainer.appendChild(listItem);
    } else {
      missionsContainer.appendChild(listItem);
    }
  });
}

function updateScore() {
  const scoreInput = document.getElementById('option-points');
  const score = getScore();
  scoreInput.value = score;
}

function moveMissionToConquests(missionId) {
  const missionIndex = Missions.findIndex(
    (mission) => mission.id === missionId
  );
  if (missionIndex !== -1) {
    const mission = Missions[missionIndex];
    Missions.splice(missionIndex, 1);
    mission.completed = true;
    ConcludedMissions.push(mission);
  }
}

function moveMissionToMissions(missionId) {
  const missionIndex = ConcludedMissions.findIndex(
    (mission) => mission.id === missionId
  );
  if (missionIndex !== -1) {
    const mission = ConcludedMissions[missionIndex];
    ConcludedMissions.splice(missionIndex, 1);
    mission.completed = false;
    Missions.push(mission);
  }
}

window.addEventListener('DOMContentLoaded', function () {
  loadMissions();
  updateScore();

  const updateButton = document.querySelector('button');
  updateButton.addEventListener('click', function () {
    const missionsContainer = document.getElementById('missions-container');

    Missions.forEach((mission) => {
      const checkbox = document.getElementById('mission-' + mission.id);
      if (checkbox.checked) {
        moveMissionToConquests(mission.id);
      }
    });
    saveMissions();
    updateScore();
    loadMissions();
  });

  const changeLevelButton = document.getElementById('change-level-button');
  changeLevelButton.addEventListener('click', function () {
    const newLevel = document.getElementById('change-level').value;
    localStorage.setItem('userLevel', newLevel);
    document.getElementById('option-level').value = newLevel;
    loadMissions();
  });

  document.getElementById('option-level').value = getUserLevel();
  document.getElementById('option-level-value').value = getLevelString();
});
