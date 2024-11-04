console.info(`%c CUSTOM WEATHER FORECAST CARD \n%c      v2.0`, 'color: orange; font-weight: bold; background: black', 'color: white; font-weight: bold; background: dimgray');

class CustomWeatherForecastCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('Please define an entity');
    }
    if (config.max == null || config.min == null) {
      throw new Error('Please define min and max config options');
    }

    const root = this.shadowRoot;
    if (root.lastChild) root.removeChild(root.lastChild);

    const cardConfig = Object.assign({}, config);
    if (!cardConfig.scale) cardConfig.scale = "50px";

    const entityParts = this._splitEntityAndAttribute(cardConfig.entity);
    cardConfig.entity = entityParts.entity;
    if (entityParts.attribute) cardConfig.attribute = entityParts.attribute;

    // Ανάλογα με την πρόβλεψη, αλλάζει η εμφάνιση της κάρτας
    this._forecast = this.getWeatherForecast();

    const card = document.createElement('ha-card');
    const content = document.createElement('div');
    const style = document.createElement('style');

    style.textContent = `
      ha-card {
        --base-unit: ${cardConfig.scale};
        height: calc(var(--base-unit)*3.5);
        position: relative;
        background-color: ${this._forecast.color}; 
      }
      .gauge-data #title {
        color: ${this._forecast.iconColor}; 
      }
      /* υπόλοιπο CSS χωρίς αλλαγές */
    `;

    content.innerHTML = `
      <div class="container">
        <div class="gauge-a"></div>
        <div class="gauge-b"></div>
        <div class="gauge-c" id="gauge"></div>
        <div class="gauge-data">
            <div id="percent"></div>
            <div id="title">${this._forecast.title}</div>
        </div>
      </div>
    `;

    card.appendChild(content);
    card.appendChild(style);
    card.addEventListener('click', event => {
      this._fire('hass-more-info', { entityId: cardConfig.entity });
    });
    root.appendChild(card);
    this._config = cardConfig;
  }

  /**
   * Μέθοδος που επιστρέφει πρόβλεψη καιρού βάσει πίεσης.
   */
  getWeatherForecast() {
    let forecast = { title: 'Unknown', color: 'gray', iconColor: 'white' };
    const pressure = parseFloat(this._entityState);

    if (pressure < 1000) {
      forecast = { title: 'Stormy', color: '#1e3a8a', iconColor: '#ffcc00' };
    } else if (pressure < 1015) {
      forecast = { title: 'Rainy', color: '#2563eb', iconColor: '#4ade80' };
    } else if (pressure < 1025) {
      forecast = { title: 'Cloudy', color: '#cbd5e1', iconColor: '#eab308' };
    } else {
      forecast = { title: 'Sunny', color: '#fef08a', iconColor: '#f97316' };
    }

    return forecast;
  }

  // υπόλοιπος κώδικας χωρίς αλλαγές...

  set hass(hass) {
    const root = this.shadowRoot;
    const config = this._config;

    const entityState = this._getEntityStateValue(hass.states[config.entity], config.attribute);
    if (entityState !== this._entityState) {
      this._entityState = entityState;
      this._forecast = this.getWeatherForecast();  // ενημέρωση πρόβλεψης καιρού
      root.getElementById("percent").textContent = `${entityState} ${config.measurement || ''}`;
      root.getElementById("title").textContent = this._forecast.title;
    }

    root.lastChild.hass = hass;
  }

  // υπόλοιπες μέθοδοι χωρίς αλλαγές...
}

customElements.define('custom-weather-forecast-card', CustomWeatherForecastCard);
