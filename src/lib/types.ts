import { pricingData } from '../../datasets/pricing_data';

export type Review = {
	review_id: number;
	sentiment: Sentiment;
	store: string;
	date: string;
	message: string;
};

export type Item = {
	type: keyof typeof pricingData;
	size: keyof (typeof pricingData)[keyof typeof pricingData];
};

type Sentiment = (typeof EMOTIONS)[number];

export type Order = {
	order_id: number;
	store: string;
	items: Item[];
	date: string;
};

export const COLORS = [
	'#4caf5080',
	'#2196f380',

	'#ffcc0080',
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

export const EMOTIONS = ['happy', 'angry', 'sad', 'delighted'] as const;
export type PizzaType = Record<(typeof PIZZA_TYPES)[number], boolean>;

export const PIZZA_SIZES = ['S', 'M', 'L'] as const;
export type PizzaSize = Record<(typeof PIZZA_SIZES)[number], boolean>;
