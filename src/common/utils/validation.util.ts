// src/common/utils/validation.util.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationUtil {
  /**
   * 验证手机号
   */
  isPhone(phone: string): boolean {
    return /^1[3-9]\d{9}$/.test(phone);
  }

  /**
   * 验证邮箱
   */
  isEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * 验证身份证号
   */
  isIdCard(idCard: string): boolean {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard);
  }

  /**
   * 验证URL
   */
  isUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 验证IP地址
   */
  isIP(ip: string): boolean {
    return /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(
      ip,
    );
  }

  /**
   * 验证中文
   */
  isChinese(str: string): boolean {
    return /^[\u4e00-\u9fa5]+$/.test(str);
  }

  /**
   * 验证英文字母
   */
  isEnglish(str: string): boolean {
    return /^[a-zA-Z]+$/.test(str);
  }

  /**
   * 验证数字
   */
  isNumber(str: string): boolean {
    return /^\d+$/.test(str);
  }

  /**
   * 验证字母数字组合
   */
  isAlphanumeric(str: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(str);
  }

  /**
   * 验证密码强度
   * 至少8位，包含大小写字母、数字和特殊字符
   */
  isStrongPassword(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    );
  }

  /**
   * 验证车牌号
   */
  isCarNumber(carNumber: string): boolean {
    return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/.test(
      carNumber,
    );
  }

  /**
   * 验证银行卡号
   */
  isBankCard(cardNumber: string): boolean {
    return /^[1-9]\d{9,29}$/.test(cardNumber);
  }

  /**
   * 验证QQ号
   */
  isQQ(qq: string): boolean {
    return /^[1-9][0-9]{4,10}$/.test(qq);
  }

  /**
   * 验证微信号
   */
  isWeChat(wechat: string): boolean {
    return /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/.test(wechat);
  }

  /**
   * 验证邮政编码
   */
  isPostalCode(code: string): boolean {
    return /^[1-9]\d{5}$/.test(code);
  }
}
