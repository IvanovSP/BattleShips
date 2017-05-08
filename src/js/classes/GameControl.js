import React from "react";

export default class GameControl extends React.Component{
	constructor({ai,playerGrid,aiGrid,ships,shipsAmount}) {
		super();
		this.state={
			playerGrid,
			aiGrid,
			ships,
			shipsAmount,
			move:'player',
			gameStatus:'waiting',
			winner:'',
			shipToPut:false
		}
		this.ai=ai;
	}
	registerShips({playerShips,aiShips}){
		if(aiShips)this.setState({aiShips});
		if(playerShips)this.setState({playerShips});
	}
	nextMove(){
		var {gameStatus,move}=this.state;
		this.gameStatusUpdate();
		if(gameStatus=='over')return;
		var nextMove=(move=='player')?'ai':'player';
		if(nextMove=='ai'){
			this.setState({move:nextMove},this.aiMove)
		}else{
			this.setState({move:nextMove})
		}
	}
	aiMove(){
		this.ai.shoot();
		var that = this
		setTimeout(function(){that.nextMove()}, 1500);
	}
	gameStatusUpdate(){
		var{aiShips,playerShips}=this.state
		var aiLost=this.shipsCheck(aiShips);
		var playerLost=this.shipsCheck(playerShips);
		if(aiLost||playerLost){
			var winner=aiLost?'player':playerLost;
			this.declareWinner(winner);
		}
	}
	declareWinner(winner){
		this.setState({winner,gameStatus:'over'})
	}
	shipsCheck(ships){
		var allDead=true;
		for(var i in ships){
			if(ships[i].status!='killed'){
				allDead=false;
				break
			}
		}
		return allDead
	}
}