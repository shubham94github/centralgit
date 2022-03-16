const SCROLL_DELAY = 200;

export const scrollChatBottom = node => {
	setTimeout(() => {
		node.scrollTop = node.scrollHeight - node.clientHeight;
		node.scrollIntoView();
	}, SCROLL_DELAY);
};

export const moveScrollBellow = node => {
	setTimeout(() => {
		node.scrollTop += 2;
		node.scrollIntoView();
	}, SCROLL_DELAY);
};

export const moveScrollAbove = node => {
	setTimeout(() => {
		node.scrollTop -= 2;
		node.scrollIntoView();
	}, SCROLL_DELAY);
};
