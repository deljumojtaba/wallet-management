import { unlinkFile } from 'src/tools/unlinkFile';
import { User } from 'src/user/schema/user.schema';

/* upload and delete old iamge function */
export const uploadImage = (
  file: any,
  inputDto: any,
  path: string,
  data?: object,
): void => {
  inputDto[file.fieldname] = path + '/' + file.filename;

  if (data) deleteOldImage(data, file.fieldname, path);
};

/* delete old files function */
const deleteOldImage = (data: object, file: string, path: string): void => {
  const fileNameFromDb = data[file].split('/')[1];
  const defaultImg = data[file].split('/')[0];
  if (defaultImg !== 'defaults') unlinkFile(path, fileNameFromDb);
};
