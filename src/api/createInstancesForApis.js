import { default as gettingStarted } from '@api/gettingStartedApi';

export function createInstancesForApis(role) {
	gettingStarted.getInstance(role);
}
