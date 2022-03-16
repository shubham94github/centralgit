import { Routes } from '@routes';
import { Icons } from '@icons';
import { colors } from '@colors';

export const constantsMainMenu = [
	{
		name: 'Mission',
		path: Routes.MISSION,
		icon: Icons.missionIcon(),
		type: 'modal',
		tooltipText: 'Request a bespoke task',
	},
	{
		name: 'Scout Startups',
		path: Routes.BROWSE_PAGE,
		icon: Icons.scoutStartupsIcon(),
		type: 'redirect',
	},
];

export const maxLengthName = 50;

export const settingsIcon = Icons.settingIcon(colors.black);
export const logOutIcon = Icons.logoutIcon(colors.black);
export const logInIcon = Icons.loginIcon();
export const rhLogoHeaderIcon = Icons.rhLogoHeaderIcon();
export const burgerMenuIcon = Icons.burgerMenuIcon();
export const emailIcon = Icons.emailIcon(colors.white);
