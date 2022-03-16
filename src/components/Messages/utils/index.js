import {
	isToday,
	isThisWeek,
	isThisMonth,
	isThisYear,
	isTuesday,
	isMonday,
	isWednesday,
	isThursday,
	isFriday,
} from 'date-fns';
import { dateFormatCorrection } from '@utils';

export const formatDateForMessages = timestamp => {
	if (isToday(timestamp))
		return dateFormatCorrection(timestamp, 'h:mm a');

	if (isThisWeek(timestamp))
		return dateFormatCorrection(timestamp, 'MMM d');

	if (isThisMonth(timestamp))
		return dateFormatCorrection(timestamp, 'MMM d');

	if (isThisYear)
		return dateFormatCorrection(timestamp, 'MMM dd yyyy');

	return dateFormatCorrection(timestamp, 'MMM dd yyyy');
};

export const formatDateForSeparateMessages = timestamp => {
	if (isToday(timestamp)) return 'Today';

	if (isThisWeek(timestamp)) {
		switch (true) {
			case isMonday(timestamp): return 'Monday';
			case isTuesday(timestamp): return 'Tuesday';
			case isWednesday(timestamp): return 'Wednesday';
			case isThursday(timestamp): return 'Thursday';
			case isFriday(timestamp): return 'Friday';
			default: return dateFormatCorrection(timestamp, 'MMM dd yyyy');
		}
	}

	if (isThisYear(timestamp))
		return dateFormatCorrection(timestamp, 'MMMM dd');

	return dateFormatCorrection(timestamp, 'MMM dd yyyy');
};

export const sortChannelsByLastMessage = channels => {
	if (!channels?.length) return [];

	channels.sort((prevChannel, nextChannel) => nextChannel.lastMessageDate - prevChannel.lastMessageDate);
};
