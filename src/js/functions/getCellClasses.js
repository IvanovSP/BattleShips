import {filter,isDead} from '../functions/filter';
export default function getCellClasses({cell,chosenShip,type,gameStatus}) {
	var classNames=[];
	var hasShip=cell.hitpoint.length;
	var shotedCell=cell.state=='splash';
	var damaged=hasShip&&cell.hitpoint[0].state=='damaged';
	var killed=cell.ship.some(isDead);
	var nearShip=cell.ship.length;
	var chosen=cell.hitpoint.length&&cell.ship[0]&&cell.ship[0]==chosenShip&&gameStatus=='waiting';
	var invalidPlaced=cell.ship.length>0&&!cell.ship[cell.ship.length-1].validPosition&&cell;
	if(hasShip&&type=='player')classNames.push('occupied');
	if((nearShip&&type=='player'))classNames.push('blocked');
	if(killed)classNames.push('killed');
	if(shotedCell)classNames.push('splash');
	if(chosen)classNames.push('chosen');
	if(damaged)classNames.push('damaged');
	if(invalidPlaced)classNames.push('invalid');
	var className=classNames.join(' ');
	return className
}

