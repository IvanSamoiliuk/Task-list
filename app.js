const tasks = [
  {
    _id: "5d2ca9e2e03d40b326596aa7",
    completed: false,
    body:
      "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n",
    title: "Eu ea incididunt sunt consectetur fugiat non.",
  },
  // {
  //   _id: "5d2ca9e29c8a94095c1288e0",
  //   completed: false,
  //   body:
  //     "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n",
  //   title:
  //     "Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum.",
  // },
  // {
  //   _id: "5d2ca9e2e03d40b3232496aa7",
  //   completed: true,
  //   body:
  //     "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n",
  //   title: "Eu ea incididunt sunt consectetur fugiat non.",
  // },
  // {
  //   _id: "5d2ca9e29c8a94095564788e0",
  //   completed: false,
  //   body:
  //     "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n",
  //   title:
  //     "Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum.",
  // },
];

(function (arrOfTasks) {
  // UI elements
  const fragment = document.createElement("fragment");
  const tasksList = document.querySelector(".list-group");
  const form = document.forms["addTask"];
  const taskTitle = form.elements["title"];
  const taskBody = form.elements["body"];
  const card = document.querySelector(".card");
  const emptyTaskListMessage = document.createElement("div");
  card.insertAdjacentElement("afterend", emptyTaskListMessage);

  const tasksObj = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  renderTasks(tasksObj);

  // rendering of all tasks
  function renderTasks(tasks) {
    if (!tasks) {
      console.error("Передайте список задач");
      return;
    }

    isEmptyTaskList(tasks);

    Object.values(tasks).forEach((task) => {
      fragment.append(taskTemplate(task));
    });

    tasksList.append(fragment);
  }

  // task item generation
  function taskTemplate({ _id, title, body }) {
    const taskTitle = document.createElement("span");
    taskTitle.textContent = title;
    taskTitle.style.fontWeight = "bold";

    const taskBody = document.createElement("p");
    taskBody.classList.add("mt-2", "w-100");
    taskBody.textContent = body;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "btn-danger", "ml-auto", "delete-btn");
    deleteBtn.textContent = "Delete";

    const completeBtn = document.createElement("button");
    completeBtn.classList.add("btn", "btn-success", "complete-btn");
    completeBtn.textContent = "Complete";

    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "flex-wrap",
      "mt-2"
    );
    li.append(taskTitle);
    li.append(taskBody);
    li.append(completeBtn);
    li.append(deleteBtn);
    li.setAttribute("data-task-id", _id);
    return li;
  }

  // addition of new task

  form.addEventListener("submit", onFormSubmitHandler);

  function onFormSubmitHandler(e) {
    e.preventDefault();

    const titleValue = title.value;
    const bodyValue = body.value;

    if (!titleValue || !bodyValue) {
      alert("Please, enter title and body!");
      return;
    }

    const newTask = createNewTask(titleValue, bodyValue);
    const li = taskTemplate(newTask);
    tasksList.insertAdjacentElement("afterbegin", li);
    form.reset();
  }

  function createNewTask(title, body) {
    const task = {
      _id: `task-${Math.random()}`,
      completed: false,
      title,
      body,
    };
    tasksObj[task._id] = task;
    isEmptyTaskList(tasksObj);
    return { ...task };
  }

  // deleting of task

  tasksList.addEventListener("click", onDeleteHandler);

  function onDeleteHandler(event) {
    if (event.target.classList.contains("delete-btn")) {
      const parentLi = event.target.closest("[data-task-id]");
      const taskId = parentLi.dataset.taskId;
      const confirmed = deleteFromTasksObj(taskId);
      deleteFromHTML(confirmed, parentLi);
    }
  }

  function deleteFromTasksObj(id) {
    const { title } = tasksObj[id];
    const isConfirm = confirm(
      `Are you sure you want to delete the task: '${title}'?`
    );
    if (!isConfirm) return isConfirm;
    delete tasksObj[id];
    isEmptyTaskList(tasksObj);
    return isConfirm;
  }

  function deleteFromHTML(isConfirm, el) {
    if (!isConfirm) return;
    el.remove();
  }

  // check for empty list

  function isEmptyTaskList(tasks) {
    if (Object.keys(tasks).length > 0) {
      emptyTaskListMessage.textContent = "";
    } else {
      emptyTaskListMessage.textContent = "Empty tasklist!";
    }
  }

  // mark completed task

  tasksList.addEventListener("click", onCompleteHandler);

  function onCompleteHandler(event) {
    if (event.target.classList.contains("complete-btn")) {
      const parentLi = event.target.closest("[data-task-id]");
      const taskId = parentLi.dataset.taskId;
      const isCompleted = (tasksObj[taskId].completed = !tasksObj[taskId]
        .completed);
      markCompletedTask(isCompleted, parentLi);
    }
  }

  function markCompletedTask(isComplete, el) {
    if (isComplete) {
      el.style.backgroundColor = "gray";
    } else {
      el.style.backgroundColor = "white";
    }
  }
})(tasks);
