export function sortX(a, b) {
	if (a.x<b.x) {
		return -1;
	}
	if (a.x>b.x) {
		return 1;
	}
	return 0;
}
export function sortY(a, b) {
	if (a.y<b.y) {
		return -1;
	}
	if (a.y>b.y) {
		return 1;
	}
	return 0;
}