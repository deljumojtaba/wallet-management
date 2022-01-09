import { unlinkSync } from 'fs';

export const unlinkFile = (path: string, fileName: string | string[]) => {
  try {
    unlinkSync(`./uploads/${path}/${fileName}`);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
