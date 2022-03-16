import React, { memo, useEffect, useRef } from 'react';
import { element, shape, string } from 'prop-types';
import Header from './Header';
import Footer from './Footer';
import { withRouter } from 'react-router-dom';
import { Routes } from '@routes';
import cn from 'classnames';

import './HomeLayout.scss';

const HomeLayout = ({ children, location }) => {
	const homeNode = useRef(null);

	useEffect(() => {
		if (!homeNode.current) return;

		homeNode.current.scrollTo({ left: 0, top: 0 });
	}, [location?.pathname]);

	const classes = cn('home-layout-container', {
		'home-layout-container__without-scroll':
			(location.pathname === Routes.LANDING || location.pathname === Routes.AUTH.SIGN_IN),
		'landing-layout-container': (location.pathname === Routes.LANDING),
	});

	const isLandingPage = location.pathname === Routes.LANDING;

	return (
		<div className={classes} ref={homeNode}>
			{!isLandingPage && <Header/>}
			{children}
			<Footer/>
		</div>
	);
};

HomeLayout.defaultProps = {
	location: {
		pathname: '',
	},
};

HomeLayout.propTypes = {
	children: element.isRequired,
	location: shape({
		pathname: string.isRequired,
	}),
};

export default withRouter(memo(HomeLayout));
