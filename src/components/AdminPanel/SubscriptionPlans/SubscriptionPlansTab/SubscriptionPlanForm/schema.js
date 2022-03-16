import { object, string } from 'yup';
import { MAX_INPUT_LENGTH_MESSAGE } from '@constants/validationMessages';
import { MAX_INPUT_LENGTH } from '@constants/validationConstants';
import { validateStringIsIntegerOrEmpty } from '@utils/validation';
import { checkIsUniq } from '@utils/checkIsUniq';
import { validationErrMessages } from '@constants/common';

const {
	paymentPlanNameRequired,
	paymentPlanNameExist,
	priceAmountRequired,
	memberGroup,
	trialPeriodRequired,
	trialPeriodInteger,
	stripeNameExist,
	stripeNameRequired,
	enterpriseCode,
	planTypeRequired,
	interval,
	userRoleRequired,
} = validationErrMessages;

const enterpriseSchema = (paymentPlans, isEdit = false) => object({
	name: string()
		.required(paymentPlanNameRequired)
		.default('')
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.test('uniqName', paymentPlanNameExist, value => isEdit || checkIsUniq({
			value,
			existingItems: paymentPlans,
			byField: 'uiName',
		}))
		.trim(),
	planType: object().shape({
		value: string(),
		label: string(),
	})
		.required(planTypeRequired)
		.nullable()
		.default(null),
	priceId: object().shape({
		value: string(),
		label: string(),
	})
		.required(priceAmountRequired)
		.nullable()
		.default(null),
	userRole: object().shape({
		value: string(),
		label: string(),
	})
		.nullable()
		.default(null),
	memberGroupId: object().shape({
		value: string(),
		label: string(),
	})
		.required(memberGroup)
		.nullable()
		.default(null),
	interval: object().shape({
		value: string(),
		label: string(),
	})
		.nullable()
		.required(interval)
		.default(null),
	trial: string()
		.default('')
		.transform(v => !!v ? v : undefined)
		.test('validateTrial', trialPeriodInteger, validateStringIsIntegerOrEmpty)
		.required(trialPeriodRequired),
	stripeName: string()
		.default('')
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.test('uniqStripeName', stripeNameExist, value => isEdit || checkIsUniq({
			value,
			existingItems: paymentPlans,
			byField: 'stripeName',
		}))
		.trim()
		.required(stripeNameRequired),
	enterpriseCode: string()
		.default('')
		.max(20 )
		.test('customIsRequired', enterpriseCode, value => isEdit || (value.length > 0)),
});

const basicSchema = (paymentPlans, isEdit = false, isMultiUser) => object({
	name: string()
		.required(paymentPlanNameRequired)
		.default('')
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.test('uniqName', paymentPlanNameExist, value => isEdit || checkIsUniq({
			value,
			existingItems: paymentPlans,
			byField: 'uiName',
		}))
		.trim(),
	planType: object().shape({
		value: string(),
		label: string(),
	})
		.required(planTypeRequired)
		.nullable()
		.default(null),
	priceId: object().shape({
		value: string(),
		label: string(),
	})
		.required(priceAmountRequired)
		.nullable()
		.default(null),
	userRole: object().shape({
		value: string(),
		label: string(),
	})
		.required(userRoleRequired)
		.nullable()
		.default(null),
	interval: object().shape({
		value: string(),
		label: string(),
	})
		.nullable()
		.required(interval)
		.default(null),
	trial: string()
		.default('')
		.transform(v => !!v ? v : undefined)
		.test('validateTrial', trialPeriodInteger, validateStringIsIntegerOrEmpty)
		.required(trialPeriodRequired),
	stripeName: string()
		.default('')
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.test('uniqStripeName', stripeNameExist, value => isEdit || checkIsUniq({
			value,
			existingItems: paymentPlans,
			byField: 'stripeName',
		}))
		.trim()
		.required(stripeNameRequired),
	memberGroupId: isMultiUser
		? object().shape({
			value: string(),
			label: string(),
		})
			.required(memberGroup)
			.nullable()
			.default(null)
		: object().shape({
			value: string(),
			label: string(),
		})
			.nullable()
			.default(null),
});

export const getSchema = (paymentPlans, state, isEdit) => {
	const { planType } = state;

	if (planType === 'ENTERPRISE') return enterpriseSchema(paymentPlans, isEdit);
	if (planType === 'MULTI_USER') return basicSchema(paymentPlans, isEdit, true);

	return basicSchema(paymentPlans, isEdit);
};

