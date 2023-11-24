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

const onCheck = taskIndex => {
  const checkboxes = document.querySelectorAll('.todo-list__section--content--checkmark');
  const clickedCheckbox = checkboxes[taskIndex];

  // initiate loading animation...
  clickedCheckbox.classList.add('checked');

  // ...then check the checkbox after a few seconds
  setTimeout(() => {
    const spinners = document.querySelectorAll('.todo-list__section--content--spinner');
    const currentSpinner = spinners[taskIndex];
    currentSpinner.style.animation = 'none';
    currentSpinner.style.display = 'none';

    const ticks = document.querySelectorAll('.todo-list__section--content--tick');
    const currentTick = ticks[taskIndex];
    currentTick.classList.add('active');

    const setupTasks = document.querySelectorAll('.todo-list__section');
    closeAllTasks(setupTasks);

    // update progress...
    const progressText = document.querySelector('.todo-list__header--task-completion p');
    progressText.innerText = `${getCompletedTasks().toString()} / ${ticks.length} completed`;

    const progressBar = document.querySelector('#tasks-completion');
    progressBar.value = `${(getCompletedTasks() / ticks.length) * 100}`;

    // ...then move to next incomplete task
    for (let i = 0; i < ticks.length; i++) {
      const currentTick = ticks[i];
      if (!currentTick.classList.contains('active')) {
        openSetupTask(i);
        break;
      }
    }
  }, 1500);
};
