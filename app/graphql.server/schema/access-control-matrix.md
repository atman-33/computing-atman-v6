# GraphQL Access Control Matrix

| Operations | Type     | ADMIN | MEMBER | Unauthenticated |
| ---------- | -------- | ----- | ------ | --------------- |
| login      | Mutation | ✅     | ✅      | ✅               |
| logout     | Mutation | ✅     | ✅      | ✅               |
| users      | Query    | ✅     | ❌      | ❌               |
| user       | Query    | ✅     | ✅ (*1) | ❌               |
| createUser | Mutation | ❌     | ❌      | ✅               |
| updateUser | Mutation | ✅     | ✅ (*1) | ❌               |
| deleteUser | Mutation | ✅     | ❌      | ❌               |
| posts      | Query    | ✅     | ✅      | ✅               |
| post       | Query    | ✅     | ✅      | ✅               |
| createPost | Mutation | ✅     | ✅      | ❌               |
| updatePost | Mutation | ✅     | ✅      | ❌               |
| deletePost | Mutation | ✅     | ✅      | ❌               |

- *1: ログインユーザーと同じユーザーの情報のみ取得/操作可能
