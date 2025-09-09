# OpenAI 语音助手

![项目截图](assets/images/screenshot.png)

一个基于React Native和Expo的智能语音助手应用，支持语音输入、GPT对话和TTS语音输出。

## 功能特性

- 🎙️ 语音识别输入
- 🤖 GPT智能对话
- 🔊 TTS语音输出
- 🎨 现代化UI界面
- 📱 跨平台支持(iOS/Android)

## 快速开始

### 环境要求
- Node.js 18+
- Expo CLI
- Yarn或npm

### 安装步骤
1. 克隆仓库
```bash
git clone https://github.com/yourusername/deepseekchat.git
cd deepseekchat
```

2. 安装依赖
```bash
yarn install
# 或
npm install
```

3. 配置环境变量  
复制`.env.example`为`.env`并填写您的API密钥：
```env
EXPO_PUBLIC_API_BASE_URL=your_api_url_here
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key_here
```

4. 启动开发服务器
```bash
expo start
```

## 开发指南

### 项目结构
```
├── app/               # 主应用入口
├── api/               # API相关代码
├── assets/            # 静态资源
├── components/        # 可复用组件
├── configs/           # 配置文件
└── utils/             # 工具函数
```

### 代码规范
- 使用TypeScript
- 遵循React Hooks最佳实践
- 组件使用PascalCase命名
- 常量使用UPPER_CASE命名

## 安全注意事项

⚠️ **重要**：本项目已移除所有硬编码的敏感信息，但请确保：
1. 不要提交`.env`文件到版本控制
2. 使用环境变量管理所有API密钥
3. 定期轮换生产环境密钥

## 贡献指南

欢迎提交Pull Request！请确保：
1. 代码通过ESLint检查
2. 添加适当的单元测试
3. 更新相关文档

## 许可证

MIT License