export const randomize = (min: number = 0, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "admin";
export const ADMIN_TYPE = "admin";
