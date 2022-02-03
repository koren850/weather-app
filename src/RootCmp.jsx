import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { Home } from "./pages/Home";

export function RootCmp() {
	return (
		<div className='app-layout'>
			<main className='main-app-layout'>
				<Switch>
					<Route component={Home} path='/' />
				</Switch>
			</main>
		</div>
	);
}
