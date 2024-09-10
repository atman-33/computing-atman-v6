# 初期セットアップ

## ステップ

### インストール

- Remixをインストール

```sh
npx create-remix@latest
```

### サーバーのポートを変更（任意）

- ポートはvite.config.tsで設定する

`.env`

```text
PORT=3000
```

`vite.config.ts`

```ts
export default defineConfig({
  server: {
    port: Number(process.env.PORT || 3000),
  },
  // ...
```
