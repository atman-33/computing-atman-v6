# GraphQL Access Control Matrix

| Operations     | Type     | ADMIN | MEMBER | Unauthenticated |
| -------------- | -------- | ----- | ------ | --------------- |
| login          | Mutation | ✅     | ✅      | ✅               |
| logout         | Mutation | ✅     | ✅      | ✅               |
| user           | Query    | ✅     | ✅      | ❌               |
| users          | Query    | ✅     | ❌      | ❌               |
| createUser     | Mutation | ✅     | ✅      | ✅               |
| updateUser     | Mutation | ✅     | ✅      | ❌               |
| updateUserRole | Mutation | ✅     | ❌      | ❌               |
| deleteUser     | Mutation | ✅     | ❌      | ❌               |
| post           | Query    | ✅     | ✅      | ✅               |
| posts          | Query    | ✅     | ✅      | ✅               |
| createPost     | Mutation | ✅     | ✅      | ❌               |
| updatePost     | Mutation | ✅     | ✅      | ❌               |
| deletePost     | Mutation | ✅     | ✅      | ❌               |
| tag            | Query    | ✅     | ✅      | ✅               |
| tags           | Query    | ✅     | ✅      | ✅               |
| createUser     | Mutation | ✅     | ❌      | ❌               |
| updateUser     | Mutation | ✅     | ❌      | ❌               |
| deleteUser     | Mutation | ✅     | ❌      | ❌               |
