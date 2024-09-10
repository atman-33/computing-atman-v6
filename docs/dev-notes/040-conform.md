# Conform（Formライブラリ）セットアップ

## 参考URL

- [RemixでFormライブラリ入れるならConformがオススメなんで使ってみてほしい](https://zenn.dev/chimame/articles/b10d7e5f5011f9)

## ステップ

### インストール

```sh
npm install zod @conform-to/react @conform-to/zod
```

### 利用例

`app/routes/todos.new._index/route.tsx`

- 1. スキーマを定義

```tsx
const schema = z.object({
  title: z.string({ required_error: 'Title is required' }),
});
```

- 2. actionを定義

```tsx
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') {
    return json({
      success: false,
      message: 'error!',
      submission: submission.reply(), // NOTE: conformでエラー情報を整形して返している
    });
  }

  const { title } = submission.value;

  await prisma.todo.create({
    data: {
      title,
      done: false,
    },
  });
  return redirect('/todos');
};
```

- 3. アクションデータとフォーム情報を取得

```tsx
  const data = useActionData<typeof action>();
  const [form, { title }] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });
```

- 4. useEffectでアクションデータを処理（任意）

```tsx
  useEffect(() => {
    if (!data) {
      return;
    }
    console.log(data);
    // NOTE: action成功時は下記のように書く
    // if (data.success) {
    //   alert(data.message);
    // }
  }, [data]);
```

- 5. Formにスキーマ情報とエラー表示を設定

```tsx
  return (
    <div className="flex flex-col gap-4">
      <Form method="post" className="bg-lime-2 flex items-end space-x-4" {...getFormProps(form)}>
        <div>
          <Label htmlFor="title">タイトル</Label>
          <Input name="title" id="title" />
        </div>
        <Button type="submit">作成</Button>
      </Form>
      {title.errors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          {title.errors.map((e, index) => (
            <AlertDescription key={index}>
              <p>{e}</p>
            </AlertDescription>
          ))}
        </Alert>
      )}
    </div>
  );
  ```
