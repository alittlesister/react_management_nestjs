// src/common/utils/crypto.util.ts
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoUtil {
  /**
   * MD5 加密
   */
  md5(text: string): string {
    return crypto.createHash('md5').update(text).digest('hex');
  }

  /**
   * SHA256 加密
   */
  sha256(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  /**
   * 生成随机字符串
   * @param length 长度
   */
  randomString(length = 32): string {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }

  /**
   * 生成UUID
   */
  uuid(): string {
    return crypto.randomUUID();
  }

  /**
   * AES 加密
   * @param text 明文
   * @param key 密钥（32位）
   */
  aesEncrypt(text: string, key: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(key.padEnd(32, '0').slice(0, 32)),
      iv,
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * AES 解密
   * @param encryptedText 密文
   * @param key 密钥（32位）
   */
  aesDecrypt(encryptedText: string, key: string): string {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(key.padEnd(32, '0').slice(0, 32)),
      iv,
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Base64 编码
   */
  base64Encode(text: string): string {
    return Buffer.from(text).toString('base64');
  }

  /**
   * Base64 解码
   */
  base64Decode(encoded: string): string {
    return Buffer.from(encoded, 'base64').toString('utf8');
  }

  /**
   * 生成签名
   * @param data 数据对象
   * @param secret 密钥
   */
  sign(data: Record<string, any>, secret: string): string {
    const sortedKeys = Object.keys(data).sort();
    const str = sortedKeys.map((key) => `${key}=${data[key]}`).join('&');
    return this.sha256(str + secret);
  }

  /**
   * 验证签名
   * @param data 数据对象
   * @param signature 签名
   * @param secret 密钥
   */
  verifySign(
    data: Record<string, any>,
    signature: string,
    secret: string,
  ): boolean {
    return this.sign(data, secret) === signature;
  }
}
