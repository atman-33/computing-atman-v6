# GraphQL Access Control Matrix

| Operations     | Type     | ADMIN | MEMBER | Unauthenticated |
| -------------- | -------- | ----- | ------ | --------------- |
| login          | Mutation | ✅     | ✅      | ✅               |
| logout         | Mutation | ✅     | ✅      | ✅               |
| user (*1)      | Query    | ✅     | ✅      | ❌               |
| users (*1)     | Query    | ✅     | ❌      | ❌               |
| createUser     | Mutation | ✅     | ✅      | ✅               |
| updateUser     | Mutation | ✅     | ✅      | ❌               |
| updateUserRole | Mutation | ✅     | ❌      | ❌               |
| deleteUser     | Mutation | ✅     | ❌      | ❌               |
| post           | Query    | ✅     | ✅      | ✅               |
| posts          | Query    | ✅     | ✅      | ✅               |
| createPost     | Mutation | ✅     | ✅      | ❌               |
| updatePost     | Mutation | ✅     | ✅      | ❌               |
| deletePost     | Mutation | ✅     | ✅      | ❌               |

- *1: user.emailは、ログイン状態でのみ取得可能
