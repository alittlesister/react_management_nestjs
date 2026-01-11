// src/common/common.module.ts
import { Module, Global } from '@nestjs/common';

// Utils
import { DateUtil } from './utils/date.util';
import { CryptoUtil } from './utils/crypto.util';
import { StringUtil } from './utils/string.util';
import { NumberUtil } from './utils/number.util';
import { ValidationUtil } from './utils/validation.util';
import { ObjectUtil } from './utils/object.util';
import { PasswordService } from './utils/password';

// Helpers
import { PaginationHelper } from './helpers/pagination.helper';
import { QueryBuilderHelper } from './helpers/query-builder.helper';
import { ResponseHelper } from './helpers/response.helper';
import { TreeHelper } from './helpers/tree.helper';

const utils = [
  DateUtil,
  CryptoUtil,
  StringUtil,
  NumberUtil,
  ValidationUtil,
  ObjectUtil,
  PasswordService,
];

const helpers = [
  PaginationHelper,
  QueryBuilderHelper,
  ResponseHelper,
  TreeHelper,
];

/**
 * 通用模块
 * @Global 装饰器使该模块全局可用
 */
@Global()
@Module({
  providers: [...utils, ...helpers],
  exports: [...utils, ...helpers],
})
export class CommonModule {}
