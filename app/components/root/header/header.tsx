import { Link } from '@remix-run/react';

const Header = () => {
  return (
    <header className="my-2 flex justify-center text-xl font-bold">
      <Link to="/">Computing Atman</Link>
    </header>
  );
};

export default Header;
