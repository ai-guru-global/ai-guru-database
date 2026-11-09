package config

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"io"
	"os"
	"os/user"
	"runtime"
)

// deriveKey 从机器特征派生加密密钥（绑定到 hostname + username + OS）
func deriveKey() ([]byte, error) {
	hostname, err := os.Hostname()
	if err != nil {
		hostname = "unknown"
	}
	username := "unknown"
	if u, err := user.Current(); err == nil {
		username = u.Username
	}
	seed := fmt.Sprintf("%s:%s:%s", hostname, username, runtime.GOOS)
	hash := sha256.Sum256([]byte(seed))
	return hash[:], nil
}

// EncryptString 使用 AES-GCM 加密字符串，返回 base64 编码的密文
func EncryptString(plaintext string) (string, error) {
	if plaintext == "" {
		return "", nil
	}

	key, err := deriveKey()
	if err != nil {
		return "", fmt.Errorf("派生密钥失败: %w", err)
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("创建 AES cipher 失败: %w", err)
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("创建 GCM 失败: %w", err)
	}

	nonce := make([]byte, aesGCM.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", fmt.Errorf("生成 nonce 失败: %w", err)
	}

	ciphertext := aesGCM.Seal(nonce, nonce, []byte(plaintext), nil)
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// DecryptString 解密 base64 编码的 AES-GCM 密文
func DecryptString(encoded string) (string, error) {
	if encoded == "" {
		return "", nil
	}

	// 如果不是合法的 base64，视为明文（向后兼容旧配置）
	ciphertext, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		return encoded, nil
	}

	key, err := deriveKey()
	if err != nil {
		return "", fmt.Errorf("派生密钥失败: %w", err)
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("创建 AES cipher 失败: %w", err)
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("创建 GCM 失败: %w", err)
	}

	nonceSize := aesGCM.NonceSize()
	if len(ciphertext) < nonceSize {
		return "", fmt.Errorf("密文长度不足")
	}

	nonce, ciphertextBytes := ciphertext[:nonceSize], ciphertext[nonceSize:]
	plaintext, err := aesGCM.Open(nil, nonce, ciphertextBytes, nil)
	if err != nil {
		// 解密失败，可能是旧的明文配置，原样返回
		return encoded, nil
	}

	return string(plaintext), nil
}
