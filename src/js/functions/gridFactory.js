export default function gridFactory(gridLength){
	var grid=[];
	for(var i=0;i<gridLength;i++)grid.push([])
	grid.map((grid,i)=>{
		for(var j=0;j<gridLength;j++){
			grid.push({state:'calm',hitpoint:[],ship:[],x:j,y:i});
		}
	});
	return grid;
};