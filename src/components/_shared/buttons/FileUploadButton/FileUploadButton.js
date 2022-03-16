import React, { memo } from 'react';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import Tooltip from '@components/_shared/Tooltip';
import { P12 } from '@components/_shared/text';
import cn from 'classnames';
import { Icons } from '@icons';

import './FileUploadButton.scss';

function FileUploadButton({
	name,
	id,
	title,
	onChange,
	register,
	multiple,
	accept,
	files,
	removeUploadedFile,
	isAdmin,
	classNames,
	iconColor,
	isTooltip,
}) {
	const classes = cn({ 'file-upload-btn': !isAdmin, 'file-upload-btn-admin': isAdmin, [classNames]: !!classNames });
	const addDocumentIcon = Icons.addDocumentIcon(iconColor);

	return (
		<div className='upload-btn-container'>
			{isTooltip
				? <Tooltip
					message={
						<P12 className='black-tooltip'>
						You can upload up to 5 files.
							<br/>
						The maximum file size you
							<br/>
						can upload is 5mb.
						</P12>
					}
				>
					<label
						htmlFor={id}
						className={classes}
					>
						{ isAdmin && <span>{addDocumentIcon}</span> }
						<span>{title}</span>
						<input
							id={id}
							type='file'
							name={name}
							ref={register}
							onChange={onChange}
							multiple={multiple}
							accept={accept}
						/>
					</label>
				</Tooltip>
				: <label
					htmlFor={id}
					className={classes}
				>
					{ isAdmin && <span>{addDocumentIcon}</span> }
					<span>{title}</span>
					<input
						id={id}
						type='file'
						name={name}
						ref={register}
						onChange={onChange}
						multiple={multiple}
						accept={accept}
					/>
				</label>
			}
			<div className='files'>
				{ !!files?.length
					&& files.map(({ id, filename }) => {
						const handleRemoveFile = () => {
							removeUploadedFile(id);
						};

						return (
							<div className='file-name' key={id}>
								<div className='link'>
									<span>{filename}</span>
								</div>
								<span
									className='close-icon'
									onClick={handleRemoveFile}
								>
									{Icons.close()}
								</span>
							</div>
						);
					})
				}
			</div>
		</div>
	);
}

FileUploadButton.defaultProps = {
	title: 'Choose File',
	multiple: false,
	isAdmin: false,
	isTooltip: true,
};

FileUploadButton.propTypes = {
	name: string.isRequired,
	id: string.isRequired,
	title: string,
	onChange: func,
	register: func,
	multiple: bool,
	isAdmin: bool,
	accept: string,
	files: arrayOf(shape({
		name: string,
		id: number,
	})),
	removeUploadedFile: func,
	classNames: string,
	iconColor: string,
	isTooltip: bool,
};

export default memo(FileUploadButton);
