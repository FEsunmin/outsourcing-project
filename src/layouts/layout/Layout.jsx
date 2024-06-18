import { Outlet } from 'react-router-dom';
import '../../index.css';
import NavBar from '../common/NavBar';

const Layout = () => {
  return (
    <div className="flex flex-row">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Layout;