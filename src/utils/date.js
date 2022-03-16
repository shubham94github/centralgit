import { dateFormatCorrection } from '@utils';

export const dateFormattingWithSlash = date => dateFormatCorrection(new Date(date), 'MM/dd/yyyy');

export const fullDateFormatting = date => dateFormatCorrection(new Date(date), 'd MMM yyyy');

export const dateFormattingWithTime = date => dateFormatCorrection(new Date(date), 'd MMM yyyy hh:mm a');
