import { plainToInstance } from 'class-transformer';

export class GenericMapper<T> {
  private static instances: { [key: string]: GenericMapper<any> } = {};
  private EntityClass: any;

  private constructor(entityClass: new () => T) {
    this.EntityClass = entityClass;
  }

  static getInstance<T>(entityClass: new () => T): GenericMapper<T> {
    const key = entityClass.name;
    if (!GenericMapper.instances[key])
      GenericMapper.instances[key] = new GenericMapper(entityClass);

    return GenericMapper.instances[key];
  }

  toModel = (object: any): T => {
    return plainToInstance(this.EntityClass, object) as T;
  };

  toSchema = (object: any): T => {
    return plainToInstance(this.EntityClass, object, {
      excludeExtraneousValues: true,
    }) as T;
  };

  static toPlain(object: any): any {
    return Object.assign({}, object);
  }
}
