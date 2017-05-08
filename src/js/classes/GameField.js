import React from "react";
import Ship from './Ship';
import AutoPlacement from './AutoPlacement.js'
import gridFactory from  "../functions/gridFactory.js";
import {filter,isDead} from '../functions/filter.js';
const autoPlacer= new AutoPlacement;
export default class GameField extends React.Component  {
	constructor(props) {
		super(props);
		const{type,grid,shipToPut,ai}=props;
		this.state={
			grid,
			type,
			activeShip:false,
			chosenShip:false,
			ships:[]
		}
		if(type=='player')ai.registerItems({grid:this});
	}
	shotField({coordinate,animate}) {
		if(!coordinate)debugger;
		var {x,y}=coordinate;
		var {grid}=this.state;
		var field = grid[y][x];
		var shotStatus='miss';
		if(field.hitpoint.length){
			let index=field.hitpoint[0].index;
			shotStatus=field.ship[0].shoot(index);
		}
		if(animate){
			field.animate = animate;
			this.setState({grid});
			var that=this;
			setTimeout(function(){
				field.state = 'splash';
				that.setState({grid})
			}, 1500);
		}else{
			field.state = 'splash';
			this.setState({grid});
		}
		return ({shotStatus});
	}
	load({grid,shipList}){
		this.setState({grid,loadedShips:shipList},(shipList)=>{
			this.loadShips(this.state.loadedShips)
		})
	}
	loadShips(){
		var {type,loadedShips}=this.state;
		var {allShipsWasPutted}=this.props;
		var newShips=[];
		for(var i in loadedShips){
			let ship = new Ship(loadedShips[i]);
			newShips.push(ship);
			ship.putOnGameField(this);
			ship.move({hitpoint:ship.hitpoints[0],coordinate:ship.hitpoints[0].coordinates});
		}

		allShipsWasPutted({newShips,type});
	}
	clearField({coordinate,hitpoint,ship}){
		var {grid}=this.state;
		var {x,y}=coordinate;
		var ships=grid[y][x]['ship'];
		if(ship)grid[y][x]['ship']=filter(ship,ships);
		var hitpoints=grid[y][x]['hitpoint'];
		if(hitpoint)grid[y][x]['hitpoint']=filter(hitpoint,hitpoints)
		this.setState({grid})
	}
	setShip({coordinate,ship}) {
		var {x,y}=coordinate;
		var {grid}=this.state;
		grid[y][x]['ship'].push(ship);
		this.setState.bind(this,{grid});
	}
	pushHitpoint({coordinate,hitpoint,ship}) {
		var {x,y}=coordinate;
		var {grid}=this.state;
		grid[y][x]['hitpoint'].push(hitpoint);
		grid[y][x]['ship'].push(ship);
		hitpoint.coordinates={x,y};
		this.setState.bind(this,{grid});
		return (grid[y][x]['hitpoint'].length==1&&grid[y][x]['ship'].length==1);
	}
	fieldCheck({x,y}){
		var {grid}=this.state;
		return (grid[y]&&grid[y][x])?
			(grid[y][x].state!='splash'&&!grid[y][x].ship.some(isDead))
				:
			false;
	}
	calmFields(){
		let options = [];
		var {grid}=this.state;
		for(var i in grid){
			for(var j in grid[i]){
				let field=grid[i][j];
				let {x,y}=field;
				if(grid[y][x].state!='splash'&&!grid[y][x].ship.some(isDead))options.push({x,y});
			}
		}
		return options;
	}
	hitpointCheck({coordinate,hitpoint}) {
		var {x,y}=coordinate;
		var {grid}=this.state;
		let field = grid[x][y];
		return field.hitpoint.includes(hitpoint)
	}
	shipCreation(cell){
		var {shipWasPutted,shipsAmount,allShipsWasPutted}=this.props;
		var {type,ships}=this.state;
		var ship=new Ship({length:this.props.shipToPut.length});
		var {x,y}=cell;
		ship.putOnGameField(this);
		ships.push(ship)
		ship.move({hitpoint:cell,coordinate:{x,y}});
		ship.active=true;
		shipWasPutted(ship);
		if(shipsAmount==1)allShipsWasPutted({newShips:ships,type});
		this.setState({activeShip:ship,ships})
	}
	shipMoove(cell){
		var ship=this.state.activeShip;
		var {x,y}=cell;
		ship.move({hitpoint:cell,coordinate:{x,y}});
	}
	shuffle(){
		var {shipList,allShipsWasPutted,ai}=this.props;
		var {type}=this.state;
		var newShips=[];
		for(var i in shipList){
			for(var j=0; j< shipList[i].amountMax;j++){
				let {length}=shipList[i];
				let ship = new Ship({length});
				newShips.push(ship);
				ship.putOnGameField(this);
			}
		}
		if(allShipsWasPutted)allShipsWasPutted({newShips,type});
		autoPlacer.registerItems({ships:newShips,grid:this.state.grid});
		autoPlacer.autoPlace();
	}
	newShuffle(){
		var grid=gridFactory(this.state.grid.length);
		var {type}=this.state;
		this.setState({grid},this.shuffle.bind(this));
	}
	drop(){
		this.setState({grid:gridFactory(this.state.grid.length)});
	}
}