import { createSignal } from 'solid-js';
import HamburgerMenu from "./HamburgerMenu.jsx";
import NavList from './NavList.jsx';

const Nav = () => {
  const [open, setOpen] = createSignal(false);

  const toggleMenu = () => {
    setOpen(!open());
  };

  return (
    <div class="fixed right-0 navbar flex-col max-w-20 gap-2">
      <HamburgerMenu toggleMenu={toggleMenu}/>
      <NavList open={open()} />
    </div>
  );
};

export default Nav;
