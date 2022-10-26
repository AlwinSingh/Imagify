import React from 'react';
import {
Nav,
NavLink,
Bars,
NavMenu,
NavBtn,
NavBtnLink,
} from './NavbarElements';

const Navbar = () => {
return (
	<>
	<Nav>
		<NavMenu>
		<NavLink to='/cartoonify'>
			Cartoonify Image
		</NavLink>
		<NavLink to='/bgremover'>
			Image Background Remover
		</NavLink>
		</NavMenu>
	</Nav>
	</>
);
};

export default Navbar;