import { reviewData } from '../../datasets/review_data';
import { Review } from '../lib/types';

function getRecentReviews(d: Review[]): Review[] {
	return d
		.sort((a, b) => {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		})
		.slice(0, 8);
}

const recentReviews = getRecentReviews(reviewData);

export default function RecentReviews() {
	return (
		<>
			<h2 className="text-2xl font-bold text-gray-600">Most recent reviews</h2>

			<div className="grid lg:grid-cols-4 md:grid-cols-2 gap-2 p-4 grid-cols-1">
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
