export default function getShipPackage(ships) {
	var finalShip=[]
	for(var i in ships){
		var {validPosition,shipCoordinates,angle,status,hitpoints}=ships[i]
		for(var j in hitpoints)delete hitpoints[j].ship;
		finalShip.push({length:hitpoints.length,validPosition,shipCoordinates,angle,status,hitpoints})
	}
	return finalShip;
}