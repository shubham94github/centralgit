import React, { memo } from 'react';
import { Icons } from '@icons';
import { colors } from '@colors';
import { P14 } from '@components/_shared/text';
import Select from '@components/_shared/form/Select';
import { handleCreateSelectOption } from '@utils/hooks/handleCreateSelectOption';
import { onSelectChange } from '@utils/onSelectChange';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import enums from '@constants/enums';
import { schema } from './schema';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { bool, func } from 'prop-types';

import './StartupAnalysisHeader.scss';

const infoIcon = Icons.infoIcon(colors.grass50);

const StartupAnalysisHeader = ({
	generateReport,
}) => {
	const {
		clearErrors,
		control,
		getValues,
		handleSubmit,
		register,
		setError,
		setValue,
		watch,
	} = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.onTouched,
		reValidateMode: enums.reValidationMode.onChange,
		criteriaMode: enums.criteriaMode.firstError,
		defaultValues: schema.default(),
	});

	const onSubmit = ({ keywords }) => {
		const certainWords = keywords.map(keyword => keyword.value);

		generateReport({ certainWords });
	};

	return (
		<div className='startup-analysis-header'>
			<div className='description'>
				{infoIcon}
				<P14>
					SuperAdmin should be able to analyse and produce a report
					of the registered companies through its given keywords.
				</P14>
			</div>
			<div className='actions'>
				<P14 bold>Keywords</P14>
				<div className='form'>
					<div className='keywords-container'>
						<Select
							control={control}
							id='keywords'
							isClearable={true}
							isCreatable={true}
							isMulti={true}
							handleCreateOpt={handleCreateSelectOption({
								setValue,
								getValues,
								setError,
								clearErrors,
								fieldName: 'keywords',
							})}
							name='keywords'
							onChange={onSelectChange({
								fieldName: 'keywords',
								setValue,
								setError,
								clearErrors,
							})}
							placeholder='Add a keywords'
							register={register}
							menuPlacement='auto'
							isBorder
							createTitle='Add a keyword'
						/>
					</div>
					<PrimaryButton
						onClick={handleSubmit(onSubmit)}
						text='Generate Report'
						disabled={!watch('keywords').length}
					/>
				</div>
			</div>
		</div>
	);
};

StartupAnalysisHeader.propTypes = {
	isLoading: bool.isRequired,
	generateReport: func.isRequired,
};

export default memo(StartupAnalysisHeader);
