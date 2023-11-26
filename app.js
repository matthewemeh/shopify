const HIDDEN_CLASS = 'hidden';
const ACTIVE_CLASS = 'active';
const LOADING_CLASS = 'loading';
const CHECKED_CLASS = 'checked';
const INACTIVE_CLASS = 'inactive';

const closeAlert = () => {
  const alert = document.querySelector('.alert');
  alert.classList.add(HIDDEN_CLASS);
};

const openSetupTasks = () => {
  // expand tasks...

  const setupTasksContainer = document.querySelector('.todo-list');
  const isSetupTasksExpanded = setupTasksContainer.style.maxHeight === '2000px';

  const todoListSection = document.querySelector('.todo-list__sections');
  const arrowButton = document.querySelector('#todo-list__header--arrow');

  if (isSetupTasksExpanded) {
    setupTasksContainer.style.maxHeight = '140px';
    todoListSection.classList.add(HIDDEN_CLASS);

    arrowButton.setAttribute('aria-expanded', 'false');
    arrowButton.setAttribute('aria-label', 'open setup tasks');
  } else {
    todoListSection.classList.remove(HIDDEN_CLASS);
    setupTasksContainer.style.maxHeight = '2000px';

    arrowButton.setAttribute('aria-expanded', 'true');
    arrowButton.setAttribute('aria-label', 'close setup tasks');
  }

  //...then rotate arrow icon
  const arrowIcon = document.querySelector('#todo-list__header--arrow');
  arrowIcon.classList.toggle('rotate-180');
};

const closeAllTasks = setupTasks => {
  setupTasks.forEach((setupTask, index) => {
    if (setupTask.classList.contains(ACTIVE_CLASS)) {
      setupTask.classList.add(INACTIVE_CLASS);
      setupTask.classList.remove(ACTIVE_CLASS);
    }

    // ...then update aria expanded
    const currentButton = document.querySelectorAll('.todo-list__section--heading')[index];
    currentButton.setAttribute('aria-expanded', 'false');
  });
};

const openSetupTask = taskIndex => {
  const setupTasks = document.querySelectorAll('.todo-list__section');
  const clickedTask = setupTasks[taskIndex];

  closeAllTasks(setupTasks);

  // open clicked task...
  clickedTask.classList.add(ACTIVE_CLASS);
  clickedTask.classList.remove(INACTIVE_CLASS);

  // ...then update aria expanded
  const currentButton = document.querySelectorAll('.todo-list__section--heading')[taskIndex];
  currentButton.setAttribute('aria-expanded', 'true');
};

const getCompletedTasks = () => {
  let completedTasks = 0;
  const indicators = document.querySelectorAll('.todo-list__section--indicators');

  for (let i = 0; i < indicators.length; i++) {
    const currentIndicator = indicators[i];
    if (currentIndicator.classList.contains(CHECKED_CLASS)) {
      completedTasks += 1;
    }
  }

  return completedTasks;
};

const updateProgress = () => {
  const setupTasks = document.querySelectorAll('.todo-list__section--indicators');
  const numberOfTasks = setupTasks.length;
  const completedTasks = getCompletedTasks();

  // update progress...
  const progressText = document.querySelector('.todo-list__header--task-completion p');
  progressText.innerText = `${completedTasks.toString()} / ${numberOfTasks} completed`;

  const progressBar = document.querySelector('#tasks-completion');
  progressBar.value = `${(completedTasks / numberOfTasks) * 100}`;

  // ...then update progress aria text
  const progressAriaText = document.querySelector('#progress-text');
  progressAriaText.setAttribute(
    'aria-label',
    `${completedTasks} out of ${numberOfTasks} steps completed`
  );
};

const moveToNextIncompleteTask = indicators => {
  for (let i = 0; i < indicators.length; i++) {
    if (!indicators[i].classList.contains(CHECKED_CLASS)) {
      openSetupTask(i);
      break;
    }
  }
};

const onUncheck = (taskIndex, taskName = 'checkbox item') => {
  const indicators = document.querySelectorAll('.todo-list__section--indicators');
  const currentIndicator = indicators[taskIndex];

  currentIndicator.classList.remove(CHECKED_CLASS);
  currentIndicator.classList.add(LOADING_CLASS);

  // update checkbox status...
  const indicatorStatus = document.querySelectorAll('.indicator-status');
  const currentIndicatorStatus = indicatorStatus[taskIndex];
  currentIndicatorStatus.ariaLabel = 'Loading. Please wait...';

  // ...then uncheck the checkbox after a few seconds
  setTimeout(() => {
    currentIndicator.classList.remove(LOADING_CLASS);

    const setupTasks = document.querySelectorAll('.todo-list__section');
    closeAllTasks(setupTasks);
    updateProgress();
    moveToNextIncompleteTask(indicators);

    currentIndicatorStatus.ariaLabel = `Successfully marked ${taskName} as not done`;
    currentIndicator.ariaLabel = currentIndicator.ariaLabel.replace('as not done', 'as done');
  }, 1500);
};

const onCheck = (taskIndex, taskName = 'checkbox item') => {
  const indicators = document.querySelectorAll('.todo-list__section--indicators');
  const currentIndicator = indicators[taskIndex];

  // initiate loading animation...
  currentIndicator.classList.add(LOADING_CLASS);

  // ...update checkbox status...
  const indicatorStatus = document.querySelectorAll('.indicator-status');
  const currentIndicatorStatus = indicatorStatus[taskIndex];
  currentIndicatorStatus.ariaLabel = 'Loading. Please wait...';

  // ...then check the checkbox after a few seconds
  setTimeout(() => {
    currentIndicator.classList.remove(LOADING_CLASS);
    currentIndicator.classList.add(CHECKED_CLASS);

    const setupTasks = document.querySelectorAll('.todo-list__section');
    closeAllTasks(setupTasks);
    updateProgress();
    moveToNextIncompleteTask(indicators);

    currentIndicatorStatus.ariaLabel = `Successfully marked ${taskName} as done`;
    currentIndicator.ariaLabel = currentIndicator.ariaLabel.replace('as done', 'as not done');
  }, 1500);
};

const closeAllPopups = (exceptClass = '') => {
  const popups = document.querySelectorAll('.popup');

  popups.forEach(popup => {
    if (!popup.classList.contains(exceptClass)) {
      popup.classList.remove(ACTIVE_CLASS);
    }
  });

  hideOverlay();
};

const showOverlay = () => {
  const overlay = document.querySelector('.overlay');
  overlay?.classList?.add(ACTIVE_CLASS);
};

const hideOverlay = () => {
  const overlay = document.querySelector('.overlay');
  overlay?.classList?.remove(ACTIVE_CLASS);
};

const toggleOverlay = () => {
  // check for any open popups and then show overlay
  const popups = document.querySelectorAll('.popup');

  for (let i = 0; i < popups.length; i++) {
    if (popups[i].classList.contains(ACTIVE_CLASS)) {
      showOverlay();
      return;
    }
  }

  hideOverlay();
};

const toggleAriaExpanded = element => {
  if (element.getAttribute('aria-expanded') === 'true') {
    element.setAttribute('aria-expanded', 'false');
  } else if (element.getAttribute('aria-expanded') === 'false') {
    element.setAttribute('aria-expanded', 'true');
  }
};

const toggleNotificationAlerts = event => {
  const alertDiv = document.querySelector('.notification__alert');
  alertDiv.classList.toggle(ACTIVE_CLASS);

  const notificationBell = event.currentTarget;
  toggleAriaExpanded(notificationBell);

  closeAllPopups('notification__alert');
  toggleOverlay();
};

const toggleNotificationMenu = event => {
  const menu = document.querySelector('.notification__menu');
  menu.classList.toggle(ACTIVE_CLASS);

  const profileButton = event.currentTarget;
  toggleAriaExpanded(profileButton);

  closeAllPopups('notification__menu');
  toggleOverlay();
};

const highlightFirstMenuItem = menuContainerID => {
  const menuItemIdentifier = `#${menuContainerID} [role=menuitem]`;
  const menuItems = document.querySelectorAll(menuItemIdentifier);

  menuItems[0].focus();
};

const highlightItem = itemID => {
  const itemIdentifier = `#${itemID}`;
  const item = document.querySelector(itemIdentifier);

  item.focus();
};

window.onload = () => {
  const menuItemIdentifier = `#notification-menu [role=menuitem]`;
  const notificationMenuItems = document.querySelectorAll(menuItemIdentifier);

  notificationMenuItems.forEach((menuItem, index) => {
    menuItem.addEventListener(
      'keydown',
      event => {
        const name = event.key;

        if (name === 'ArrowDown' || name === 'ArrowRight') {
          const nextMenuItem = notificationMenuItems[index + 1];

          if (nextMenuItem) {
            nextMenuItem.focus();
          } else {
            notificationMenuItems[0].focus();
          }
        } else if (name === 'ArrowUp' || name === 'ArrowLeft') {
          const previousMenuItem = notificationMenuItems[index - 1];

          if (previousMenuItem) {
            previousMenuItem.focus();
          } else {
            const lastIndex = notificationMenuItems.length - 1;
            notificationMenuItems[lastIndex].focus();
          }
        }
      },
      false
    );
  });
};
