import { Chart, ArcElement } from 'chart.js/auto';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { reviewData } from '../../../datasets/review_data.ts';
import { orderData } from '../../../datasets/order_data.ts';
import { pricingData } from '../../../datasets/pricing_data.ts';

export default function Home() {
	Chart.register(ArcElement);

	const totalSales = orderData.reduce((acc, order) => {
		return (
			acc +
			order.items.reduce((acc, item) => {
				return acc + getPrice(item);
			}, 0)
		);
	}, 0);

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
							data: getStoreData(orderData),
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

			<h2> Total Sales</h2>
			<p>${totalSales}</p>
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

function getStoreData(data: Order[]): number[] {
	let keys = getStores(data);
	let labelMap = new Map<string, number>();

	keys.forEach((label) => {
		labelMap.set(label, 0);
	});

	data.forEach((item) => {
		let label = item.store;
		labelMap.set(label, labelMap.get(label)! + 1);
	});

	return keys.map((label) => labelMap.get(label)!);
}

function getPrice(item: Item): number {
	return pricingData[item.type][item.size];
}
