import React from "react";

export default class Header extends React.Component {
	render() {
		const {gameIsReady, startGame,saveGame,loadGame,gameStatus,move} =this.props;
		return (
			<header>
				{gameStatus!='isOn'&&
					<div class="btn" onClick={startGame}>Начать</div>
				}
				{gameStatus=='isOn'&&
					<div class="btn" onClick={saveGame}>Сохранить</div>
				}
				<div class="btn" onClick={loadGame}>
					Загрузить
				</div>
				{gameStatus=='isOn'&&
					<h1>{move=='player'?'Ваш ход':'Ход противника'}</h1>
				}
			</header>
		);
	}
}
