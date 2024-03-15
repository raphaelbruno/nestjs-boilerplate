export const objectToPlain = (object: any): any => {
  if (Array.isArray(object)) return object.map((item) => objectToPlain(item));

  if (typeof object === 'object' && object !== null) {
    return Object.keys(object).reduce((plain, key) => {
      plain[key] = objectToPlain(object[key]);
      return plain;
    }, {} as any);
  }

  return object;
};
