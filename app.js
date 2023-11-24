const NUMBER_OF_STAGES = 5;

const closeAlert = () => {
  const alert = document.querySelector('.alert');
  alert.classList.add('hidden');
};

const openSetupTasks = () => {
  // expand tasks...
  const setupTasksContainer = document.querySelector('.todo-list');
  const isSetupTasksExpanded = setupTasksContainer.style.maxHeight === '2000px';

  if (isSetupTasksExpanded) {
    setupTasksContainer.style.maxHeight = '120px';
  } else {
    setupTasksContainer.style.maxHeight = '2000px';
  }

  //...then rotate arrow icon
  const arrowIcon = document.querySelector('#todo-list__header--arrow');
  arrowIcon.classList.toggle('rotate-180');
};

const closeAllTasks = setupTasks => {
  setupTasks.forEach(setupTask => {
    if (setupTask.classList.contains('active')) {
      setupTask.classList.add('inactive');
      setupTask.classList.remove('active');
    }
  });
};

const openSetupTask = taskIndex => {
  const setupTasks = document.querySelectorAll('.todo-list__section');
  const clickedTask = setupTasks[taskIndex];

  closeAllTasks(setupTasks);

  // ...then open clicked task
  clickedTask.classList.add('active');
  clickedTask.classList.remove('inactive');
};

const getCompletedTasks = () => {
  let completedTasks = 0;
  const ticks = document.querySelectorAll('.todo-list__section--content--tick');

  for (let i = 0; i < ticks.length; i++) {
    const currentTick = ticks[i];
    if (currentTick.classList.contains('active')) {
      completedTasks += 1;
    }
  }

  return completedTasks;
};

const updateProgress = () => {
  const setupTasks = document.querySelectorAll('.todo-list__section');

  // update progress...
  const progressText = document.querySelector('.todo-list__header--task-completion p');
  progressText.innerText = `${getCompletedTasks().toString()} / ${setupTasks.length} completed`;

  const progressBar = document.querySelector('#tasks-completion');
  progressBar.value = `${(getCompletedTasks() / setupTasks.length) * 100}`;
};

const onUncheck = taskIndex => {
  const indicators = document.querySelectorAll('.todo-list__section--indicators');
  const currentIndicator = indicators[taskIndex];

  currentIndicator.classList.remove('checked');

  updateProgress();
};

const onCheck = taskIndex => {
  const indicators = document.querySelectorAll('.todo-list__section--indicators');
  const currentIndicator = indicators[taskIndex];

  // initiate loading animation...
  currentIndicator.classList.add('loading');

  // ...then check the checkbox after a few seconds
  setTimeout(() => {
    currentIndicator.classList.remove('loading');
    currentIndicator.classList.add('checked');

    const setupTasks = document.querySelectorAll('.todo-list__section');
    closeAllTasks(setupTasks);

    updateProgress();

    // ...then move to next incomplete task
    for (let i = 0; i < indicators.length; i++) {
      if (!indicators[i].classList.contains('checked')) {
        openSetupTask(i);
        break;
      }
    }
  }, 1000);
};

const closeAllPopups = () => {
  const popups = document.querySelectorAll('.popup');

  popups.forEach(popup => {
    popup.classList.remove('active');
  });
};

const showOverlay = () => {
  const overlay = document.querySelector('.overlay');
  overlay?.classList?.add('active');
};

const hideOverlay = () => {
  const overlay = document.querySelector('.overlay');
  overlay?.classList?.remove('active');
};

const toggleOverlay = () => {
  const overlay = document.querySelector('.overlay');
  overlay?.classList?.toggle('active');
};

const toggleNotificationAlerts = () => {
  closeAllPopups();

  const alertDiv = document.querySelector('.notification__alert');
  alertDiv.classList.toggle('active');

  toggleOverlay();
};

const openNotificationAlerts = () => {
  closeAllPopups();

  const alertDiv = document.querySelector('.notification__alert');
  alertDiv.classList.add('active');

  showOverlay();
};

const closeNotificationAlerts = () => {
  const alertDiv = document.querySelector('.notification__alert');
  alertDiv.classList.remove('active');

  hideOverlay();
};

const toggleNotificationMenu = () => {
  closeAllPopups();

  const menu = document.querySelector('.notification__menu');
  menu.classList.toggle('active');

  toggleOverlay();
};

const openNotificationMenu = () => {
  closeAllPopups();

  const menu = document.querySelector('.notification__menu');
  menu.classList.add('active');

  showOverlay();
};

const closeNotificationMenu = () => {
  const menu = document.querySelector('.notification__menu');
  menu.classList.remove('active');

  hideOverlay();
};
