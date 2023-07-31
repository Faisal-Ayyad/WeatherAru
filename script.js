const messageBar = document.querySelector(".bar-wrapper input");
const sendBtn = document.querySelector(".bar-wrapper button");
const messageBox = document.querySelector(".message-box");

let API_URL = "https://api.openweathermap.org/data/2.5/weather";
let API_KEY = "f1ef5899f6d556f2234ac092568daade";

function sendMessage() {
  if (messageBar.value.length > 0) {
    const UserTypedMessage = messageBar.value.trim();
    messageBar.value = "";

    let message =
      `<div class="chat message">
      <img src="img/user.png">
      <span>
        ${UserTypedMessage}
      </span>
    </div>`;

    let response =
      `<div class="chat response">
      <img src="img/chatbot.png">
      <span class="new">...
      </span>
    </div>`;

    const refreshBtn = document.querySelector("#refreshBtn");

    refreshBtn.onclick = function () {
      location.reload();
    };

    messageBox.insertAdjacentHTML("beforeend", message);

    setTimeout(() => {
      messageBox.insertAdjacentHTML("beforeend", response);

      const words = UserTypedMessage.split(' ');

      const checkWeather = (index) => {
        if (index >= words.length) {
          const ChatBotResponse = document.querySelector(".response .new");
          ChatBotResponse.innerHTML = "I couldn't find a valid city or country name in your message or you have hit the RPM. Please try again or wait one minute.";
          ChatBotResponse.classList.remove("new");
          return;
        }

        const cityQuery = words[index];

        fetch(`${API_URL}?q=${cityQuery}&appid=${API_KEY}`).then(res => res.json()).then(data => {
          if (data.cod === 200) {
            const ChatBotResponse = document.querySelector(".response .new");
            const temperature = (data.main.temp - 273.15).toFixed(2);
            const visibility = (data.visibility / 1000).toFixed(2);
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const pressure = data.main.pressure;
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

            ChatBotResponse.innerHTML = `The weather in ${data.name} is ${data.weather[0].description}. 
            The temperature is ${temperature}°C, visibility is ${visibility} km, humidity is ${humidity}%, wind speed is ${windSpeed} m/s, pressure is ${pressure} hPa.
            Sunrise is at ${sunrise} and sunset is at ${sunset}.`;
            ChatBotResponse.classList.remove("new");
          } else {
            checkWeather(index + 1);
          }
        }).catch((error) => {
          checkWeather(index + 1);
        });
      }

      checkWeather(0);
    }, 100);
  }
}

sendBtn.onclick = sendMessage;

messageBar.addEventListener('keydown', function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});
