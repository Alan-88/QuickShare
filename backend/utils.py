import os
import secrets
import string
from cryptography.fernet import Fernet
from typing import Optional
from dotenv import load_dotenv

# 加载.env文件
load_dotenv()

# 加密工具类
class EncryptionUtils:
    def __init__(self, key: Optional[str] = None):
        """
        初始化加密工具
        :param key: 加密密钥，如果为None则从环境变量获取或生成新密钥
        """
        if key:
            self.key = key.encode()
        else:
            # 从环境变量获取密钥
            key = os.getenv('SECRET_KEY')
            if key:
                self.key = key.encode()
            else:
                # 如果没有环境变量，生成新密钥（仅用于开发）
                self.key = Fernet.generate_key()
                print(f"警告：未设置SECRET_KEY环境变量，使用生成的密钥：{self.key.decode()}")
        
        self.cipher = Fernet(self.key)
    
    def encrypt_text(self, text: str) -> str:
        """
        加密文本
        :param text: 要加密的文本
        :return: 加密后的文本（base64编码）
        """
        if not text:
            return ""
        
        # 将文本编码为bytes，加密，再解码为字符串
        encrypted_data = self.cipher.encrypt(text.encode('utf-8'))
        return encrypted_data.decode('utf-8')
    
    def decrypt_text(self, encrypted_text: str) -> str:
        """
        解密文本
        :param encrypted_text: 加密的文本（base64编码）
        :return: 解密后的文本
        """
        if not encrypted_text:
            return ""
        
        try:
            # 将字符串编码为bytes，解密，再解码为字符串
            decrypted_data = self.cipher.decrypt(encrypted_text.encode('utf-8'))
            return decrypted_data.decode('utf-8')
        except Exception as e:
            raise ValueError(f"解密失败: {str(e)}")

def generate_unique_id(length: int = 8) -> str:
    """
    生成唯一的随机ID
    :param length: ID长度，默认8位
    :return: 随机字符串
    """
    # 使用字母和数字生成随机字符串
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

# 创建全局加密工具实例
encryption_utils = EncryptionUtils()

# 导出函数
def encrypt_text(text: str) -> str:
    """加密文本的便捷函数"""
    return encryption_utils.encrypt_text(text)

def decrypt_text(encrypted_text: str) -> str:
    """解密文本的便捷函数"""
    return encryption_utils.decrypt_text(encrypted_text)
