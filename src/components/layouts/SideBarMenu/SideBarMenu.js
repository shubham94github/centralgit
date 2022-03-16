import React, { memo, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { arrayOf, bool, shape, string, func } from 'prop-types';
import { colors } from '@colors';
import { connect } from 'react-redux';
import { handleMenuItem, clearStartupFilters, clearRetailerFilters } from '@ducks/admin/actions';
import cn from 'classnames';
import { Icons } from '@icons';
import { filterSideBarMenu } from '@utils/filterSideBarMenu';

import './SideMenuBar.scss';

const getCheckedIcon = color => (Icons.checked(color));

function SideBarMenu({
	menuItems,
	userRole,
	title,
	subTitle,
	isExpandableItems,
	handleMenuItem,
	clearStartupFilters,
	clearRetailerFilters,
	isSettings,
	isCategoryViewPermission,
	isStartupAnalysisPermission,
}) {
	const location = useLocation();
	const history = useHistory();
	const filteredItems = filterSideBarMenu(menuItems, isCategoryViewPermission, isStartupAnalysisPermission, userRole);

	const findActiveMenuItem = useCallback((filteredItems, location) => {
		return filteredItems.reduce((acc, item, i) => {
			if (item.route !== location.pathname) return acc;

			acc = { activeItem: item, index: i };

			return acc;
		}, { activeItem: undefined, index: undefined });
	}, []);

	const { activeItem, index } = findActiveMenuItem(filteredItems, location);

	return (
		<div className='side-bar-menu'>
			<div className='title'>{title}</div>
			<div className='sub-title'>{subTitle}</div>
			<ul className='menu-items'>
				{!isExpandableItems
					? filteredItems.map((item, i) => {
						const isActive = activeItem && activeItem.route === item.route;
						const isPrevStep = i < index;
						const iconColor = isActive
							? colors.grass50
							: isPrevStep ? colors.grass50 : colors.gray20;
						const icon = getCheckedIcon(iconColor);

						return (
							<li key={item.title}>
								{!isSettings
									? <div className={`menu-item${isActive ? ' active' : '' }`}>
										<div className='icon'>{icon}</div>
										<div
											className={cn('menu-title',
												{ 'grass-50-color': isPrevStep },
											)}
										>
											{item.title}
										</div>
									</div>
									: <div className='settings-item'>
										<div className='menu-title'>
											{item.title}
										</div>
										{item.items
											&& <div className='sub-items'>
												{item.items.map(subItem => {
													const isActive = location.pathname === subItem.route;

													const handleClick = e => {
														e.stopPropagation();

														history.push(subItem.route);
													};

													return (
														<div
															className={cn('sub-item',
																{ 'active': isActive },
															)}
															key={subItem.title}
															onClick={handleClick}
														>
															<div className='sub-item-title'>{subItem.title}</div>
														</div>
													);
												})}
											</div>
										}
									</div>
								}
							</li>
						);
					})
					: filteredItems.map((item, i) => {
						const handleExpandItem = () => handleMenuItem(i);
						const itemIcon = item.isExpanded
							? Icons.upArrowIcon(colors.white)
							: Icons.downArrowIcon(colors.white);

						return (
							<li
								className='expandable-menu-item'
								key={`${item.mainTitle}-${i}`}
								onClick={handleExpandItem}
							>
								<div className='expandable-menu-item__main-item'>
									<div className='expandable-menu-item__title'>{item.mainTitle}</div>
									<div className='spacer'/>
									<div className='expandable-menu-item__icon'>
										{itemIcon}
									</div>
								</div>
								{item.isExpanded
									&& <div className='expandable-menu-item__list-items'>
										{
											item.items.map((subItem, i) => {
												const key = `${subItem.title}-${i}`;

												if (subItem.isHidden) return <div key={key}/>;

												const isActive = location.pathname === subItem.route
													|| location.pathname.includes(subItem?.profileRoute);

												const handleClick = e => {
													e.stopPropagation();

													history.push(subItem.route);

													clearStartupFilters();
													clearRetailerFilters();
												};

												return (
													<div
														className={cn('expandable-menu-item__sub-item',
															{ 'active': isActive },
														)}
														key={key}
														onClick={handleClick}
													>
														{subItem.title}
													</div>
												);
											})
										}
									</div>
								}
							</li>
						);
					})
				}
			</ul>
		</div>
	);
}

SideBarMenu.defaultProps = {
	menuItems: [],
	title: '',
	subTitle: '',
	isExpandableItems: false,
	isSettings: false,
};

SideBarMenu.propTypes = {
	menuItems: arrayOf(shape({
		title: string,
		route: string,
		roles: arrayOf(string),
	})),
	userRole: string.isRequired,
	title: string,
	subTitle: string,
	isExpandableItems: bool,
	handleMenuItem: func.isRequired,
	clearStartupFilters: func.isRequired,
	clearRetailerFilters: func.isRequired,
	isSettings: bool,
	isCategoryViewPermission: bool,
	isStartupAnalysisPermission: bool,
};

const mapStateToProps = ({ auth }) => {
	const { listOfPermissions } = auth;

	return {
		isCategoryViewPermission: listOfPermissions?.isCategoryViewPermission,
		isStartupAnalysisPermission: listOfPermissions?.isStartupAnalysisPermission,
	};
};

export default connect(mapStateToProps, {
	handleMenuItem,
	clearStartupFilters,
	clearRetailerFilters,
})(memo(SideBarMenu));
