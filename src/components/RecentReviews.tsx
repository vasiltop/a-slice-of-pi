import { reviewData } from '../../datasets/review_data';
import { EMOTIONS, Review } from '../lib/types';
import { useMemo, useState } from 'react';
import Checkbox from './Checkbox';

export default function RecentReviews() {
	const [reviewsToShow, setReviewsToShow] = useState(8);

	const [emotionFilter, setEmotionFilter] = useState({
		happy: true,
		sad: true,
		angry: true,
		delighted: true,
	});

	function getRecentReviews(d: Review[]): Review[] {
		d = d.filter((review) => emotionFilter[review.sentiment]);
		return d
			.sort((a, b) => {
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			})
			.slice(0, reviewsToShow);
	}

	const recentReviews = useMemo(
		() => getRecentReviews(reviewData),
		[reviewData, emotionFilter, reviewsToShow]
	);

	return (
		<>
			<div className="flex gap-4 items-center">
				<h2 className="text-2xl font-bold text-gray-600">
					Most recent reviews
				</h2>
				<input
					type="number"
					min={0}
					step={5}
					placeholder="Amount to display"
					onChange={(e) => {
						e.preventDefault();
						setReviewsToShow(parseInt(e.target.value));
					}}
					className="input w-full max-w-xs"
				/>

				{EMOTIONS.map((emotion) => (
					<Checkbox
						key={emotion}
						label={emotion}
						value={emotionFilter[emotion]}
						onChange={() => {
							setEmotionFilter({
								...emotionFilter,
								[emotion]: !emotionFilter[emotion],
							});
						}}
					></Checkbox>
				))}
			</div>
			<div className="grid lg:grid-cols-4 md:grid-cols-2 gap-2 p-4 grid-cols-1">
				{recentReviews.map((review) => {
					return (
						<div
							className="bg-base-100 rounded-lg p-4 flex flex-col gap-2"
							key={review.review_id}
						>
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

							<p className="text-gray-700 flex-1"> {review.message} </p>

							<p className=" text-sm text-gray-500">
								{' '}
								{new Date(review.date).toDateString()}
							</p>
						</div>
					);
				})}
			</div>
		</>
	);
}

const emotionToColor = {
	delighted: 'bg-yellow-300/65',
	happy: 'bg-green-500/50',
	sad: 'bg-blue-400/50',
	angry: 'bg-red-400/50',
};
