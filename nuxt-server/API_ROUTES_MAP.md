# API 路由映射表

本文件记录了从 Express API 到 Nuxt Server 的路由映射关系。

## 依赖安装

在 Nuxt 项目中需要安装以下依赖：

```bash
npm install lowdb bcryptjs jsonwebtoken redis rss-parser uuid
npm install -D @types/jsonwebtoken
```

## 环境变量

在 `.env` 中添加：

```
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
```

## 路由映射

| Express 原路由 | Nuxt Server 路由 | 方法 | 说明 |
|---|---|---|---|
| `GET /api/auth/me` | `GET /api/auth/me` | GET | 获取当前用户信息 |
| `POST /api/auth/login` | `POST /api/auth/login` | POST | 登录 |
| `POST /api/auth/update_password` | `POST /api/auth/update_password` | POST | 修改密码 |
| `POST /api/auth/update_info` | `POST /api/auth/update_info` | POST | 修改用户信息 |
| `GET /api/personal/get_personal` | `GET /api/personal/get_personal` | GET | 获取个人信息(需认证) |
| `POST /api/personal/update_personal` | `POST /api/personal/update_personal` | POST | 更新个人信息(需认证) |
| `GET /api/articles` | `GET /api/articles` | GET | 获取文章列表 |
| `GET /api/file/list` | `GET /api/file/list` | GET | 获取JSON文件列表(需认证) |
| `GET /api/file/content?file=xxx` | `GET /api/file/content?file=xxx` | GET | 获取JSON文件内容(需认证) |
| `POST /api/file/update` | `POST /api/file/update` | POST | 修改JSON文件(需认证) |
| `POST /api/file/create` | `POST /api/file/create` | POST | 新增JSON文件(需认证) |
| `POST /api/file/delete` | `POST /api/file/delete` | POST | 删除JSON文件(需认证) |
| `GET /api/active/ping` | `GET /api/active/ping` | GET | 心跳(刷新活跃状态) |
| `GET /api/active/count` | `GET /api/active/count` | GET | 获取活跃用户数 |
| `GET /api/home/get_projects` | `GET /api/home/get_projects` | GET | 获取作品集 |
| `GET /api/home/get_message_list` | `GET /api/home/get_message_list` | GET | 获取留言列表 |
| `POST /api/home/add_message` | `POST /api/home/add_message` | POST | 添加留言 |
| `GET /api/home/get_matter_list` | `GET /api/home/get_matter_list` | GET | 获取目标列表 |
| `GET /api/home/get_personal` | `GET /api/home/get_personal` | GET | 获取主页用户信息 |
| `GET /api/home/get_MBTI` | `GET /api/home/get_MBTI` | GET | 获取MBTI信息 |
| `GET /api/home/get_photos` | `GET /api/home/get_photos` | GET | 获取相册 |
| `GET /api/rss?url=xxx` | `GET /api/rss?url=xxx` | GET | RSS订阅解析 |
| `GET /api/message/get_message_list` | `GET /api/message/get_message_list` | GET | 获取留言列表(旧) |
| `POST /api/message/add_message` | `POST /api/message/add_message` | POST | 添加留言(旧) |

## 文件结构

```
server/
├── api/
│   ├── active/
│   │   ├── count.get.ts
│   │   └── ping.get.ts
│   ├── articles/
│   │   └── index.get.ts
│   ├── auth/
│   │   ├── login.post.ts
│   │   ├── me.get.ts
│   │   ├── update_info.post.ts
│   │   └── update_password.post.ts
│   ├── file/
│   │   ├── content.get.ts
│   │   ├── create.post.ts
│   │   ├── delete.post.ts
│   │   ├── list.get.ts
│   │   └── update.post.ts
│   ├── home/
│   │   ├── add_message.post.ts
│   │   ├── get_matter_list.get.ts
│   │   ├── get_MBTI.get.ts
│   │   ├── get_message_list.get.ts
│   │   ├── get_personal.get.ts
│   │   ├── get_photos.get.ts
│   │   └── get_projects.get.ts
│   ├── message/
│   │   ├── add_message.post.ts
│   │   └── get_message_list.get.ts
│   └── rss/
│       └── index.get.ts
├── db/
│   └── json/           # JSON 数据文件存放目录
├── middleware/
│   └── cors.ts         # CORS 中间件
├── types/
│   ├── MBTI.ts
│   ├── matter.ts
│   ├── message.ts
│   ├── personal.ts
│   ├── photos.ts
│   └── user.ts
└── utils/
    ├── auth.ts         # JWT 认证工具
    ├── avatar.ts       # 头像生成工具
    ├── dateUtils.ts    # 日期格式化工具
    ├── db.ts           # lowdb 数据库工具
    └── response.ts     # 统一响应格式
```

## 使用方式

1. 将 `server/` 文件夹整体复制到你的 Nuxt 项目根目录
2. 安装上述依赖
3. 配置环境变量
4. 将原有的 JSON 数据文件复制到 `server/db/json/` 目录下
5. 启动 Nuxt 项目即可
