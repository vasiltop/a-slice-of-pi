import { Chart, ArcElement } from 'chart.js/auto';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { reviewData } from '../../../datasets/review_data.ts';
import { orderData } from '../../../datasets/order_data.ts';
import { pricingData } from '../../../datasets/pricing_data.ts';
import Checkbox from '../../components/Checkbox.tsx';
import { useState } from 'react';

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

	return (
		<>
			<Pie
				data={{
					labels: getSentiments(reviewData),
					datasets: [
						{
							label: 'Popularity of colours',
							data: getReviewData(reviewData),
							// you can set indiviual colors for each bar
							backgroundColor: [
								'rgba(200, 200, 200, 1)',
								'rgba(100, 100, 100, 11)',
								'rgba(50, 50, 50, 1)',
								'rgba(10, 10, 10, 1)',
							],
							borderWidth: 1,
						},
					],
				}}
			></Pie>

			<Bar
				data={{
					labels: getStores(orderData),

					datasets: [
						{
							label: 'Popularity of stores',
							data: getStoreData(orderData, pizzaTypesFilter, pizzaSizesFilter),
							// you can set indiviual colors for each bar
							backgroundColor: [
								'rgba(200, 200, 200, 1)',
								'rgba(100, 100, 100, 11)',
								'rgba(50, 50, 50, 1)',
								'rgba(10, 10, 10, 1)',
							],
							borderWidth: 1,
						},
					],
				}}
			></Bar>

			<h2> Include: </h2>

			<h3> Pizza Types </h3>

			{PIZZA_TYPES.map((type) => (
				<Checkbox
					label={type}
					value={pizzaTypesFilter[type]}
					onChange={() => {
						updatePizzaTypesFilter(type);
					}}
				></Checkbox>
			))}

			<h3> Pizza Sizes </h3>

			{PIZZA_SIZES.map((size) => (
				<Checkbox
					label={size}
					value={pizzaSizesFilter[size]}
					onChange={() => {
						updatePizzaSizesFilter(size);
					}}
				></Checkbox>
			))}

			<h2> Total Sales</h2>
			<p>${totalSales}</p>

			<Line
				data={{
					labels: MONTHS,

					datasets: [
						{
							label: 'Popularity of stores',
							data: getMonthlySales(orderData),
							// you can set indiviual colors for each bar
							backgroundColor: [
								'rgba(200, 200, 200, 1)',
								'rgba(100, 100, 100, 11)',
								'rgba(50, 50, 50, 1)',
								'rgba(10, 10, 10, 1)',
							],
							borderWidth: 1,
						},
					],
				}}
			></Line>
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

function getMonthlySales(data: Order[]): number[] {
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

function getReviewData(data: Review[]): number[] {
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
	data: Order[],
	pizzaTypesFilter: PizzaType,
	pizzaSizesFilter: PizzaSize
): number[] {
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
