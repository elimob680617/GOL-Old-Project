import { EntityType, FileInput } from 'src/@types/sections/serverTypes';

interface IFileInformation {
  name: string;
  size: number;
  type: string;
  extension: string;
}

export function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function getFileInformations(file: File): IFileInformation {
  const informations: IFileInformation = { name: '', size: 0, type: '', extension: '' };

  const name = file.name;
  const lastDot = name.lastIndexOf('.');

  informations.name = name.substring(0, lastDot);
  informations.extension = name.substring(lastDot + 1);
  informations.type = file.type;
  informations.size = file.size;

  return informations;
}

export async function getFileInputsInformations(files: File[], entityType: EntityType) {
  const initialFileInput: FileInput = {
    binary: '',
    entityType: EntityType.Test,
    type: '',
    name: '',
    size: 0,
  };

  if (files.length > 0) {
    const unresolvedPromises = files.map(async (file, index) => {
      const fileInput: FileInput = initialFileInput;
      const fileInformations = getFileInformations(file);
      const base64 = await convertToBase64(file);
      fileInput.size = fileInformations.size;
      fileInput.type = fileInformations.extension;
      fileInput.name = fileInformations.name;
      fileInput.binary = base64.split(',')[1];
      fileInput.entityType = entityType;

      return fileInput;
    });

    const fileInputs: FileInput[] = await Promise.all(unresolvedPromises);

    return fileInputs;
  }
  return;
}

export async function getFileInputInformations(file: File, entityType: EntityType) {
  const initialFileInput: FileInput = {
    binary: '',
    entityType: EntityType.Test,
    type: '',
    name: '',
    size: 0,
  };

  const fileInput: FileInput = initialFileInput;
  const fileInformations = getFileInformations(file);
  const base64 = await convertToBase64(file);
  fileInput.size = fileInformations.size;
  fileInput.type = fileInformations.extension;
  fileInput.name = fileInformations.name;
  fileInput.binary = base64;
  fileInput.entityType = entityType;

  return fileInput;
}
