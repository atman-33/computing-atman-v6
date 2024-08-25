# shadcn/uiのセットアップ方法

## ステップ

### インストール

```sh
npx shadcn-ui@latest init
```

```sh
✔ Would you like to use TypeScript (recommended)? … yes
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Where is your global CSS file? … app/tailwind.css
✔ Would you like to use CSS variables for colors? … yes
✔ Are you using a custom tailwind prefix eg. tw-? (Leave blank if not) … 
✔ Where is your tailwind.config.js located? … tailwind.config.js
✔ Configure the import alias for components: … ~/components/shadcn
✔ Configure the import alias for utils: … ~/utils/cn
✔ Are you using React Server Components? … no
✔ Write configuration to components.json. Proceed? … yes
```

## eslint, prettier無視の設定

`..eslintrc.cjs`

- ignorePatternsに、`app/components/ui`を追加

```cjs
/** @type {import('eslint').Linter.Config} */
module.exports = {
  // ...
  ignorePatterns: ['!**/.server', '!**/.client', 'app/components/shadcn/ui'],
  // ...
```

`.prettierignore`

```text
# shadcn/ui
app/components/ui
```
