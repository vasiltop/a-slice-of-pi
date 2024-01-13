import { Chart, ArcElement } from 'chart.js/auto';
import { Pie, Bar, Line } from 'react-chartjs-2';
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

export const COLORS = ['#ffcc00', '#4caf50', '#2196f3', '#ff5722'];

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
									Total sales: $
									<CountUp end={totalSales} />
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
						<div className="w-full h-full bg-neutral rounded-3xl p-8 lg:col-span-2 grid place-items-center">
							<Pie
								data={{
									labels: getSentiments(reviewData),
									datasets: [
										{
											borderRadius: 15,
											label: 'Popularity of colours',
											data: getReviewData(reviewData, startDate, endDate),
											// you can set indiviual colors for each bar
											backgroundColor: COLORS,
											borderWidth: 1,
										},
									],
								}}
							></Pie>
						</div>
						<div className="w-full h-full lg:col-span-3">
							<div className=" w-full h-full bg-neutral rounded-3xl p-8">
								<Bar
									data={{
										labels: getStores(orderData),

										datasets: [
											{
												borderRadius: 15,
												label: 'Popularity of stores',
												data: getStoreData(
													orderData,
													pizzaTypesFilter,
													pizzaSizesFilter,
													startDate,
													endDate
												),
												// you can set indiviual colors for each bar
												backgroundColor: COLORS,
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

						<div className=" !w-full  bg-neutral rounded-3xl p-8 flex place-items-center lg:col-span-3 max-h-96 h-full">
							<Line
								data={{
									labels: MONTHS,

									datasets: [
										{
											fill: true,

											label: 'Popularity of stores',
											data: getMonthlySales(orderData, startDate, endDate),
											// you can set indiviual colors for each bar
											backgroundColor: COLORS[0] + 'B0',
											borderWidth: 1,
										},
									],
								}}
							></Line>
						</div>
					</div>
				</div>
			</div>
		</>
	);
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
