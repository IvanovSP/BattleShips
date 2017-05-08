import randomNum from '../functions/randomNum'
import {sortX,sortY} from '../functions/sortingFunctions'
export default class Ai{
	constructor() {
		this.hitsArray=[];
	}
	registerItems({grid}){
		this.grid=grid
	}
	importHitArray(hits){
		this.hitsArray=hits;
	}
	shoot(){
		var coordinate=this.shotPrediction();
		var {shotStatus}=this.grid.shotField({coordinate,animate:true});
		if(shotStatus=='killed')this.hitsArray=[];
		if(shotStatus=='damaged')this.hitsArray.push(coordinate);
	}
	shotPrediction(){
		var nextShot;
		if(this.hitsArray.length==0){
			nextShot=this.randomHit();
		}else if(this.hitsArray.length==1){
			nextShot=this.secondHit();
		}else{
			nextShot=this.finalHit();
		}
		return nextShot;
	}
	randomHit(){
		var options = this.grid.calmFields();
		return options[randomNum(options.length)];
	}
	secondHit(){
		var {x,y} = this.hitsArray[0];
		x=parseInt(x);
		y=parseInt(y);
		var coordinatesToCheck=[{x:x-1,y},{x:x+1,y},{x,y:y-1},{x,y:y+1}];
		var options = []
		for(var i in coordinatesToCheck){
			if(this.grid.fieldCheck(coordinatesToCheck[i]))options.push(coordinatesToCheck[i])
		}
		return options[randomNum(options.length)];
	}
	finalHit(){
		var sideA=this.hitsArray[0];
		var sideB=this.hitsArray[this.hitsArray.length-1];
		var angle=(sideA.x==sideB.x)?90:0;
		(angle)?this.hitsArray.sort(sortY):this.hitsArray.sort(sortX);
		var firstHit=this.hitsArray[0];
		var lastHit=this.hitsArray[this.hitsArray.length-1];
		firstHit.x=parseInt(firstHit.x);
		firstHit.y=parseInt(firstHit.y);
		lastHit.x=parseInt(lastHit.x);
		lastHit.y=parseInt(lastHit.y);
		let beforePoint=(angle)?{x:firstHit.x,y:firstHit.y-1}:{x:firstHit.x-1,y:firstHit.y};
		let nextPoint=(angle)?{x:lastHit.x,y:lastHit.y+1}:{x:lastHit.x+1,y:lastHit.y};
		var coordinatesToCheck=[beforePoint,nextPoint];
		var options = [];
		for(var i in coordinatesToCheck){
			if(this.grid.fieldCheck(coordinatesToCheck[i]))options.push(coordinatesToCheck[i])
		}
		return options[randomNum(options.length)];
	}
}
