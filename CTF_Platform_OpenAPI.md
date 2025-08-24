# CTF平台开放接口文档

## 概述

本文档描述了CTF平台的开放接口，这些接口无需身份验证即可访问，主要用于获取公开的题目分类和难度等级信息。

## 基础信息

- **Base URL**: `http://your-domain/api/v1`
- **Content-Type**: `application/json`
- **认证**: 无需认证（开放接口）

## 通用响应格式

所有接口都使用统一的响应格式：

```json
{
  "code": 0,
  "data": {},
  "msg": "string"
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| code | integer | 响应状态码，0表示成功，7表示失败 |
| data | object | 响应数据 |
| msg | string | 响应消息 |

### 分页响应格式

对于分页接口，data字段包含以下结构：

```json
{
  "list": [],
  "total": 0,
  "page": 1,
  "pageSize": 10
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| list | array | 数据列表 |
| total | integer | 总记录数 |
| page | integer | 当前页码 |
| pageSize | integer | 每页大小 |

## 接口列表

### 1. 获取难度等级（开放接口）

获取CTF题目的难度等级信息，支持分页查询。

#### 接口信息

- **接口路径**: `GET /Dl/getDifficultyLevelPublic`
- **接口描述**: 不需要鉴权的难度等级接口
- **请求方式**: GET
- **认证要求**: 无需认证

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| page | integer | 否 | 页码，默认为1 | 1 |
| pageSize | integer | 否 | 每页大小，默认为10，最大100 | 10 |
| createdAtRange[] | array | 否 | 创建时间范围，格式为时间数组 | ["2024-01-01T00:00:00Z", "2024-12-31T23:59:59Z"] |

#### 请求示例

```bash
GET /api/v1/Dl/getDifficultyLevelPublic?page=1&pageSize=20
```

#### 响应示例

**成功响应 (200)**

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 1,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "deletedAt": null,
        "name": "简单",
        "icon": "easy-icon.png",
        "disable": false
      },
      {
        "id": 2,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "deletedAt": null,
        "name": "中等",
        "icon": "medium-icon.png",
        "disable": false
      },
      {
        "id": 3,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "deletedAt": null,
        "name": "困难",
        "icon": "hard-icon.png",
        "disable": false
      }
    ],
    "total": 3,
    "page": 1,
    "pageSize": 20
  },
  "msg": "获取成功"
}
```

**失败响应 (400)**

```json
{
  "code": 7,
  "data": {},
  "msg": "参数错误信息"
}
```

#### 数据模型

**DifficultyLevel**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键ID |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |
| deletedAt | string | 删除时间（软删除） |
| name | string | 难度名称 |
| icon | string | 图标路径 |
| disable | boolean | 是否禁用 |

---

### 2. 获取题目分类（开放接口）

获取CTF题目的分类信息，支持分页查询。

#### 接口信息

- **接口路径**: `GET /Q/getQuestionClassPublic`
- **接口描述**: 不需要鉴权的题目分类接口
- **请求方式**: GET
- **认证要求**: 无需认证

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| page | integer | 否 | 页码，默认为1 | 1 |
| pageSize | integer | 否 | 每页大小，默认为10，最大100 | 10 |
| createdAtRange[] | array | 否 | 创建时间范围，格式为时间数组 | ["2024-01-01T00:00:00Z", "2024-12-31T23:59:59Z"] |

#### 请求示例

```bash
GET /api/v1/Q/getQuestionClassPublic?page=1&pageSize=20
```

#### 响应示例

**成功响应 (200)**

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 1,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "deletedAt": null,
        "name": "Web安全",
        "icon": "web-icon.png",
        "disable": false
      },
      {
        "id": 2,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "deletedAt": null,
        "name": "逆向工程",
        "icon": "reverse-icon.png",
        "disable": false
      },
      {
        "id": 3,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "deletedAt": null,
        "name": "密码学",
        "icon": "crypto-icon.png",
        "disable": false
      },
      {
        "id": 4,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "deletedAt": null,
        "name": "Pwn",
        "icon": "pwn-icon.png",
        "disable": false
      }
    ],
    "total": 4,
    "page": 1,
    "pageSize": 20
  },
  "msg": "获取成功"
}
```

**失败响应 (400)**

```json
{
  "code": 7,
  "data": {},
  "msg": "参数错误信息"
}
```

#### 数据模型

**QuestionClass**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键ID |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |
| deletedAt | string | 删除时间（软删除） |
| name | string | 分类名称 |
| icon | string | 分类图标路径 |
| disable | boolean | 是否禁用 |

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 7 | 失败 |

## 注意事项

1. **分页限制**: 每页大小最大为100条记录
2. **时间格式**: 时间参数使用ISO 8601格式
3. **软删除**: 已删除的记录不会返回
4. **禁用状态**: 禁用的分类/难度等级仍然会返回，客户端需要根据disable字段判断是否可用
5. **图标路径**: 图标字段返回的是相对路径，需要配合服务器域名使用

## 使用示例

### JavaScript/TypeScript

```typescript
// 获取难度等级
async function getDifficultyLevels(page = 1, pageSize = 20) {
  try {
    const response = await fetch(`/api/v1/Dl/getDifficultyLevelPublic?page=${page}&pageSize=${pageSize}`);
    const data = await response.json();
    
    if (data.code === 0) {
      return data.data;
    } else {
      throw new Error(data.msg);
    }
  } catch (error) {
    console.error('获取难度等级失败:', error);
    throw error;
  }
}

// 获取题目分类
async function getQuestionClasses(page = 1, pageSize = 20) {
  try {
    const response = await fetch(`/api/v1/Q/getQuestionClassPublic?page=${page}&pageSize=${pageSize}`);
    const data = await response.json();
    
    if (data.code === 0) {
      return data.data;
    } else {
      throw new Error(data.msg);
    }
  } catch (error) {
    console.error('获取题目分类失败:', error);
    throw error;
  }
}

// 使用示例
getDifficultyLevels().then(data => {
  console.log('难度等级:', data.list);
  console.log('总数:', data.total);
});

getQuestionClasses().then(data => {
  console.log('题目分类:', data.list);
  console.log('总数:', data.total);
});
```

### Python

```python
import requests

def get_difficulty_levels(page=1, page_size=20):
    """获取难度等级"""
    url = f"/api/v1/Dl/getDifficultyLevelPublic"
    params = {"page": page, "pageSize": page_size}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        if data["code"] == 0:
            return data["data"]
        else:
            raise Exception(data["msg"])
    except Exception as e:
        print(f"获取难度等级失败: {e}")
        raise

def get_question_classes(page=1, page_size=20):
    """获取题目分类"""
    url = f"/api/v1/Q/getQuestionClassPublic"
    params = {"page": page, "pageSize": page_size}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        if data["code"] == 0:
            return data["data"]
        else:
            raise Exception(data["msg"])
    except Exception as e:
        print(f"获取题目分类失败: {e}")
        raise

# 使用示例
if __name__ == "__main__":
    try:
        # 获取难度等级
        difficulty_data = get_difficulty_levels()
        print(f"难度等级数量: {difficulty_data['total']}")
        for level in difficulty_data['list']:
            print(f"- {level['name']}: {level['icon']}")
        
        # 获取题目分类
        class_data = get_question_classes()
        print(f"题目分类数量: {class_data['total']}")
        for category in class_data['list']:
            print(f"- {category['name']}: {category['icon']}")
            
    except Exception as e:
        print(f"操作失败: {e}")
```

## 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| 1.0.0 | 2024-01-01 | 初始版本，包含难度等级和题目分类接口 |

---

**文档维护**: 如有问题或建议，请联系开发团队。 