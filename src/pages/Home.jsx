import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataList } from "../cmps/Data-List";
import { storageService } from "../services/async-storage.service";
import { days } from "../services/icon-service";
const WEATHER_STORAGE_KEY = "weather";
const SEARCH_STORAGE_KEY = "search";
// const telAviv = require("../tel-aviv.json");
// const telResult = require("../tel-auto-complete.json");
// const telavi = require("../telavi.json");

export function Home() {
	const [weather, setWeather] = useState(null);
	const [search, setSearch] = useState("");
	const [debounce, setDebounce] = useState(false);
	const [clearId, setId] = useState("");
	const [dataList, setDataList] = useState(null);
	const [cards, setCards] = useState(null);

	useEffect(async () => {
		//demo data
		// storageService.post(WEATHER_STORAGE_KEY, { code: 215854, timedAdded: Date.now(), name: "Tel Aviv", weather: telAviv });
		// storageService.post(SEARCH_STORAGE_KEY, { search: "tel", result: telResult });
		const storage = await storageService.query(WEATHER_STORAGE_KEY);
		setWeather(storage);
	}, []);

	useEffect(async () => {
		if (!debounce && search) handleAutoComplete(search);
	}, [debounce]);

	function handleDebounce(ev) {
		const search = ev.target.value;
		setSearch(search);

		if (debounce) clearTimeout(clearId);
		setDebounce(true);
		setId(
			setTimeout(() => {
				setDebounce(false);
			}, 2000)
		);
	}

	async function handleAutoComplete(search) {
		if (debounce) return;
		const data = await storageService.query(SEARCH_STORAGE_KEY);
		const isOnList = data.find((item) => {
			if (item.search === search) return item;
			else if (item.search.startsWith(search)) return item;
		});
		if (isOnList) {
			console.log(isOnList);
			setDataList([isOnList]);
		} else {
			setDataList(null);
			console.log("not on list");
			const reponse = await axios.get(`http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=uDopNCG8et95UTCgj4q45kKruFAl6oGj&q=${search}&language=en-us`);
			await storageService.post(SEARCH_STORAGE_KEY, { search, result: reponse.data });
			setDataList([{ search, result: reponse.data }]);
		}
	}

	return (
		<div>
			<div class='welcome'> Welcome to weather app</div>
			<label>
				Search place:
				<input value={search} autoComplete='off' onChange={handleDebounce} type='text' placeholder='Search place' />
				{dataList && <DataList setCards={setCards} autoComplete={dataList} setSearch={setSearch} />}
			</label>
			{cards && (
				<div>
					<div className='cards-header'>{search} weather in the next 5 days:</div>
					<div className='card-container'>
						{cards.DailyForecasts.map((day) => {
							return (
								<ul className='day' key={day.Date}>
									<li>Date:{new Date(day.Date).toDateString()}</li>
									<li>Max Temp:{day.Temperature.Maximum.Value}°C </li>
									<li>Max Temp:{day.Temperature.Minimum.Value}°C </li>
									<li>
										<div> At day will be: {day.Day.IconPhrase}</div>
									</li>
									<img src={days[day.Day.Icon]} />
									<li>At night will be: {day.Night.IconPhrase}</li>
									<img src={days[day.Night.Icon]} />
								</ul>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
