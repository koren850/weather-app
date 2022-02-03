import axios from "axios";
import { storageService } from "../services/async-storage.service";
const WEATHER_STORAGE_KEY = "weather";

export function DataList({ autoComplete, setCards, setSearch }) {
	async function handleSearch(name, key) {
		const Storage = await storageService.query(WEATHER_STORAGE_KEY);
		const Found = Storage.find((weather) => {
			if (weather.code === key && Date.now() - weather.timedAdded < 1000 * 60 * 60 * 24) return weather;
		});
		if (Found) {
			console.log("find in storage");
			console.log(Found);
			setSearch(Found.name);
			setCards(Found.weather);
			return;
		} else {
			console.log("will go to server");
			const reponse = await axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${key}?apikey=uDopNCG8et95UTCgj4q45kKruFAl6oGj&metric=true`);
			setCards(reponse.data);
		}
	}

	return (
		<ul className='data-list'>
			{autoComplete.map((search) => {
				return search.result.map((result) => {
					return (
						<li onClick={() => handleSearch(result.LocalizedName, +result.Key)} key={result.LocalizedName}>
							{result.LocalizedName}
						</li>
					);
				});
			})}
		</ul>
	);
}
