// src/common/pipes/trim.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  private isObject(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private trim(values: any): any {
    if (this.isObject(values)) {
      if (Array.isArray(values)) {
        return values.map((value) => this.trim(value));
      }

      const trimmed = {};
      Object.keys(values).forEach((key) => {
        trimmed[key] = this.trim(values[key]);
      });
      return trimmed;
    }

    if (typeof values === 'string') {
      return values.trim();
    }

    return values;
  }

  transform(values: any, metadata: ArgumentMetadata): any {
    if (metadata.type === 'body' || metadata.type === 'query') {
      return this.trim(values);
    }
    return values;
  }
}
