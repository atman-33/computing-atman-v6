import { Link, Outlet } from '@remix-run/react';

const PocLayout = () => {
  return (
    <div className="flex flex-col items-center">
      <Link to="/poc">
        <h2 className="my-4 text-xl font-bold">POC PAGES</h2>
      </Link>
      <Outlet />
    </div>
  );
};

export default PocLayout;
