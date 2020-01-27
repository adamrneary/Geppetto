/* eslint-disable */
const { Client } = require('tplink-smarthome-api');

const DEVICE_ALIAS = 'Tent fan';
const MINUTES_PER_DAY = 1440;
const MAX_SYSTEM_SCHEDULES = 31;
const RATIO_ON = 0.2;

const minutesPerCycle = Math.floor(MINUTES_PER_DAY / (MAX_SYSTEM_SCHEDULES / 2));
const offTimeOffset = Math.floor(minutesPerCycle * RATIO_ON);

function separator() {
  console.log('')
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~``')
  console.log('')
}

function setFanSchedule(device) {
  separator();
  device.schedule.deleteAllRules().then(() => {
    separator();
    for (let i = 0; i < MINUTES_PER_DAY; i = i + minutesPerCycle) {
      device.schedule.addRule({
        powerState: true,
        start: i,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      }).then(console.log)
      device.schedule.addRule({
        powerState: false,
        start: i + offTimeOffset,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      }).then(console.log)
    }
  });
}

const client = new Client();
client.startDiscovery().on('device-new', (device) => {
  device.getSysInfo().then((data) => {
    if (data.alias === DEVICE_ALIAS) {
      setFanSchedule(device);
    }
  });
});

