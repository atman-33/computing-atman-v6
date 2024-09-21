import { Link } from '@remix-run/react';
import { Button } from '~/components/shadcn/ui/button';

interface PocPageInfo {
  link: string;
  description: string;
}

const pocs: PocPageInfo[] = [
  {
    link: '/poc/graphql-test',
    description: 'GraphQLテスト',
  },
  {
    link: '/poc/md-edit',
    description: 'マークダウンエディター',
  },
];

const PocPage = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <h2 className="my-4 text-xl font-bold">検証用ページ一覧</h2>
        {pocs.map((poc) => (
          <div key={poc.link}>
            <Link to={poc.link}>
              <Button variant="ghost">{poc.description}</Button>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default PocPage;
