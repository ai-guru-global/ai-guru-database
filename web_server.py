#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI Guru 知识库 Web 服务器
快速启动: python3 web_server.py
访问地址: http://localhost:8080
"""

import http.server
import json
import os
import sys
from pathlib import Path
from urllib.parse import urlparse, parse_qs

# 项目根目录
BASE_DIR = Path(__file__).parent
WEB_DIR = BASE_DIR / 'web'

# 排除的目录
EXCLUDE_DIRS = {'.git', '.github', '.claude', '.comate', '.qoder', '.obsidian', 
                'web', 'node_modules', '__pycache__'}

def get_md_files():
    """获取所有 Markdown 文件"""
    files = []
    
    for md_file in BASE_DIR.rglob("*.md"):
        rel_path = md_file.relative_to(BASE_DIR)
        parts = rel_path.parts
        
        # 跳过排除的目录
        if any(part.startswith('.') or part in EXCLUDE_DIRS for part in parts):
            continue
        
        try:
            chars = len(md_file.read_text(encoding='utf-8'))
            files.append({
                'path': str(rel_path),
                'name': md_file.stem.replace('_', ' '),
                'chars': chars
            })
        except:
            pass
    
    return sorted(files, key=lambda x: x['path'])


class RequestHandler(http.server.BaseHTTPRequestHandler):
    """HTTP 请求处理器"""
    
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # API: 获取文件列表
        if path == '/api/files':
            self.send_json(get_md_files())
            return
        
        # API: 获取文件内容
        if path == '/api/file':
            params = parse_qs(parsed_path.query)
            file_path = params.get('path', [''])[0]
            
            if not file_path:
                self.send_error(400, 'Missing path parameter')
                return
            
            full_path = BASE_DIR / file_path
            
            if not full_path.exists() or not full_path.is_file():
                self.send_error(404, 'File not found')
                return
            
            try:
                content = full_path.read_text(encoding='utf-8')
                self.send_text(content, 'text/plain; charset=utf-8')
            except Exception as e:
                self.send_error(500, str(e))
            return
        
        # 静态文件
        if path == '/' or path == '/index.html':
            self.serve_file(WEB_DIR / 'index.html', 'text/html')
        else:
            # 尝试提供其他静态文件
            file_path = WEB_DIR / path.lstrip('/')
            if file_path.exists() and file_path.is_file():
                content_type = self.get_content_type(file_path.suffix)
                self.serve_file(file_path, content_type)
            else:
                self.send_error(404, 'Not found')
    
    def serve_file(self, file_path, content_type):
        """提供文件服务"""
        try:
            content = file_path.read_bytes()
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', len(content))
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, str(e))
    
    def get_content_type(self, suffix):
        """获取文件 MIME 类型"""
        types = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
        }
        return types.get(suffix, 'application/octet-stream')
    
    def send_json(self, data):
        """发送 JSON 响应"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
    
    def send_text(self, text, content_type):
        """发送文本响应"""
        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(text.encode('utf-8'))
    
    def log_message(self, format, *args):
        """自定义日志格式"""
        print(f"[{self.log_date_time_string()}] {format % args}")


def main():
    """启动服务器"""
    port = 8080
    
    # 检查端口是否被占用
    try:
        server = http.server.HTTPServer(('0.0.0.0', port), RequestHandler)
    except OSError as e:
        if 'Address already in use' in str(e):
            print(f"❌ 端口 {port} 已被占用，尝试使用端口 {port + 1}")
            try:
                port = port + 1
                server = http.server.HTTPServer(('0.0.0.0', port), RequestHandler)
            except OSError:
                print(f"❌ 端口 {port} 也被占用，请选择其他端口")
                sys.exit(1)
        else:
            raise
    
    print(f"🚀 AI Guru 知识库 Web 服务已启动")
    print(f"📍 访问地址: http://localhost:{port}")
    print(f"📁 文档目录: {BASE_DIR}")
    print(f"📊 文档数量: {len(get_md_files())} 个")
    print(f"\n按 Ctrl+C 停止服务\n")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 服务已停止")
        server.shutdown()


if __name__ == '__main__':
    main()
