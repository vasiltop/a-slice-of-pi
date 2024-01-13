import { Chart, ArcElement } from 'chart.js/auto';
import { Pie, Bar, Line, PolarArea } from 'react-chartjs-2';
import { reviewData } from '../../../datasets/review_data.ts';
import { orderData } from '../../../datasets/order_data.ts';
import { pricingData } from '../../../datasets/pricing_data.ts';
import Checkbox from '../../components/Checkbox.tsx';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from '../../components/Navbar.tsx';
import CountUp from 'react-countup';
import ConfettiExplosion from 'react-confetti-explosion';

//make the last one orange ORANGE
export const COLORS = [
	'#ffcc0080',
	'#4caf5080',
	'#2196f380',
	'#ff572280',
	'#ffab3680',
];
export const STORE_COLORS = [
	'rgba(255, 99, 132, 0.5)',
	'rgba(54, 162, 235, 0.5)',
	'rgba(255, 206, 86, 0.5)',
	'rgba(75, 192, 192, 0.5)',
	'rgba(153, 102, 255, 0.5)',
];
export const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'Decemeber',
];

export const PIZZA_TYPES = [
	'Cheese',
	'Pepperoni',
	'Deluxe',
	'Hawaiian',
	'Meatlovers',
] as const;
type PizzaType = Record<(typeof PIZZA_TYPES)[number], boolean>;

export const PIZZA_SIZES = ['S', 'M', 'L'] as const;
type PizzaSize = Record<(typeof PIZZA_SIZES)[number], boolean>;

const recentReviews = getRecentReviews(reviewData);

export default function Home() {
	Chart.register(ArcElement);

	const [pizzaTypesFilter, setPizzaTypesFilter] = useState({
		Cheese: true,
		Pepperoni: true,
		Deluxe: true,
		Hawaiian: true,
		Meatlovers: true,
	});

	const [pizzaSizesFilter, setPizzaSizesFilter] = useState({
		S: true,
		M: true,
		L: true,
	});

	const totalSales = orderData.reduce((acc, order) => {
		return (
			acc +
			order.items.reduce((acc, item) => {
				return acc + getPrice(item);
			}, 0)
		);
	}, 0);

	function updatePizzaTypesFilter(type: keyof typeof pizzaTypesFilter) {
		setPizzaTypesFilter({
			...pizzaTypesFilter,
			[type]: !pizzaTypesFilter[type],
		});
	}

	function updatePizzaSizesFilter(size: keyof typeof pizzaSizesFilter) {
		setPizzaSizesFilter({
			...pizzaSizesFilter,
			[size]: !pizzaSizesFilter[size],
		});
	}

	const [startDate, setStartDate] = useState(new Date(Date.UTC(2023, 0, 2)));
	const [endDate, setEndDate] = useState<Date>(
		new Date(Date.UTC(2023, 11, 32))
	);

	const onChange = (dates: [Date, Date]) => {
		const [start, end] = dates;
		setStartDate(start);
		setEndDate(end);
	};

	function getStartDate() {
		if (endDate == null || startDate == null) {
			return 'Selecting...';
		}
		return startDate.toDateString();
	}

	function getEndDate() {
		if (endDate == null || startDate == null) {
			return '';
		}
		return ' - ' + endDate.toDateString();
	}

	return (
		<>
			<Navbar />
			<div className="grid place-items-center">
				<div className=" max-w-7xl">
					<div className="grid grid-cols-1 place-items-center m-4 gap-4 lg:grid-cols-5">
						<div className="flex items-center gap-4 justify-center flex-wrap rounded-lg  lg:col-span-5">
							<div className=" flex bg-neutral items-center rounded-lg p-4 gap-4 h-16 ">
								<details className="dropdown ">
									<summary className=" m-1 btn  rounded-lg h-8 min-h-0 bg-white btn-ghost">
										{getStartDate() + getEndDate()}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
										>
											<path d="M20 20h-4v-4h4v4zm-6-10h-4v4h4v-4zm6 0h-4v4h4v-4zm-12 6h-4v4h4v-4zm6 0h-4v4h4v-4zm-6-6h-4v4h4v-4zm16-8v22h-24v-22h3v1c0 1.103.897 2 2 2s2-.897 2-2v-1h10v1c0 1.103.897 2 2 2s2-.897 2-2v-1h3zm-2 6h-20v14h20v-14zm-2-7c0-.552-.447-1-1-1s-1 .448-1 1v2c0 .552.447 1 1 1s1-.448 1-1v-2zm-14 2c0 .552-.447 1-1 1s-1-.448-1-1v-2c0-.552.447-1 1-1s1 .448 1 1v2z" />
										</svg>
									</summary>
									<ul className="dropdown-content menu">
										<DatePicker
											selected={startDate}
											onChange={onChange}
											startDate={startDate}
											endDate={endDate}
											selectsRange
											inline
										/>
									</ul>
								</details>
							</div>

							<div className="bg-neutral h-16 p-4 rounded-lg flex flow-row relative place-items-center">
								<p className=" text-gray-700 text-xl  self-baseline translate-y-[.125rem]">
									Total sales:{' '}
									<span className=" text-green-400">
										$
										<CountUp end={totalSales} />
									</span>
								</p>
								<div className="flex w-full h-full place-items-center absolute">
									<ConfettiExplosion
										force={0.4}
										duration={2200}
										particleCount={20}
										width={400}
									/>
								</div>
							</div>
						</div>
						<div className="w-full h-full bg-neutral rounded-3xl p-4 lg:col-span-2 grid place-items-center">
							<Pie
								options={{
									plugins: {
										title: {
											text: 'Reviews by sentiment',
											display: true,
											font: { size: 25 },
										},
									},
								}}
								data={{
									labels: getSentiments(reviewData),
									datasets: [
										{
											borderRadius: 15,

											data: getReviewData(reviewData, startDate, endDate),
											// you can set indiviual colors for each bar
											backgroundColor: COLORS,
											borderWidth: 1,
										},
									],
								}}
							></Pie>
						</div>

						<div className=" !w-full  bg-neutral rounded-3xl grid place-items-center lg:col-span-3 h-full px-4">
							<Line
								options={{
									plugins: {
										title: {
											text: 'Revenue by month',
											display: true,
											font: { size: 25 },
										},
										legend: {
											display: false,
										},
									},
								}}
								data={{
									labels: MONTHS,

									datasets: [
										{
											fill: true,
											pointBackgroundColor: 'FFFFFF',

											data: getMonthlySales(orderData, startDate, endDate),
											// you can set indiviual colors for each bar
											backgroundColor: '#92e0b0' + 'B0',
											borderWidth: 1,
										},
									],
								}}
							></Line>
						</div>

						<div className="w-full h-full lg:col-span-3">
							<div className=" w-full h-full bg-neutral rounded-3xl p-4 grid place-items-center">
								<Bar
									options={{
										plugins: {
											title: {
												text: 'Orders by store',
												display: true,
												font: { size: 25 },
											},
											legend: {
												display: false,
											},
										},
									}}
									data={{
										labels: getStores(orderData),

										datasets: [
											{
												borderRadius: 15,

												data: getStoreData(
													orderData,
													pizzaTypesFilter,
													pizzaSizesFilter,
													startDate,
													endDate
												),

												backgroundColor: STORE_COLORS,
												borderWidth: 1,
											},
										],
									}}
								></Bar>
								<div className="flex justify-center m-4 gap-2 flex-wrap">
									{PIZZA_TYPES.map((type) => (
										<Checkbox
											label={type}
											value={pizzaTypesFilter[type]}
											onChange={() => {
												updatePizzaTypesFilter(type);
											}}
										></Checkbox>
									))}

									{PIZZA_SIZES.map((size) => (
										<Checkbox
											label={size}
											value={pizzaSizesFilter[size]}
											onChange={() => {
												updatePizzaSizesFilter(size);
											}}
										></Checkbox>
									))}
								</div>
							</div>
						</div>

						<div className="lg:col-span-2 bg-neutral w-full h-full rounded-3xl col-span-1 grid place-items-center p-4">
							<PolarArea
								//add title

								options={{
									plugins: {
										title: {
											text: 'Revenue by store',
											display: true,
											font: { size: 25 },
										},
									},
								}}
								data={{
									labels: getStores(orderData),
									datasets: [
										{
											data: getStoreSales(orderData, startDate, endDate),
											backgroundColor: STORE_COLORS,
											borderWidth: 1,
										},
									],
								}}
							></PolarArea>
						</div>

						<div className="lg:col-span-5 bg-neutral w-full  rounded-3xl col-span-1 p-8">
							<h2 className="text-2xl font-bold text-gray-700">
								Most recent reviews
							</h2>

							<div className="grid lg:grid-cols-4 grid-cols-2 gap-2 p-4">
								{recentReviews.map((review) => {
									return (
										<div className="bg-base-100 rounded-lg p-4 flex flex-col gap-2">
											<h2 className="text-2xl font-bold text-gray-600">
												Store: {review.store}
											</h2>

											<div
												className={`badge p-3 ${
													emotionToColor[
														review.sentiment as keyof typeof emotionToColor
													]
												}`}
											>
												{review.sentiment}
											</div>

											<p className="text-gray-500"> {review.message} </p>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

const emotionToColor = {
	delighted: 'bg-green-300/50',
	happy: 'bg-green-500/50',
	sad: 'bg-blue-400/50',
	angry: 'bg-red-400/50',
};

function getRecentReviews(d: Review[]): Review[] {
	return d
		.sort((a, b) => {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		})
		.slice(0, 8);
}

function getStoreSales(d: Order[], startDate: Date, endDate: Date): number[] {
	const data = filterByDate(d, startDate, endDate) as typeof d;

	const storeSales = new Map<string, number>();

	getStores(data).forEach((store) => {
		storeSales.set(store, 0);
	});

	data.forEach((order) => {
		const sales = order.items.reduce((acc, item) => {
			return acc + getPrice(item);
		}, 0);

		storeSales.set(order.store, storeSales.get(order.store)! + sales);
	});

	return getStores(data).map((store) => storeSales.get(store)!);
}

type Item = {
	type: keyof typeof pricingData;
	size: keyof (typeof pricingData)[keyof typeof pricingData];
};

export type Order = {
	order_id: number;
	store: string;
	items: Item[];
	date: string;
};

type Review = {
	review_id: number;
	sentiment: string;
	store: string;
	date: string;
	message: string;
};

function filterByDate(
	data: Order[] | Review[],
	startDate: Date,
	endDate: Date
): (Order | Review)[] {
	return data.filter((item) => {
		const date = new Date(item.date);
		return date >= startDate && date <= endDate;
	});
}

function getMonthlySales(d: Order[], startDate: Date, endDate: Date): number[] {
	const data = filterByDate(d, startDate, endDate) as typeof d;
	const monthlySales = new Map<string, number>();

	MONTHS.forEach((month) => {
		monthlySales.set(month, 0);
	});

	data.forEach((order) => {
		const date = new Date(order.date);
		const month = MONTHS[date.getMonth()];

		const sales = order.items.reduce((acc, item) => {
			return acc + getPrice(item);
		}, 0);

		monthlySales.set(month, monthlySales.get(month)! + sales);
	});

	return MONTHS.map((month) => monthlySales.get(month)!);
}

function getStores(data: Order[] | Review[]): string[] {
	let keys = new Set<string>();

	data.forEach((item) => {
		keys.add(item.store);
	});

	return Array.from(keys);
}

function getSentiments(data: Review[]): string[] {
	let keys = new Set<string>();

	data.forEach((item) => {
		keys.add(item.sentiment);
	});

	return Array.from(keys);
}

function getReviewData(d: Review[], startDate: Date, endDate: Date): number[] {
	const data = filterByDate(d, startDate, endDate) as typeof d;

	let keys = getSentiments(data);
	let labelMap = new Map<string, number>();

	keys.forEach((label) => {
		labelMap.set(label, 0);
	});

	data.forEach((item) => {
		let label = item.sentiment;
		labelMap.set(label, labelMap.get(label)! + 1);
	});

	return keys.map((label) => labelMap.get(label)!);
}

function getStoreData(
	d: Order[],
	pizzaTypesFilter: PizzaType,
	pizzaSizesFilter: PizzaSize,
	startDate: Date,
	endDate: Date
): number[] {
	const data = filterByDate(d, startDate, endDate) as typeof d;
	const stores = getStores(data);
	const labelMap = new Map<string, number>();

	stores.forEach((store) => {
		labelMap.set(store, 0);
	});

	data.forEach((order) => {
		const label = order.store;

		let shouldInclude = false;

		order.items.forEach((item) => {
			if (pizzaTypesFilter[item.type] && pizzaSizesFilter[item.size]) {
				shouldInclude = true;
			}
		});

		if (!shouldInclude) {
			return;
		}

		labelMap.set(label, labelMap.get(label)! + 1);
	});

	return stores.map((store) => labelMap.get(store)!);
}

function getPrice(item: Item): number {
	return pricingData[item.type][item.size];
}
