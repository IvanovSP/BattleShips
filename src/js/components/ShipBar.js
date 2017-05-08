import React from "react";

export default class ShipBar extends React.Component {
	constructor() {
		super();
	}
	returnShip(ship){
		if(ship.amount)this.props.shipToPut(ship);
	}
	render() {
		const{ships}=this.props;
		const mappedShips = ships.map((ship,i)=>{
			var hitPoints=[]
			for(var i=0;i<ship.length;i++){hitPoints.push(<div key={i} class="colorRow"><div class="colorSample"></div></div>)}
			return 	<div key={i} onMouseDown={this.returnShip.bind(this,ship)}>
				<h5>{ship.amount}</h5>
				{hitPoints}
			</div>
		});
		return (
			<aside>
				{mappedShips}
			</aside>
		);
	}
}
/**
 * Created by User on 5/3/2017.
 */
