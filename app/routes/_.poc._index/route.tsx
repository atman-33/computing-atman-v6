import { Link } from '@remix-run/react';
import { Button } from '~/components/shadcn/ui/button';

interface PocPageInfo {
  link: string;
  description: string;
  target?: string;
}

const pocs: PocPageInfo[] = [
  {
    link: '/api/graphql',
    description: 'Yoga GraphiQL',
    target: '_blank',
  },
  {
    link: '/poc/graphql-auth',
    description: 'GraphQLテスト（Auth）',
  },
  {
    link: '/poc/graphql-query',
    description: 'GraphQLテスト（Query）',
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
        {pocs.map((poc) => (
          <div key={poc.link}>
            {poc.target === '_blank' ? (
              <a href={poc.link} target="_blank" rel="noopener noreferrer">
                <Button variant="default" className="w-[50dvh] justify-start">
                  {poc.description}
                </Button>
              </a>
            ) : (
              <Link to={poc.link}>
                <Button variant="default" className="w-[50dvh] justify-start">
                  {poc.description}
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default PocPage;
