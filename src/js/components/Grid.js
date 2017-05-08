import GameField from '../classes/GameField'
import React from "react";
import getCellClasses from "../functions/getCellClasses";
import {isDead} from "../functions/filter";

export default class Grid extends GameField {
	constructor(props) {
		super(props);
	}
	cellHandler(cell){
		if(this.props.mouseIsUp)return;
		if(this.props.shipToPut){
			this.shipCreation(cell);
		}else if(this.state.activeShip){
			this.shipMoove(cell);
		}
	}
	leaveShip(){
		this.setState({activeShip:false})
	}
	takeShip(cell){
		if(!cell.hitpoint.length||this.props.gameStatus=='isOn')return;
		var index = cell.hitpoint.length-1;
		var ship=cell.hitpoint[index].ship;
		this.setState({	activeShip:ship})
	}
	toggleShip(cell){
		this.setState({chosenShip:false})
		if(!cell.hitpoint.length)return;
		var ship=cell.hitpoint[0].ship;
		if(ship)this.setState({chosenShip:ship})
	}
	componentWillReceiveProps(nextProps){
		var {gameStatus,dataLoaded,loadGrid}=this.props;
		var {type,grid}=this.state;
		if(type=='ai'&&nextProps.gameStatus!=gameStatus&&gameStatus=='waiting'){
			this.shuffle();
		}else if(nextProps.gameStatus=='waiting'&&gameStatus=='over'){
			this.drop();
		}
	}
	clickHandler(cell){
		const {type}=this.state;
		const {gameStatus,move,nextMove}=this.props;
		switch (type){
			case "player":
				if(gameStatus=='waiting')this.toggleShip(cell)
				break
			case "ai":
				if(gameStatus!='isOn'||move==type||cell.state=='splash'||cell.ship.some(isDead))break;
				var coordinate={x:cell.x,y:cell.y}
				var {grid}= this.shotField({coordinate});
				nextMove();
				break
		}
	}
	rotate(){
		this.setState({chosenShip:false})
		this.state.chosenShip.toggleAngle();
	}
	render() {
		const {grid,type,shipToPut,chosenShip}=this.state;
		const {gameStatus}=this.props;
		const tdMap=(cell,i)=>{
			let className=getCellClasses({cell,chosenShip,type,gameStatus});
			return 	<td key={i} class={className}
					   onMouseOver={this.cellHandler.bind(this,cell)}
					   onMouseUp={this.leaveShip.bind(this)}
					   onMouseDown={this.takeShip.bind(this,cell)}
					   onClick={this.clickHandler.bind(this,cell)}>
						{cell.animate&&
							<img src="../../assets/images/cursor.png"/>
						}
					</td>
		}
		const mappedGrid = grid.map((gridRow,i)=>{
			return <tr key={i}>{gridRow.map(tdMap)}</tr>
		});
		return (
			<div>
				<table class={type}>
					<tbody>
					{mappedGrid}
					</tbody>
				</table>
				{chosenShip&&gameStatus=='waiting'&&
					<div class='rotate'  onClick={this.rotate.bind(this)}><img src="../../assets/images/rotate.png"/></div>
				}
				{type=='player'&&gameStatus=='waiting' &&
					<div class="btn autofix" onClick={this.newShuffle.bind(this)}>Авторазмещение</div>
				}
			</div>
		);
	}
}