import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PaginatedQueryPipe implements PipeTransform {
  private classes: any[];

  constructor(classes: any[]) {
    this.classes = classes;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (!this.classes.includes(metadata.metatype)) return value;

    if (value.page && !isNaN(value.page)) value.page = parseInt(value.page);
    if (value.limit && !isNaN(value.limit)) value.limit = parseInt(value.limit);
    if (value.order) value.order = value.order.toLowerCase();

    return value;
  }
}
