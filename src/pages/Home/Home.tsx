import { Chart, ArcElement } from 'chart.js/auto';
import { Pie, Bar, Line, PolarArea } from 'react-chartjs-2';
import { reviewData } from '../../../datasets/review_data.ts';
import { orderData } from '../../../datasets/order_data.ts';
import Checkbox from '../../components/Checkbox.tsx';
import { useState } from 'react';
import Navbar from '../../components/Navbar.tsx';
import CountUp from 'react-countup';
import ConfettiExplosion from 'react-confetti-explosion';
import RecentReviews from '../../components/RecentReviews.tsx';
import DateDropdown from '../../components/DateDropdown.tsx';

import {
	COLORS,
	Item,
	MONTHS,
	Order,
	PIZZA_SIZES,
	PIZZA_TYPES,
	STORE_COLORS,
} from '../../lib/types.ts';

import {
	getMonthlySales,
	getPrice,
	getReviewData,
	getSentiments,
	getStoreData,
	getStoreSales,
	getStores,
} from '../../lib/util.ts';

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

	const totalSales = orderData.reduce((acc: number, order: Order) => {
		return (
			acc +
			order.items.reduce((acc: number, item: Item) => {
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

	const updateDateRange = (dates: [Date, Date]) => {
		const [start, end] = dates;
		setStartDate(start);
		setEndDate(end);
	};

	return (
		<>
			<Navbar />
			<div className="grid place-items-center">
				<div className=" max-w-7xl">
					<div className="grid grid-cols-1 place-items-center m-4 gap-4 lg:grid-cols-5">
						<div className="flex items-center gap-4 justify-center flex-wrap rounded-lg  lg:col-span-5">
							<div className=" flex bg-neutral items-center rounded-lg p-4 gap-4 h-16 ">
								<DateDropdown
									startDate={startDate}
									endDate={endDate}
									onChange={updateDateRange}
								/>
							</div>

							<div className="bg-neutral h-16 p-4 rounded-lg flex flow-row relative place-items-center">
								<p className=" text-gray-700 text-xl self-baseline translate-y-[.125rem]">
									Total sales:
									<span className=" text-green-400">
										{' '}
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
									animations: {
										tension: {
											duration: 3000,
											easing: 'linear',
											from: 0.4,
											to: 0,
											loop: true,
										},
									},
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
							<RecentReviews />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
