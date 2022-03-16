export const getTimer = ({ prevTimer, time, intervalId }) => {
	if (time === 60000) {
		if (!prevTimer.seconds) {
			clearInterval(intervalId.current);
			intervalId.current = undefined;

			return { minutes: 0, seconds: 0 };
		}

		return { minutes: 0, seconds: prevTimer.seconds - 1 };
	}

	if (!prevTimer.minutes && !prevTimer.seconds) {
		clearInterval(intervalId.current);
		intervalId.current = undefined;

		return { minutes: 0, seconds: 0 };
	} else if (prevTimer.minutes && !prevTimer.seconds)
		return { minutes: prevTimer.minutes - 1, seconds: 59 };

	return { ...prevTimer, seconds: prevTimer.seconds - 1 };
};
