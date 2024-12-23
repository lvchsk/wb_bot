window.addEventListener("load", async () => {
  const tg = window.Telegram.WebApp;
  tg.expand();

  alert(`Платформа: ${tg.platform}`);
  

  const container = document.getElementById("container");
  container.style.overflow = "auto";
  container.style.height = "80vh";
  container.style.position = "absolute";

  // const userDeviceArray = [
  //   { device: "ios", platform: /iPhone|iPad|Macintosh/ }, // Все Apple устройства
  //   { device: "android", platform: /Android|Symbian|Windows Phone|Tablet OS|Linux|Windows NT/ } // Все остальные
  // ];

  // const platf = navigator.userAgent;

  // function getPlatform() {
  //   for (let i in userDeviceArray) {
  //     if (userDeviceArray[i].platform.test(platf)) {
  //       return userDeviceArray[i].device;
  //     }
  //   }
  //   return "Неизвестная платформа!";
  // }

  // console.log("Ваша платформа: " + getPlatform());
  // const platform = getPlatform()

  const platform = Telegram.WebApp.platform;

  console.log(`Платформа: ${platform}`);

  const initData =
    "query_id=AAFnEKlRAAAAAGcQqVFuPynM&user=%7B%22id%22%3A1370034279%2C%22first_name%22%3A%22PUG%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22mad_pug%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FC4P153sbF5ZKQ0bXj61fro_kpL2AtsdVnAeOQ2veP_Y.svg%22%7D&auth_date=1734346396&signature=tkzPFjA-_u5sC8Jn29G8iy3729vIL8fyHHyALY4aVmsnqtNXcCalZzS4GmnglECiEcO1SdHCgFeJDUHyFiPiCg&hash";

  async function fetchTasks() {
    try {
      const response = await fetch("https://bestx.cam/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ initData, platform }),
      });
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      const tasks = await response.json();
      displayTasks(tasks.projects);
    } catch (error) {
      console.error("Ошибка при получении задач:", error);
    }
  }

  function displayTasks(tasks) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task) => {
      const listItem = document.createElement("li");
      listItem.classList.add("task");

      const taskName = task.name || `Задача ${task.id}`;
      const taskLink = document.createElement("a");
      taskLink.href = `/tasks/${task.id}`;
      taskLink.textContent = "Перейти";

      const taskText = document.createElement("span");
      taskText.textContent = taskName;

      listItem.appendChild(taskText);
      listItem.appendChild(taskLink);

      taskList.appendChild(listItem);
    });
  }

  fetchTasks();

  function highlightActiveLink() {
    const currentPath = window.location.pathname;
    console.log(currentPath);

    const links = document.querySelectorAll(".menu a");
    console.log(links[0].getAttribute("href"));

    links.forEach((link) => {
      if (link.getAttribute("href") === currentPath) {
        console.log("jopa");

        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  highlightActiveLink();
});
