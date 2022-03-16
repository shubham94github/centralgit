import { client } from './clientApi';
import { singleTonWrapper } from '@utils/singleTonWrapper';
import enums from '@constants/enums';

const { SERVER_URL } = process.env;

export let gettingStartedApi;

class GettingStartedApi {
	constructor(role) {
		const startup = 'startup';
		const retailer = 'retailer';
		let userRole;

		switch (true) {
			case role === enums.userRoles.startup: {
				userRole = startup;
				break;
			}
			case role !== enums.userRoles.startup: {
				userRole = retailer;
				break;
			}
			default: {
				userRole = startup;
				break;
			}
		}

		this.role = userRole;

		this.saveCompanyInfo = data => {
			return client.post(`${SERVER_URL}/v1/${this.role}/getting-started/${
				this.role === 'startup' ? this.role : 'retail'
			}-company-details`, data);
		};

		this.sendAccountInfo = data => {
			return client.post(`${SERVER_URL}/v1/${this.role}/getting-started/account-information`, data);
		};

		this.sendAreasOfInterest = data => {
			return client.post(`${SERVER_URL}/v1/${this.role}/getting-started/areas-of-interest`, data);
		};

		this.sendSectorsOfCompetence = data => {
			return client.post(`${SERVER_URL}/v1/${this.role}/getting-started/${
				this.role === 'startup' ? 'selector-of-competence' : 'company-sectors'
			}`, data);
		};

		this.sendRelatedTags = data => {
			return client.post(`${SERVER_URL}/v1/${this.role}/getting-started/related-tags`, data);
		};

		this.sendBillingInfo = data => {
			return client.post(`${SERVER_URL}/v1/${this.role}/getting-started/billing-details`, data);
		};
	}
}

export default (singleTonWrapper)(GettingStartedApi);
