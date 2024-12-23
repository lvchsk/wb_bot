window.addEventListener("load", async () => {
  const tg = window.Telegram.WebApp;
  tg.expand();

  const screenWidth = window.innerWidth; // Ширина окна браузера
  const screenHeight = window.innerHeight; // Высота окна браузера

  console.log("Ширина окна: " + screenWidth);
  console.log("Высота окна: " + screenHeight);

  const screenWidth2 = screen.width; // Ширина экрана устройства
  const screenHeight2 = screen.height; // Высота экрана устройства

  console.log("Ширина экрана устройства: " + screenWidth2);
  console.log("Высота экрана устройства: " + screenHeight2);

  const giftCooldown = 24 * 60 * 60 * 1000; // 24 часа

  // const initData = tg.initData;
  
  const initData =
    "query_id=AAFnEKlRAAAAAGcQqVFuPynM&user=%7B%22id%22%3A1370034279%2C%22first_name%22%3A%22PUG%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22mad_pug%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FC4P153sbF5ZKQ0bXj61fro_kpL2AtsdVnAeOQ2veP_Y.svg%22%7D&auth_date=1734346396&signature=tkzPFjA-_u5sC8Jn29G8iy3729vIL8fyHHyALY4aVmsnqtNXcCalZzS4GmnglECiEcO1SdHCgFeJDUHyFiPiCg&hash";

  const loading = document.getElementById("loading");
  loading.style.display = "flex";

  let spins = 0;
  let referralLink = "";
  let nextGiftTime;

  try {
    const response = await fetch("https://bestx.cam/webapp-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ initData }),
    });

    if (!response.ok) {
      throw new Error(`Server returned code ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      spins = data.spins;

      const [datePart, timePart] = data.registrationDate.split("_");
      const [day, month, year] = datePart.split(":");
      const registrationDate = new Date(`${year}-${month}-${day}T${timePart}`);
      nextGiftTime = new Date(registrationDate.getTime() + giftCooldown);
    }
  } catch (err) {
    console.error("Ошибка при получении данных:", err);
    alert("Ошибка при загрузке данных. Попробуйте позже.");
  } finally {
    loading.style.display = "none";
  }

  function updateSpinsDisplay() {
    document.getElementById("spinsRemaining").innerText = `${spins} Вращений`;
  }

  updateSpinsDisplay();

  const giftButton = document.getElementById("giftButton");
  const timerElement = document.getElementById("timer");

  function updateTimer() {
    const now = new Date();
    const diff = nextGiftTime - now;

    if (diff <= 0) {
      timerElement.innerText = "0:00";
      giftButton.disabled = false;
      giftButton.innerText = "Получить подарок";
      clearInterval(timerInterval);
    } else {
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      timerElement.innerText = `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    }
  }

  const timerInterval = setInterval(updateTimer, 1000);
  updateTimer();

  giftButton.addEventListener("click", async () => {
    try {
      const response = await fetch("https://bestx.cam/plusgift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ initData }),
      });

      if (!response.ok) {
        throw new Error(`Server returned code ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        nextGiftTime = new Date(new Date().getTime() + giftCooldown); // Устанавливаем новое время ожидания
        spins += 1;
        updateSpinsDisplay();
        giftButton.disabled = true;
        // giftButton.innerText = "Получить подарок можно через: ";
        clearInterval(timerInterval);
        setInterval(updateTimer, 1000);
        updateTimer();
      }
    } catch (error) {
      console.error("Ошибка при запросе подарка:", error);
      alert("Ошибка при запросе подарка. Попробуйте позже.");
    }
  });

  // Функция вращения

  const wheel = document.getElementById("rotatingWheel");
  const wheel2 = document.getElementById("rotatingWheel2");
  const wheel3 = document.getElementById("rotatingWheel3");

  let currentDegree = 0;
  let currentDegree2 = 0;
  let currentDegree3 = 0;

  function rotateWheel(degree) {
    let cum = 360 - degree + 30
    currentDegree += 360 - (currentDegree % 360) + cum;
    currentDegree2 += 360 - (currentDegree2 % 360) + 60;
    currentDegree3 += 360 - (currentDegree3 % 360) + 60;

    function rotateFirst() {
      wheel.style.transform = `rotate(${currentDegree}deg)`;
    }
    function rotateSecond() {
      wheel2.style.transform = `rotate(${currentDegree2}deg)`;
    }
    function rotateThird() {
      wheel3.style.transform = `rotate(${currentDegree3}deg)`;
    }
    setTimeout(rotateFirst, 4000);
    setTimeout(rotateSecond, 2000);
    setTimeout(rotateThird, 200);
  }

  const btnMinus = document.getElementById("btnMinus");

  const modal = document.getElementById("myModal");
  const closeModalButton = document.getElementById("closeModalButton");

  // Закрытие модального окна
  closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Закрытие модального окна при клике вне его
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  async function handleButtonClick() {
    if (btnMinus.disabled) return;
    // event.preventDefault();
    btnMinus.disabled = true;
    console.log("Кнопка нажата!");

    setTimeout(() => {
      btnMinus.disabled = false;
      console.log("Кнопка снова активна");
    }, 7500);

    try {
      const resp = await fetch("https://bestx.cam/update-spins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ initData, operation: "minus" }),
      });

      if (!resp.ok) {
        throw new Error(`Update spins failed with code ${resp.status}`);
      }

      const result = await resp.json();

      if (result.success) {
        spins = result.spins;
        spentSpins = result.spentSpins;
        updateSpinsDisplay();

        // Обновление отображения приза
        const prize = result.prize.value || "";
        const degree = result.prize.degree;
        console.log(prize);

        // Прокрутка
        rotateWheel(degree);

        if (["iphone", "5000", "500"].includes(prize)) {
          setTimeout(() => {
            console.log('Модальное окно открыто');
            modal.style.display = "flex";
          }, 7000);
        }

        document.getElementById(
          "prizeDisplay"
        ).innerText = `Вы выиграли - ${prize} ${degree}`;
      }
    } catch (error) {
      console.error("Ошибка при уменьшении спинов:", error);
      alert("Ошибка при уменьшении спинов. Попробуйте позже.");
    }
  }

  btnMinus.addEventListener("click", handleButtonClick);

  btnMinus.addEventListener("touchstart", handleButtonClick);

  document.getElementById("inviteFriendBtn").addEventListener("click", () => {
    if (tg.openContactPicker) {
      tg.openContactPicker({
        message: `Переходи по ссылке в лучшую Telegram рулетку, вращай и получай купоны от 500₽ до 30000₽ на WB: ${referralLink}`,
      })
        .then((result) => {
          if (result && result.contacts) {
            alert(`Сообщение отправлено ${result.contacts.length} контактам!`);
          } else {
            alert("Отмена выбора контактов.");
          }
        })
        .catch((error) => {
          console.error("Ошибка при открытии контакт-пикера:", error);
          alert("Не удалось открыть список контактов.");
        });
    } else {
      const message = encodeURIComponent(
        `Переходи по ссылке в лучшую Telegram рулетку, вращай и получай купоны от 500₽ до 30000₽ на WB:`
      );
      window.open(
        `https://t.me/share/url?url=${referralLink}&text=${message}`,
        "_blank"
      );
    }
  });

  function highlightActiveLink() {
    // Получаем текущий путь URL
    const currentPath = window.location.pathname;
    console.log(currentPath);

    // Список ссылок
    const links = document.querySelectorAll(".menu a");
    console.log(links[0].getAttribute("href"));

    links.forEach((link) => {
      // Если href совпадает с текущим путем, добавляем класс "active"
      if (link.getAttribute("href") === currentPath) {
        console.log("jopa");

        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Вызываем функцию при загрузке страницы
  highlightActiveLink();
});
