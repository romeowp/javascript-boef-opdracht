Boef = (function() {
  var emitters = [];
  var sensors = [];
  var rijen = [];

  return {
    plaatsEmitter: function(latitude, longitude) {
      emitters.push({
        latitude: latitude,
        longitude: longitude
      })
    },
    emitters: function() {
      return emitters;
    },
    plaatsSensor: function(latitude, longitude) {
      sensors.push({
        latitude: latitude,
        longitude: longitude,
        afstand: function() {
          var radian = Math.PI / 180;
          var earthDiameter = 12742014;
          var a = 0.5 - Math.cos((emitters[0].latitude - latitude) * radian) / 2 +
            Math.cos(latitude * radian) * Math.cos(emitters[0].latitude * radian) *
            (1 - Math.cos((emitters[0].longitude - longitude) * radian)) / 2;
          return earthDiameter * Math.asin(Math.sqrt(a));
        },
        tijd: undefined,
        pulse: function(tijd) {
          this.tijd = tijd;
        },
        aantalMeterGrondstof: function() {
          var afstand = this.afstand();
          var snelheidGrondstof = 1493;
          var snelheidNormaal = 4176;
          return (this.tijd - afstand / snelheidNormaal) / (1 / snelheidGrondstof - 1 / snelheidNormaal);
        }
      });
    },
    plaatsSensoren: function(latitude, longitude, aantal) {
      for (i = 1; i <= aantal; i++) {
        this.plaatsSensor(
          emitters[0].latitude + (latitude - emitters[0].latitude) * i,
          emitters[0].longitude + (longitude - emitters[0].longitude) * i);
      }
      rijen.push(sensors.slice(sensors.length - aantal));
    },
    sensors: function() {
      return sensors;
    },
    rijen: function() {
      return rijen;
    },
    reset: function() {
      emitters = [];
      sensors = [];
      rijen = []
    }
  };

})();