import { Link } from '@remix-run/react';
import { Button } from '~/components/shadcn/ui/button';

const LandingPage = () => {
  return (
    <>
      <Link to="poc/md-edit">
        <Button>POC</Button>
      </Link>
    </>
  );
};

export default LandingPage;
