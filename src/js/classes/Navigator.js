export default class Navigator{
	constructor({gridLength}) {
		this.gridLength=gridLength;
	}
	getShipCoordinates({coordinate,angle,length}){
		var from=coordinate;
		var to = angle?{x:from.x,y:from.y+length-1}:{x:from.x+length-1,y:from.y}
		return this.getRow({from,to,angle})
	}
	getNearByCoordinates({coordinate,angle,length}){
		var {x,y}=coordinate;
		var result=[];
		var fromX=x-1;
		var fromY=y-1;
		if(angle){
			var topRow=(y==0)?[]:[{x,y:y-1}];
			var bottomRow=(y+length>this.gridLength-1)?[]:[{x,y:y+length}];
			var backRow=fromX<0?[]:this.getRow({from:{x:fromX,y:fromY},to:{x:fromX,y:y+length},angle});
			var frontRow=x+1>this.gridLength-1?[]:this.getRow({from:{x:x+1,y:fromY},to:{x:x+1,y:y+length},angle});
		}else{
			var topRow=(y==0)?[]:this.getRow({from:{x:fromX,y:fromY},to:{x:x+length,y:fromY},angle});
			var bottomRow=(y+1>this.gridLength-1)?[]:this.getRow({from:{x:fromX,y:y+1},to:{x:x+length,y:y+1},angle});
			var backRow=fromX<0?[]:[{x:fromX,y}];
			var frontRow=x+length>this.gridLength-1?[]:[{x:x+length,y}];
		}
		return [...topRow,...bottomRow,...backRow,...frontRow];
	}
	getRow({from,to,angle}){
		var {x,y}=from;
		var result=[];
		var limit =(angle)?to.y:to.x;
		for(var i=angle?y:x;i<=limit;i++){
			if(this.isValid({x,y}))result.push({x,y});
			angle?y++:x++;
		}
		return result;
	}
	isValid(coordinates){
		var {x,y}=coordinates;
		return x>=0&&x<this.gridLength&&y>=0&&y<this.gridLength;
	}
}