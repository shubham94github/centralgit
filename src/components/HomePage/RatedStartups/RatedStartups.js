import React, { memo } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'react-bootstrap';
import { H1, H3, P12, P14 } from '@components/_shared/text';
import { Routes } from '@routes';
import { colors } from '@colors';
import { array, func } from 'prop-types';
import Avatar from '@components/_shared/Avatar';
import { setFieldOutsideForFilter, setDefaultFieldForFilter } from '@ducks/browse/action';
import { useHistory } from 'react-router-dom';
import { Icons } from '@icons';

import './RatedStartups.scss';

const RatedStartups = ({
	ratedStartups,
	onClickStartupHandler,
	setFieldOutsideForFilter,
	setDefaultFieldForFilter,
}) => {
	const history = useHistory();

	const onRedirectHandler = () => {
		const data = {
			field: 'sort',
			data: 'Rated',
		};

		setDefaultFieldForFilter();
		setFieldOutsideForFilter(data);
		history.push(Routes.BROWSE_PAGE);
	};

	return (
		<Container className='rated-startups-wrapper' fluid>
			<section className='home-content-container'>
				<Row className='d-flex align-items-center pt-4'>
					<Col className='d-flex justify-content-start'>
						<H1 onClick={onRedirectHandler} className='clickable text-start text__darkblue'>Top Rated</H1>
					</Col>
					<Col className='d-flex justify-content-end'>
						<P14 onClick={onRedirectHandler} className='clickable text__darkblue'>
								See all
							<span className='ps-3'>{Icons.arrowLinkIconMore(colors.darkblue50)}</span>
						</P14>
					</Col>
				</Row>
				<Row>
					{
						ratedStartups.map(startup => {
							const onClickHandler = () => onClickStartupHandler(startup.id);

							return (
								<Col
									className='my-4'
									key={startup.id}
									xs={12}
									sm={6}
									xl={3}
								>
									<Row className='g-3 py-4'>
										<Col className='d-flex'>
											<div
												onClick={onClickHandler}
												className='d-flex justify-content-center img-wrapper-home'
											>
												<Avatar logo={startup.logo120}/>
											</div>
											<div>
												<div className='d-flex justify-content-start'>
													<H3
														className='text__darkblue text-start pb-3'
														bold
													>
														<span
															onClick={onClickHandler}
															className='company-short-name clickable'
														>
															{startup.companyShortName}
														</span>
													</H3>
												</div>
												{!!startup.companyDescription
													&& <P12 className='truncate-text-descriptions'>
														<span>{startup.companyDescription}</span>
													</P12>
												}
											</div>
										</Col>
									</Row>
								</Col>
							);
						})
					}
				</Row>
			</section>
		</Container>
	);
};

RatedStartups.propTypes = {
	ratedStartups: array.isRequired,
	onClickStartupHandler: func,
	setFieldOutsideForFilter: func.isRequired,
	setDefaultFieldForFilter: func.isRequired,
};

export default connect(null, {
	setFieldOutsideForFilter,
	setDefaultFieldForFilter,
})(memo(RatedStartups));
