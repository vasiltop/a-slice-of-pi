import { pricingData } from '../../datasets/pricing_data';
import { Item, MONTHS, Order, PizzaSize, PizzaType, Review } from './types';

export function getStoreSales(
	d: Order[],
	startDate: Date,
	endDate: Date
): number[] {
	const data = filterByDate(d, startDate, endDate);

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

function filterByDate<T extends { date: string }>(
	data: T[],
	startDate: Date,
	endDate: Date
): T[] {
	return data.filter((item) => {
		const date = new Date(item.date);
		return date >= startDate && date <= endDate;
	});
}

export function getMonthlySales(
	d: Order[],
	startDate: Date,
	endDate: Date
): number[] {
	const data = filterByDate(d, startDate, endDate);
	const monthlySales = new Map<string, number>();

	MONTHS.forEach((month) => {
		monthlySales.set(month, 0);
	});

	data.forEach((order) => {
		const date = new Date(order.date);
		const month = MONTHS[date.getUTCMonth()];

		const sales = order.items.reduce((acc, item) => {
			return acc + getPrice(item);
		}, 0);

		monthlySales.set(month, monthlySales.get(month)! + sales);
	});

	return MONTHS.map((month) => monthlySales.get(month)!);
}

export function getStores<T extends { store: string }>(data: T[]): string[] {
	let keys = new Set<string>();

	data.forEach((item) => {
		keys.add(item.store);
	});

	return Array.from(keys);
}

export function getSentiments(data: Review[]): string[] {
	let keys = new Set<string>();

	data.forEach((item) => {
		keys.add(item.sentiment);
	});

	return Array.from(keys);
}

export function getReviewData(
	d: Review[],
	startDate: Date,
	endDate: Date
): number[] {
	const data = filterByDate(d, startDate, endDate);

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

export function getPrice(item: Item): number {
	return pricingData[item.type][item.size];
}

export function getStoreData(
	d: Order[],
	pizzaTypesFilter: PizzaType,
	pizzaSizesFilter: PizzaSize,
	startDate: Date,
	endDate: Date
): number[] {
	const data = filterByDate(d, startDate, endDate);
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
