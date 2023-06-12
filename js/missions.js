class User {
  constructor(missionManager) {
    this.missionManager = missionManager;   // <- and the property here
    this.level = this.getUserLevel();
    this.score = this.getScore();
  }

  getUserLevel() {
    return parseInt(localStorage.getItem('userLevel')) || 1;
  }

  updateUserLevel() {
    const score = this.getScore();

    if (score >= 100 && score < 200) {
      this.level = 2;
    } else if (score >= 200 && score < 300) {
      this.level = 3;
    } else if (score >= 300) {
      this.level = 4;
    }

    localStorage.setItem('userLevel', this.level);

    this.missionManager.updateMissions(this.level);  // <- update this line
  }

  getScore() {
    return parseInt(localStorage.getItem('userScore')) || 0;
  }

  updateScore(points) {
    this.score += points;
    localStorage.setItem('userScore', this.score);
    this.updateUserLevel();

    if (this.score >= 300) {
      const missionsLabel = document.getElementById('missions-label');
      if (missionsLabel) {
        missionsLabel.style.display = 'none';
      }
    }
  }
}

class Mission {
  constructor(id, name, description, points, completed) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.points = points;
    this.completed = completed;
  }
}

class MissionManager {
  constructor() {
    const userLevel = parseInt(localStorage.getItem('userLevel')) || 1;
    this.missionsIniciante = this.loadMissionsFromLocalStorage('missionsIniciante', [
      new Mission(1, 'Divergindo ideias', 'Faca um ponto de convergência na sua jornada para coletar ideias em uma discussão com a sua equipe!', 25, false),
      new Mission(2, 'Convergir para escolher', 'Lorem Ipsum', 25, false),
      new Mission(3, 'Um aviso para o time', 'Lorem Ipsum', 25, false),
      new Mission(4, 'Compartilhe sua discussao', 'Lorem Ipsum', 25, false)
    ]);

    this.missaoIntermediario = this.loadMissionsFromLocalStorage('missaoIntermediario', [
      new Mission(5, 'Responda um comentario', 'Lorem Ipsum', 25, false),
      new Mission(6, 'Utilize 10 fichas', 'Lorem Ipsum', 25, false),
      new Mission(7, 'Coloque um board para analise', 'Lorem Ipsum', 25, false),
      new Mission(8, 'Crie 5 pontos de convergencia', 'Lorem Ipsum', 25, false)
    ]);

    this.missionsAvancado = this.loadMissionsFromLocalStorage('missionsAvancado', [
      new Mission(9, 'Avalie o app', 'Lorem Ipsum', 25, false),
      new Mission(10, 'Analise um board', 'Lorem Ipsum', 25, false),
      new Mission(11, 'Realize um teste', 'Lorem Ipsum', 50, false)
    ]);

    this.missions = this.loadCurrentMissions(userLevel);
    this.concludedMissions = this.loadMissionsFromLocalStorage('concludedMissions', []);
    this.user = new User(this);
    this.uiManager = new UIManager(this);
  }

  getMissions() {
    return this.missions;
  }

  getConcludedMissions() {
    return this.concludedMissions;
  }

  loadMissionsFromLocalStorage(key, defaultMissions) {
    const savedMissions = localStorage.getItem(key);
    if (savedMissions) {
      return JSON.parse(savedMissions);
    }
    return defaultMissions;
  }
  
  loadCurrentMissions(userLevel) {
    switch (userLevel) {
      case 2:
        return this.missaoIntermediario;
      case 3:
        return this.missionsAvancado;
      default:
        return this.missionsIniciante;
    }
  }

  markMissionCompleted(missionId, completed) {
    const mission = this.missions.find((mission) => mission.id === missionId);

    if (mission) {
      mission.completed = completed;
      const points = completed ? mission.points : -mission.points;
      this.user.updateScore(points);

      if (completed) {
        this.moveMissionToConquests(missionId);
        if (this.checkLevelUp()) {
          this.levelUp();
        }
      } else {
        this.moveMissionToMissions(missionId);
      }

      this.saveMissions(() => {
        this.uiManager.updateScore();
        this.uiManager.loadMissions();
        this.uiManager.showPointsPopup(completed ? mission.points : 0);
      })

      if (this.user.score >= 300) {
        const missionsLabel = document.getElementById('missions-label');
        if (missionsLabel) {
          missionsLabel.style.display = 'none';
        }
      }
    }
  }

  moveMissionToConquests(missionId) {
    const missionIndex = this.missions.findIndex((mission) => mission.id === missionId);

    if (missionIndex !== -1) {
      const mission = this.missions.splice(missionIndex, 1)[0];
      mission.completed = true;
      this.concludedMissions.push(mission);

      // We need to update the local mission arrays
      switch(this.user.level) {
        case 1:
          this.missionsIniciante = this.missionsIniciante.filter((mission) => mission.id !== missionId);
          break;
        case 2:
          this.missaoIntermediario = this.missaoIntermediario.filter((mission) => mission.id !== missionId);
          break;
        case 3:
          this.missionsAvancado = this.missionsAvancado.filter((mission) => mission.id !== missionId);
          break;
      }
    }
  }
  
  moveMissionToMissions(missionId) {
    const missionIndex = this.concludedMissions.findIndex((mission) => mission.id === missionId);

    if (missionIndex !== -1) {
      const mission = this.concludedMissions.splice(missionIndex, 1)[0];
      mission.completed = false;
      this.missions.push(mission);
    }
  }

  checkLevelUp() {
    const nextLevel = this.user.level + 1;

    if (nextLevel === 2 && this.user.score >= 100 && this.user.score < 200) {
      return true;
    } else if (nextLevel === 3 && this.user.score >= 200 && this.user.score < 300) {
      return true;
    } else if (nextLevel === 3 && this.user.score >= 300) {
      return true;
    }

    return false;
  }

  levelUp() {
    const nextLevel = this.user.level + 1;

    switch (nextLevel) {
      case 2:
        this.missions = this.missaoIntermediario;
        break;
      case 3:
        this.missions = this.missionsAvancado;
        break;
    }

    this.user.updateUserLevel();
  }

  updateMissions(level) {
    switch (level) {
      case 2:
        this.missions = this.missaoIntermediario;
        break;
      case 3:
        this.missions = this.missionsAvancado;
        break;
      case 4:
        this.missions = [];
        break;
    }
    this.saveMissions();
  }

  saveMissions(callback) {
    localStorage.setItem('missionsIniciante', JSON.stringify(this.missionsIniciante));
    localStorage.setItem('missaoIntermediario', JSON.stringify(this.missaoIntermediario));
    localStorage.setItem('missionsAvancado', JSON.stringify(this.missionsAvancado));
    localStorage.setItem('concludedMissions', JSON.stringify(this.concludedMissions));

    // Call the callback function after the missions are saved
    if (callback) {
        callback();
    }
}
}

class UIManager {
  constructor(missionManager) {
    this.missionManager = missionManager;
    this.loadMissions();
    this.updateScore();
  }

  createListItem(mission) {
    const listItem = document.createElement('li');
    const missionName = document.createElement('span');
    const descriptionButton = document.createElement('button');
    const missionDescription = document.createElement('p');
    const missionStart = document.createElement('span');
    const missionButton = document.createElement('button');

    missionName.textContent = mission.name;

    if (!mission.completed) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = 'mission-' + mission.id;
      checkbox.checked = mission.completed;
      checkbox.addEventListener('change', () => {
        this.missionManager.markMissionCompleted(mission.id, checkbox.checked);
      });

      listItem.appendChild(checkbox);
    }

    listItem.appendChild(missionName);

    descriptionButton.textContent = '?';
    descriptionButton.addEventListener('click', () => {
      missionDescription.textContent = mission.description;
      missionStart.textContent = 'Inicie o tutorial para uma missao guiada';
      missionButton.textContent = 'Iniciar';
      listItem.appendChild(missionStart);
      listItem.appendChild(missionButton);
    });

    listItem.appendChild(descriptionButton);
    listItem.appendChild(missionDescription);

    return listItem;
  }

  loadMissions() {
    const missionsContainer = document.getElementById('missions-container');
    const conquestsContainer = document.getElementById('conquests-container');

    missionsContainer.innerHTML = '';
    conquestsContainer.innerHTML = '';

    const missions = this.missionManager.getMissions();
    const concludedMissions = this.missionManager.getConcludedMissions();

    missions.forEach((mission) => {
      if (!mission.completed) {
        const listItem = this.createListItem(mission);
        missionsContainer.appendChild(listItem);
      }
    });

    concludedMissions.forEach((mission) => {
      if (mission.completed) {
        const listItem = this.createListItem(mission);
        conquestsContainer.appendChild(listItem);
      }
    });
  }

  updateScore() {
    const scoreInput = document.getElementById('option-points');
    const score = this.missionManager.user.getScore();
    scoreInput.value = score;

    // update the level
    const levelInput = document.getElementById('option-level-value');
    const level = this.missionManager.user.getUserLevel();
    switch(level) {
      case 1:
        levelInput.value = 'Iniciante';
        break;
      case 2:
        levelInput.value = 'Intermediario';
        break;
      case 3:
        levelInput.value = 'Avancado';
        break;
    }
  }

  showPointsPopup(points) {
    alert(`Você ganhou ${points} pontos!`);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const missionManager = new MissionManager();

  const updateButton = document.querySelector('button');
  updateButton.addEventListener('click', () => {
    const missionsToComplete = [];

    const missions = missionManager.getMissions();

    missions.forEach((mission) => {
      const checkbox = document.getElementById('mission-' + mission.id);
      if (checkbox.checked) {
        missionsToComplete.push(mission.id);
      }
    });

    missionsToComplete.forEach((missionId) => {
      missionManager.markMissionCompleted(missionId, true);
    });

    setTimeout(() => {
      missionManager.saveMissions();
      missionManager.uiManager.updateScore();
      missionManager.uiManager.loadMissions();
    }, 2);
  });

});
