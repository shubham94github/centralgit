import React from 'react';
import { string } from 'prop-types';
import LoadingOverlay from '@components/_shared/LoadingOverlay';

const Preloader = ({ title }) => (
	<>
		<div className='preloader-title'>
			{title}
		</div>
		<LoadingOverlay/>
	</>
);

const withSuspense = (Component, title) => props => (
	<React.Suspense
		fallback={<Preloader title={title}/>}
	>
		<Component {...props}/>
	</React.Suspense>
);

Preloader.propTypes = {
	title: string,
};

export default withSuspense;
