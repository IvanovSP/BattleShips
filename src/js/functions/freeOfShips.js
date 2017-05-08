export default function freeOfShips(grid) {
	var finalGrid=[]
	for(var y in grid){
		finalGrid[y]=[]
		for(var x in grid[y]){
			finalGrid[y][x]= {state:grid[y][x].state,hitpoint:[],ship:[],x,y};
		}
	}
	return finalGrid;
}