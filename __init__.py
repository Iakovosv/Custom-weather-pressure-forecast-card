"""The Custom Pressure Sensor integration."""
from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from .sensor import CustomPressureSensor

async def async_setup(hass: HomeAssistant, config: dict):
    """Set up the Custom Pressure Sensor component."""
    hass.data["custom_pressure_sensor"] = {}
    hass.helpers.discovery.load_platform("sensor", "custom_pressure_sensor", {}, config)
    return True
