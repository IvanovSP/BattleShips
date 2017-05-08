import Navigator from "./Navigator";
export default class Ship{
	constructor({length,validPosition=true,shipCoordinates=[],nearByCoordinates=[],angle=90,status='intact',hitpoints=[]}) {
		this.hitpoints=[];
		this.validPosition=validPosition;
		this.shipCoordinates=shipCoordinates;
		this.nearByCoordinates=nearByCoordinates;
		this.angle=angle;
		this.status=status;
		if(hitpoints.length){
			this.hitpoints=hitpoints;
			for(var i in this.hitpoints)this.hitpoints[i].ship=this;
		}else{
			for(var i=0;i<length;i++){
				let [x,y]=['','']
				this.hitpoints.push({coordinates:{x,y},state:'intact',index:i,ship:this});
			}
		}
	}
	shoot(i){
		this.hitpoints[i].state='damaged';
		this.updateStatus();
		return this.status;
	}
	updateStatus(){
		var status='killed'
		for(var i in this.hitpoints){
			if(this.hitpoints[i].state=='intact'){
				status='damaged';
				break;
			}
		}
		this.status=status;
	}
	toggleAngle(){
		this.angle=(this.angle)?0:90;
		var hitpoint=this.hitpoints[0]
		var coordinate=hitpoint.coordinates;
		this.move({hitpoint,coordinate})
	}
	putOnGameField(grid){
		this.grid=grid;
		this.navigator=new Navigator({gridLength:this.grid.state.grid.length});
	}
	move({hitpoint,coordinate}){
		var frontCoordinate= this.findFrontPosition({coordinate,hitpoint});
		this.dropCoordinates();
		this.setCoordinates(frontCoordinate);
	}
	dropCoordinates(){
		this.validPosition =true;
		for(var i in this.shipCoordinates){
			let coordinate =this.shipCoordinates[i];
			let hitpoint =this.hitpoints[i];
			this.grid.clearField({coordinate,hitpoint,ship:this})
		}
		for(var i in this.nearByCoordinates){
			let coordinate =this.nearByCoordinates[i];
			this.grid.clearField({coordinate,ship:this})
		}
	}
	setCoordinates(coordinate){
		var navigatorPackage={coordinate,angle:this.angle,length:this.hitpoints.length}
		this.shipCoordinates=this.navigator.getShipCoordinates(navigatorPackage);
		this.pushFieldsHitbox({coordinates:this.shipCoordinates,hitpoints:this.hitpoints})
		this.nearByCoordinates=this.navigator.getNearByCoordinates(navigatorPackage);
		this.setFieldsShip({coordinates:this.nearByCoordinates,state:'occupied'})
	}
	pushFieldsHitbox({coordinates,hitpoints}){
		for(var i in coordinates){
			let hitpoint=hitpoints[i];
			let wasFree=this.grid.pushHitpoint({coordinate:coordinates[i],hitpoint,ship:this});
			if(wasFree==false)this.validPosition=false;
		}
	}
	setFieldsShip({coordinates,state}){
		for(var i in coordinates){
			this.grid.setShip({coordinate:coordinates[i],ship:this});
		}
	}
	findFrontPosition({coordinate,hitpoint}){
		const gridLength=this.grid.state.grid.length;
		var {x,y}=coordinate;
		var diff =(hitpoint.index)?hitpoint.index:0;
		this.angle?x-=diff:y-=diff;
		if(x<0)x=0;
		if(y<0)y=0;
		if(!this.angle&&x+this.hitpoints.length>gridLength)x-=x+this.hitpoints.length-gridLength;
		if(this.angle&&y+this.hitpoints.length>gridLength)y-=y+this.hitpoints.length-gridLength;
		return {x,y};
	}
}