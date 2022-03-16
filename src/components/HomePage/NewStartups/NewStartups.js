import React, { memo } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'react-bootstrap';
import { v4 as uuid } from 'uuid';
import { H1, H3, P14, P12 } from '@components/_shared/text';
import { Routes } from '@routes';
import { colors } from '@colors';
import { array, func } from 'prop-types';
import Avatar from '@components/_shared/Avatar';
import { setFieldOutsideForFilter, setDefaultFieldForFilter } from '@ducks/browse/action';
import { useHistory } from 'react-router-dom';
import Tooltip from '@components/_shared/Tooltip';
import combineCategoriesByName from '@utils/combineCategoriesByName';
import { Icons } from '@icons';

import './NewStartups.scss';

const NewStartups = ({
	newStartups,
	onClickStartupHandler,
	setFieldOutsideForFilter,
	setDefaultFieldForFilter,
}) => {
	const history = useHistory();

	const onRedirectHandler = () => {
		const data = {
			field: 'sort',
			data: 'Added',
		};

		setDefaultFieldForFilter();
		setFieldOutsideForFilter(data);
		history.push(Routes.BROWSE_PAGE);
	};

	return (
		<Container className='new-startup-wrapper' fluid>
			<section className='home-content-container'>
				<Row className='d-flex align-items-center pt-5'>
					<Col className='d-flex justify-content-start'>
						<H1 onClick={onRedirectHandler} className='clickable text-start text__darkblue'>
							New Startups
						</H1>
					</Col>
					<Col className='d-flex justify-content-end'>
						<P14 onClick={onRedirectHandler} className='clickable text__darkblue'>
								See all
							<span className='ps-3'>{Icons.arrowLinkIconMore(colors.darkblue50)}</span>
						</P14>
					</Col>
				</Row>
				<Row className='py-4'>
					{
						newStartups.map(startup => {
							const onClickHandler = () => onClickStartupHandler(startup.id);
							const combinedCategories = combineCategoriesByName(startup.categories);

							return (
								<Col
									className='my-4'
									key={startup.id}
									xs={12}
									sm={12}
									md={6}
									xxl={4}
								>
									<Row className='g-3'>
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
														className='text__darkblue text-start pb-3 '
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
												<P12 className='mb-1 truncate-text-category' bold>
													{
														combinedCategories.map(({ id, sameItems, name }, index) => (
															!!sameItems?.length
																? <Tooltip
																	key={uuid()}
																	message={
																		<div>
																			{sameItems.map((categoryItem, index) => (
																				<P12 key={categoryItem+index}>
																					<span>
																						{categoryItem}
																					</span>
																					<br/>
																				</P12>
																			)) }
																		</div>
																	}
																>
																	<span key={id}>
																		{index !== 0 && ', '}{name}
																	</span>
																</Tooltip>
																: <span key={id}>
																	{index !== 0 && ', '}{name}
																</span>
														))
													}
												</P12>
												{!!startup.companyDescription
													&& <P12 className='truncate-text'>
														<span className='text-bold'>
															Company Description:&nbsp;
														</span>
														<span>{startup.companyDescription}</span>
													</P12>
												}
												{!!startup.solutionProductsServices && (
													<P12 className='truncate-text'>
														<span className='text-bold'>
														Solutions, products and services:&nbsp;
														</span>
														{startup.solutionProductsServices}
													</P12>
												)}
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

NewStartups.propTypes = {
	newStartups: array.isRequired,
	onClickStartupHandler: func.isRequired,
	setFieldOutsideForFilter: func.isRequired,
	setDefaultFieldForFilter: func.isRequired,
};

export default connect(null, {
	setFieldOutsideForFilter,
	setDefaultFieldForFilter,
})(memo(NewStartups));
