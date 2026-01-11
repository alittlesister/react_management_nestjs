// src/common/pipes/parse-pagination.pipe.ts
import { PipeTransform, Injectable } from '@nestjs/common';
import { PaginationOptions } from '../helpers/pagination.helper';

@Injectable()
export class ParsePaginationPipe
  implements PipeTransform<any, PaginationOptions>
{
  transform(value: any): PaginationOptions {
    const pageNum = Math.max(1, parseInt(value.pageNum, 10) || 1);
    const pageSize = Math.min(
      Math.max(1, parseInt(value.pageSize, 10) || 10),
      100,
    );

    return { pageNum, pageSize };
  }
}
