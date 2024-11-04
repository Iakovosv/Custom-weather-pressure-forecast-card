from homeassistant.components.sensor import SensorEntity
from homeassistant.const import PRESSURE_HPA

# Αυτή η κλάση αντιπροσωπεύει τον αισθητήρα που θα εμφανίζεται στο HA
class CustomPressureSensor(SensorEntity):
    def __init__(self):
        # Ορίζουμε το όνομα του αισθητήρα και την αρχική του κατάσταση
        self._attr_name = "Custom Pressure Sensor"
        self._attr_native_unit_of_measurement = PRESSURE_HPA  # Χρησιμοποιούμε μονάδα hPa
        self._attr_native_value = None  # Αρχική τιμή, μπορείς να ορίσεις μια προεπιλεγμένη

    @property
    def native_value(self):
        # Αυτή η ιδιότητα επιστρέφει την τρέχουσα τιμή του αισθητήρα
        return self._attr_native_value

    def update(self):
        # Αυτή η μέθοδος θα ενημερώνει την τιμή του αισθητήρα.
        self._attr_native_value = 1000  # Παράδειγμα τιμής
