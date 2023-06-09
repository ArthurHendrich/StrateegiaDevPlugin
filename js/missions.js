'use strict';

let Missions = [
  {
    id: 1,
    name: 'Missão 1',
    description: 'Esta é a descrição da Missão 1',
    points: 10,
    completed: false,
  },
  {
    id: 2,
    name: 'Missão 2',
    description: 'Esta é a descrição da Missão 2',
    points: 20,
    completed: false,
  },
  // Adicione mais missões conforme necessário
];

function markMissionCompleted(missionId) {
  // Encontre a missão pelo ID
  const mission = Missions.find((mission) => mission.id === missionId);

  // Marque a missão como concluída
  if (mission) {
    mission.completed = true;

    // Atualize a pontuação do usuário
    updateUserScore(mission.points);
  }
}

function updateUserScore(points) {
  // Atualize a pontuação do usuário no armazenamento
  const score = localStorage.getItem('userScore') || 0;
  localStorage.setItem('userScore', parseInt(score) + points);
}

function getScore() {
  // Obtenha a pontuação do usuário do armazenamento
  return parseInt(localStorage.getItem('userScore')) || 0;
}

function getCompletedMissions() {
  return Missions.filter((mission) => mission.completed);
}

function onMissionCompleted(missionId, isChecked) {
  if (isChecked) {
    markMissionCompleted(missionId);
    addPoints(1);
    updateScore();
    moveToConquests(missionId);
  }
}

function moveToConquests(missionId) {
  const missionElement = document.getElementById('mission-' + missionId);
  const listItem = missionElement.parentNode;
  const conquestsContainer = document.getElementById('conquests-container');

  listItem.parentNode.removeChild(listItem);

  conquestsContainer.appendChild(listItem);
}

function loadMissions() {
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

    listItem.appendChild(checkbox);
    listItem.appendChild(label);

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
});
