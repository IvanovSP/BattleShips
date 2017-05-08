import React from "react";

export default class LoadModal extends React.Component {
	constructor(){
		super();
		var item = localStorage.getItem('battleShips');
		var saves=item?JSON.parse(item):false;
		this.state={saves}
	}
	handleFocus(event){
		if(	event.target == document.activeElement)return;
		event.target.select();
	}
	handleChange(){	}
	choseSave(save){
		this.setState({activeSave:save})
	}
	dropSave(save){
		this.setState({activeSave:false})
	}
	setSave(){
		var {inputText}=this.state;
		if(!inputText||!inputText.trim())return;
		try {
			var save = JSON.parse(inputText);
			var key = Object.keys(save)[0];
			var saveEntity=save[key];
			var {playerGrid,aiGrid,playerShips,aiShips,hitsArray}=saveEntity;
			if(!playerGrid||!aiGrid||!playerShips||!aiShips||!hitsArray)throw 'exception';
			var battleShips=JSON.parse(localStorage.getItem('battleShips'));
			if(!battleShips)battleShips=[];
			battleShips.push(save);
			localStorage.setItem('battleShips',JSON.stringify(battleShips));
			this.state={saves:battleShips}
		}
		catch (e) {
			alert('Вы вставили некоректный код')
		}
	};
	import(){
		var {showImport} = this.state;
		showImport=!showImport;
		this.setState({showImport})
		if(!showImport)this.setSave();
	}
	importText(event){
		this.setState({inputText:event.target.value})
	}
	loadSave(){
		const {hideModal,loadGame}=this.props;
		var {activeSave} = this.state;
		var key=Object.keys(activeSave)[0]
		hideModal();
		loadGame(activeSave[key]);
	}
	render() {
		const {saves,activeSave,showImport}=this.state;
		console.log(showImport);
		const {hideModal}=this.props;
		const mappedSaves =(saves)? saves.map((save,i)=>{
			var key=JSON.parse(Object.keys(save)[0]);
			var date = new Date(key);
			var day =date.getDate()<10?'0'+date.getDate():date.getDate();
			var month = date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1;
			var year =date.getFullYear();
			var hour =date.getHours()<10?'0'+date.getHours():date.getHours();
			var min =date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
			var saveClass =activeSave==save?'save item active':'save item';
			return <div key={i} class={saveClass}>
						<div class='wrap' onClick={this.choseSave.bind(this,save)}>
							<div class='date'>
								{`${day}.${month}.${year} - ${hour}:${min}`}
							</div>
							<div class='getCode'>
							</div>
						</div>
					</div>
		}):[];
		return (
			<div class='overlay'>
				<div class='modal'>
					<h1>
						Загузить
						<div class='close' onClick={hideModal}>x</div>
					</h1>
					<div class='modalBody'>
						{!showImport
						&&
							mappedSaves
						}
						<textarea class={showImport?'show':'hide'} onChange={this.importText.bind(this)}></textarea>
					</div>
					<div class='textExport'>
						<textarea class="myTextareaImp" readOnly value={JSON.stringify(activeSave) }></textarea>
					</div>
					<div class='modalFooter'>
						<div class="btn import" onClick={this.import.bind(this)}>
							Импорт
						</div>
						{activeSave&&
							<div class="btn" onClick={this.loadSave.bind(this)}>
								Загрузить
							</div>
						}
					</div>
				</div>
			</div>
		);
	}
}

