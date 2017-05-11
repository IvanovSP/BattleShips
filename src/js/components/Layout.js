import Ai from '../classes/Ai'
import LoadModal from '../modal/LoadModal'
import GameControl from "../classes/GameControl";
import Grid from "./Grid";
import gridFactory from  "../functions/gridFactory.js";
import Header from "./Header";
import React from "react";
import ShipBar from "./ShipBar";
import SaveLoadBar from "./SaveLoadBar";
import {isInvalidPositioned} from "../functions/filter";
import getShipPackage from "../functions/getShipPackage";
import freeOfShips from "../functions/freeOfShips";

const ai=new Ai;
// CONFIG
const gridLength=10;
const ships=[{length:4,amount:1,amountMax:1},{length:3,amount:2,amountMax:2},{length:2,amount:3,amountMax:3},{length:1,amount:4,amountMax:4}
];
// CONFIG
const shipsAmount= ships.reduce((acc, ship)=>acc + ship.amount, 0);

export default class Layout extends GameControl{
	constructor(){
		var newShips=[]
		for(var i in ships){
			newShips[i]=Object.assign({},ships[i]);
		}
		super({ai,playerGrid:gridFactory(gridLength),aiGrid:gridFactory(gridLength),ships:newShips,shipsAmount});
	}
	startGame(){
		const {shipsAmount,gameStatus,playerShips}=this.state;
		if(gameStatus=='waiting'&&shipsAmount){
			alert('Поставьте все корабли на позиции');
			return;
		}
		if(playerShips.some(isInvalidPositioned)){
			alert('Корабли должны быть на расстоянии минимум одной кледки друг от друга');
			return;
		}
		if(gameStatus=='over'){
			this.setState({gameStatus:'waiting',ships,move:'player'});
			return;
		}
		this.setState({gameStatus:'isOn',ships});
	}
	saveGame(){
		var{playerShips,aiShips}=this.state;
		var savePackage={};
		savePackage.playerShips=getShipPackage(playerShips);
		savePackage.aiShips=getShipPackage(aiShips);
		savePackage.playerGrid=freeOfShips(this.refs.playerGrid.state.grid);
		savePackage.aiGrid=freeOfShips(this.refs.aiGrid.state.grid);
		savePackage.hitsArray=this.ai.hitsArray;
		var key = +new Date()
		var battleShips;
		try {battleShips=JSON.parse(localStorage.getItem('battleShips'));}
		catch (e) {battleShips=[]}
		var save ={};
		save[key]=savePackage;		
		if(!battleShips)battleShips=[];
		battleShips.push(save)
		localStorage.setItem('battleShips',JSON.stringify(battleShips));
		alert('Информация сохранена')
	}
	loadGame(save){
		var {playerGrid,aiGrid,playerShips,aiShips,hitsArray}=save;
		this.setState({gameStatus:'isOn',ships,move:'player'});
		this.refs.playerGrid.load({grid:playerGrid,shipList:playerShips});
		this.refs.aiGrid.load({grid:aiGrid,shipList:aiShips});
		this.ai.importHitArray(hitsArray);
	}
	openLoadModal(){
		this.setState({'loadModal':true});
	}
	closeLoadModal(){
		this.setState({'loadModal':false});
	}
	shipToPut(ship){
		this.setState({shipToPut:ship})
	}
	mouseUpHandler(mouseIsUp){
		this.setState({mouseIsUp})
	}
	shipWasPutted(ship){
		var {ships,shipsAmount} = this.state
		for(var i in ships){
			if(ships[i].length==ship.hitpoints.length){
				ships[i].amount--;
				shipsAmount--;
			}
		}
		this.setState({ships,shipsAmount})
		this.cancelShipPlacement();
	}
	setZeroAmount(){
		if(this.state.shipToPut)this.cancelShipPlacement();
		var {ships} = this.state
		for(var i in ships){
			ships[i].amount=0;
		}
		this.setState({ships,shipsAmount:0})
	}
	allShipsWasPutted({newShips,type}){
		if(type=='player'){
			this.setZeroAmount()
		}
		var key = type+'Ships'
		var toRegister={};
		toRegister[key]=newShips;
		this.registerShips(toRegister)
	}
	cancelShipPlacement(){
		this.setState({
			shipToPut:false
		})
	}

	render() {
		const { playerGrid,aiGrid,shipToPut,shipsAmount,gameStatus,move,winner,ships,loadModal } = this.state;
		const gameIsReady=!shipsAmount;
		return (
			<div id="container" class={gameStatus} onMouseUp={this.mouseUpHandler.bind(this,true)} onMouseDown={this.mouseUpHandler.bind(this,false)}>
				<Header
					gameIsReady={gameIsReady}
					startGame={this.startGame.bind(this)}
					saveGame={this.saveGame.bind(this)}
					loadGame={this.openLoadModal.bind(this)}
					gameStatus={gameStatus}
					move={move}
				/>
				<ShipBar ships={ships} shipToPut={this.shipToPut.bind(this)}/>

				<div class="tableContainer">
					<div class="tableWrap">
						<h1>Игрок</h1>
						<h1>Соперник</h1>
						<Grid
							ref="playerGrid"
							ai={ai}
							mouseIsUp={this.state.mouseIsUp}
							shipToPut={shipToPut}
							shipList={ships}
							shipsAmount={shipsAmount}
							type={'player'}
							grid={playerGrid}
							shipWasPutted={this.shipWasPutted.bind(this)}
							allShipsWasPutted={this.allShipsWasPutted.bind(this)}
							gameStatus={gameStatus}
							gridLength={gridLength}
							move={move}
						/>
						<Grid
							ref="aiGrid"
							type={'ai'}
							nextMove={this.nextMove.bind(this)}
							grid={aiGrid}
							gameStatus={gameStatus}
							allShipsWasPutted={this.allShipsWasPutted.bind(this)}
							shipList={ships}
							gridLength={gridLength}
							move={move}
						/>
					</div>
				</div>
				{gameStatus=='over'&&
					<div class='winnerDeclaration'>
						<div class={winner}>
							{winner=='player'?'Вы победили!':'Вы проиграли'}
						</div>
					</div>
				}
				{loadModal&&
					<LoadModal
						hideModal={this.closeLoadModal.bind(this)}
						loadGame={this.loadGame.bind(this)}
					/>
				}
			</div>

		);
	}
}
//  {this.props.children} 	<SaveLoadBar/>