export function filter(item,arr) {
	return arr.filter((el) =>
		el!=item
	)
}
export function isDead(element, index, array) {
	return element.status=='killed'
}
export function isInvalidPositioned(element, index, array) {
	return element.validPosition==false;
}