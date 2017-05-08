import randomNum from '../functions/randomNum'
export default class AutoPlacement{
	constructor() {}
	registerItems({ships,grid}) {
		this.grid = grid;
		this.ships = ships;
		this.shuffleAngels();
		this.autoPlaceTries=0;
	}
	shuffleAngels(){
		for(var i in this.ships){
			let randomAngle=(randomNum(2))?90:0;
			this.ships[i].angle= randomAngle;
		}
	}
	autoPlace(){
		for(var i in this.ships){
			let ship = this.ships[i];
			let shipLength =ship.hitpoints.length;
			let possibleCoordinates =ship.angle?this.possibleVerticalPlacements(ship):this.possibleHorizontalPlacements(ship);

			for(var i=0;i<possibleCoordinates.length;i++){
				if(possibleCoordinates[i].length<shipLength){
					possibleCoordinates.splice(i, 1);
					i--;
				}
			}
			if(!possibleCoordinates.length&&this.autoPlaceTries){
				alert('Слишком маленькое поле для такого количества кораблей. Возможно вмешательство в исходный код.');
				return;
			}
			let randomCoordinate = this._chooseCoordinate({possibleCoordinates,shipLength})
			ship.move({hitpoint:ship.hitpoints[0],coordinate:randomCoordinate});
		}
		for(var i in this.ships){
			if(!this.ships[i].validPosition&&this.autoPlaceTries==0){
				this.autoPlaceTries++;
				this.autoPlace();
			}
		}
		this.autoPlaceTries=0;
	}
	possibleVerticalPlacements(ship){
		let [x,y]=[0,0];
		let possibleCoordinates=[[]];
		while (x < this.grid[0].length) {
			let field=this.grid[y][x];
			this._pushPossibleCoordinates({field,possibleCoordinates,ship});
			y++;
			if(y== this.grid.length){
				y=0;
				x++;
				if(x < this.grid.length-1)possibleCoordinates.push([]);
			}
		}
		return possibleCoordinates;
	}
	possibleHorizontalPlacements(ship){
		var [x,y]=[0,0];
		var possibleCoordinates=[[]];
		for(var y in this.grid){
			for(var x in this.grid[y]){
				let field=this.grid[y][x];
				this._pushPossibleCoordinates({field,possibleCoordinates,ship});
			}
			if(y<this.grid.length-1)possibleCoordinates.push([]);
		}
		return possibleCoordinates;
	}
	_chooseCoordinate({possibleCoordinates,shipLength}){
		let y= randomNum(possibleCoordinates.length);
		let correctedLimit =possibleCoordinates[y].length-shipLength+1;
		let x= randomNum(correctedLimit);
		return possibleCoordinates[y][x];
	}
	_pushPossibleCoordinates({field,possibleCoordinates,ship}){
		let lastIndex = possibleCoordinates.length-1;
		if(field.ship.length==0&&field.state=='calm'){
			possibleCoordinates[lastIndex].push(field);
		}else{
			if(possibleCoordinates[lastIndex].length<ship.hitpoints.length)possibleCoordinates.pop();
			possibleCoordinates.push([]);
		}
	}
};