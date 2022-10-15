import { Channel, QueuedQuestion } from "../channel/channel.entity";

// const possibleSchedules = [
//   "Everyday",
//   "Weekdays",
//   "Weekends",
//   "Every Monday",
//   "Every Tuesday",
//   "Every Wednesday",
//   "Every Thursday",
//   "Every Friday",
//   "Every Saturday",
//   "Every Sunday",
// ];

const isScheduleTimePassed = (scheduledTime: Date, currentTime: Date) => {
  return (
    scheduledTime.getHours() > currentTime.getHours() &&
    scheduledTime.getMinutes() > currentTime.getMinutes()
  );
};

const createScheduleDateTimeObject = (time: string) => {
  const date = new Date();
  const timeString = time.split("T")[1];
  const timeArray = timeString.split(":");

  const hours = parseInt(timeArray[0]);
  const minutes = parseInt(timeArray[1]);

  date.setHours(hours);
  date.setMinutes(minutes);

  return date;
};

export const addScheduledDates = async (
  time: string,
  schedule: string,
  questionsQueue: QueuedQuestion[]
) => {
  // remove last 4 characters from time string
  // const scheduledTime = createScheduleDateTimeObject(time);
  const scheduledTime = new Date(time);
  const currentTime = new Date();

  switch (schedule) {
    case "Everyday":
      if (isScheduleTimePassed(scheduledTime, currentTime)) {
        currentTime.setDate(currentTime.getDate() + 1);
      }
      for (let i = 0; i < questionsQueue.length; i++) {
        questionsQueue[i].date = new Date(currentTime.getTime());
        currentTime.setDate(currentTime.getDate() + 1);
      }
      break;
    case "Weekdays":
      if (![0, 6].includes(currentTime.getDay())) {
        if (isScheduleTimePassed(scheduledTime, currentTime)) {
          currentTime.setDate(currentTime.getDate() + 1);
        }
      }
      for (let i = 0; i < questionsQueue.length; i++) {
        if (currentTime.getDay() === 0) {
          currentTime.setDate(currentTime.getDate() + 1);
        } else if (currentTime.getDay() === 6) {
          currentTime.setDate(currentTime.getDate() + 2);
        }
        questionsQueue[i].date = new Date(currentTime.getTime());
        currentTime.setDate(currentTime.getDate() + 1);
      }
      break;
    case "Weekends":
      if ([0, 6].includes(currentTime.getDay())) {
        if (isScheduleTimePassed(scheduledTime, currentTime)) {
          currentTime.setDate(currentTime.getDate() + 1);
        }
      }
      const diff = 6 - currentTime.getDay();
      if (![0, 6].includes(diff)) {
        currentTime.setDate(currentTime.getDate() + diff);
      }
      let isSunday = currentTime.getDay() === 0;
      for (let i = 0; i < questionsQueue.length; i++) {
        if (isSunday) {
          questionsQueue[i].date = new Date(currentTime.getTime());
          currentTime.setDate(currentTime.getDate() + 6);
          isSunday = false;
        } else {
          questionsQueue[i].date = new Date(currentTime.getTime());
          currentTime.setDate(currentTime.getDate() + 1);
          isSunday = true;
        }
      }
      break;

    case "Every Monday":
      if (currentTime.getDay() !== 1) {
        const diffFromSaturday = 6 - currentTime.getDay();
        currentTime.setDate(currentTime.getDate() + diffFromSaturday + 2);
      } else {
        if (isScheduleTimePassed(scheduledTime, currentTime)) {
          currentTime.setDate(currentTime.getDate() + 7);
        }
      }
      for (let i = 0; i < questionsQueue.length; i++) {
        questionsQueue[i].date = new Date(currentTime.getTime());
        currentTime.setDate(currentTime.getDate() + 7);
      }
      break;

    case "Every Tuesday":
      if (currentTime.getDay() !== 2) {
        const diffFromSaturday = 6 - currentTime.getDay();
        currentTime.setDate(currentTime.getDate() + diffFromSaturday + 3);
      } else {
        if (isScheduleTimePassed(scheduledTime, currentTime)) {
          currentTime.setDate(currentTime.getDate() + 7);
        }
      }
      for (let i = 0; i < questionsQueue.length; i++) {
        questionsQueue[i].date = new Date(currentTime.getTime());
        currentTime.setDate(currentTime.getDate() + 7);
      }
      break;

    case "Every Wednesday":
      if (currentTime.getDay() !== 3) {
        const diffFromSaturday = 6 - currentTime.getDay();
        currentTime.setDate(currentTime.getDate() + diffFromSaturday + 4);
      } else {
        if (isScheduleTimePassed(scheduledTime, currentTime)) {
          currentTime.setDate(currentTime.getDate() + 7);
        }
      }
      for (let i = 0; i < questionsQueue.length; i++) {
        questionsQueue[i].date = new Date(currentTime.getTime());
        currentTime.setDate(currentTime.getDate() + 7);
      }
      break;

    case "Every Thursday":
      if (currentTime.getDay() !== 4) {
        const diffFromSaturday = 6 - currentTime.getDay();
        currentTime.setDate(currentTime.getDate() + diffFromSaturday + 5);
      } else {
        if (isScheduleTimePassed(scheduledTime, currentTime)) {
          currentTime.setDate(currentTime.getDate() + 7);
        }
      }
      for (let i = 0; i < questionsQueue.length; i++) {
        questionsQueue[i].date = new Date(currentTime.getTime());
        currentTime.setDate(currentTime.getDate() + 7);
      }
      break;

    case "Every Friday":
      if (currentTime.getDay() !== 5) {
        const diffFromSaturday = 6 - currentTime.getDay();
        currentTime.setDate(currentTime.getDate() + diffFromSaturday + 6);
      } else {
        if (isScheduleTimePassed(scheduledTime, currentTime)) {
          currentTime.setDate(currentTime.getDate() + 7);
        }
      }
      for (let i = 0; i < questionsQueue.length; i++) {
        questionsQueue[i].date = new Date(currentTime.getTime());
        currentTime.setDate(currentTime.getDate() + 7);
      }
      break;

    case "Every Saturday":
      if (currentTime.getDay() !== 6) {
        const diffFromSaturday = 6 - currentTime.getDay();
        currentTime.setDate(currentTime.getDate() + diffFromSaturday);
      } else {
        if (isScheduleTimePassed(scheduledTime, currentTime)) {
          currentTime.setDate(currentTime.getDate() + 7);
        }
      }
      for (let i = 0; i < questionsQueue.length; i++) {
        questionsQueue[i].date = new Date(currentTime.getTime());
        currentTime.setDate(currentTime.getDate() + 7);
      }
      break;

    case "Every Sunday":
      if (currentTime.getDay() !== 0) {
        const diffFromSaturday = 6 - currentTime.getDay();
        currentTime.setDate(currentTime.getDate() + diffFromSaturday + 1);
      } else {
        if (isScheduleTimePassed(scheduledTime, currentTime)) {
          currentTime.setDate(currentTime.getDate() + 7);
        }
      }
      for (let i = 0; i < questionsQueue.length; i++) {
        questionsQueue[i].date = new Date(currentTime.getTime());
        currentTime.setDate(currentTime.getDate() + 7);
      }
      break;

    default:
      break;
  }

  return questionsQueue;
};
