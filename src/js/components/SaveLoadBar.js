import React from "react";

export default class SaveLoadBar extends React.Component {
	render() {
		return (
			<div>
				<div class="expBtns">
					<div class="btn" ng-click="import()">
						import
					</div>
					<div class="btn" ng-click="export()">
						export
					</div>
				</div>
				<aside class="textHolder" ng-class="{hiden:!showJson}">
						<textarea readonly ng-model="colorsExp" id="myTextarea">

						</textarea>
				</aside>
				<aside class="textHolder" ng-class="{hiden:!importFlag}">
						<textarea ng-model="colorsImp" id="myTextareaImp">

						</textarea>
					<button ng-click="inportJson()">Import</button>
				</aside>
			</div>
		);
	}
}
/**
 * Created by User on 5/3/2017.
 */
