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
    id: 1,
    name: 'Missão 3',
    description: 'Esta é a descrição da Missão 1',
    points: 50,
    completed: false,
  },
  {
    id: 2,
    name: 'Missão 4',
    description: 'Esta é a descrição da Missão 2',
    points: 50,
    completed: false,
  },
  // Adicione mais missões conforme necessário
];

let MissionsAvancado = [
  {
    id: 1,
    name: 'Missão 5',
    description: 'Esta é a descrição da Missão 1',
    points: 50,
    completed: false,
  },
  {
    id: 2,
    name: 'Missão 6',
    description: 'Esta é a descrição da Missão 2',
    points: 50,
    completed: false,
  },
  // Adicione mais missões conforme necessário
];

let Missions = MissionsIniciante;

function getUserLevel() {
  return parseInt(localStorage.getItem('userLevel')) || 1;
}

function updateUserScore(points) {
  const score = parseInt(localStorage.getItem('userScore')) || 0;
  localStorage.setItem('userScore', score + points);

  updateUserLevel();
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


function markMissionCompleted(missionId) {
  const mission = Missions.find((mission) => mission.id === missionId);

  if (mission) {
    mission.completed = true;
    updateUserScore(mission.points);
  }
}

function getScore() {
  return parseInt(localStorage.getItem('userScore')) || 0;
}


function updateUserLevel() {
  let level = localStorage.getItem('userLevel') || '1';
  let score = getScore();
  
  if (score >= 100 && score < 200) {
    level = '2';
    Missions = MissaoIntermediario;
  } else if (score >= 200) {
    level = '3';
    Missions = MissionsAvancado;
  }
  
  localStorage.setItem('userLevel', level);
}

function getLevelString() {
  const level = getUserLevel();

  if (level === '1') {
    return 'Iniciante';
  } else if (level === '2') {
    return 'Intermediário';
  } else if (level === '3') {
    return 'Avançado';
  }

  return 'Nível desconhecido';
}

function loadMissions() {
  const level = getUserLevel();
  switch(level) {
    case 1:
      Missions = MissionsIniciante;
      break;
    case 2:
      Missions = MissaoIntermediario;
      break;
    case 3:
      Missions = MissionsAvancado;
      break;
    default:
      console.error('Unknown level');
      return;
  }


  const missionsContainer = document.getElementById('missions-container');
  const conquestsContainer = document.getElementById('conquests-container');

  missionsContainer.innerHTML = '';
  conquestsContainer.innerHTML = '';

  Missions.forEach((mission) => {
    const listItem = document.createElement('li');
    const checkbox = document.createElement('input');
    const label = document.createElement('label');

    checkbox.type = 'checkbox';
    checkbox.id = 'mission-' + mission.id;
    checkbox.checked = mission.completed;
    checkbox.addEventListener('change', function () {
      onMissionCompleted(mission.id, this.checked);
    });

    label.setAttribute('for', 'mission-' + mission.id);
    label.textContent = mission.name;

    const button = createMissionButton(mission);

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(button);

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
  const missionElement = document.getElementById('mission-' + missionId);
  const listItem = missionElement.parentNode;
  const conquestsContainer = document.getElementById('conquests-container');

  const clonedItem = listItem.cloneNode(true);
  const checkbox = clonedItem.querySelector('input[type="checkbox"]');
  checkbox.parentNode.removeChild(checkbox);

  conquestsContainer.appendChild(clonedItem);

  listItem.parentNode.removeChild(listItem);
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
    updateScore();
  });

  const changeLevelButton = document.getElementById('change-level-button');
  changeLevelButton.addEventListener('click', function () {
    const newLevel = document.getElementById('change-level').value;
    localStorage.setItem('userLevel', newLevel);
    document.getElementById('option-level').value = newLevel;
  });

  document.getElementById('option-level').value = getUserLevel();
  document.getElementById('option-level-value').value = getLevelString();
});
