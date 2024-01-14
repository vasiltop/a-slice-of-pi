import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DateDropdown({
	startDate,
	endDate,
	onChange,
}: {
	startDate: Date;
	endDate: Date;
	onChange: (date: [Date, Date]) => void;
}) {
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
			<details className="dropdown">
				<summary className=" m-1 btn text-neutral-content rounded-lg h-8 min-h-0 bg-neutral btn-ghost">
					{getStartDate() + getEndDate()}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
            fill="currentColor"
						height="24"
						viewBox="0 0 24 24"
					>
            
						<path d="M20 20h-4v-4h4v4zm-6-10h-4v4h4v-4zm6 0h-4v4h4v-4zm-12 6h-4v4h4v-4zm6 0h-4v4h4v-4zm-6-6h-4v4h4v-4zm16-8v22h-24v-22h3v1c0 1.103.897 2 2 2s2-.897 2-2v-1h10v1c0 1.103.897 2 2 2s2-.897 2-2v-1h3zm-2 6h-20v14h20v-14zm-2-7c0-.552-.447-1-1-1s-1 .448-1 1v2c0 .552.447 1 1 1s1-.448 1-1v-2zm-14 2c0 .552-.447 1-1 1s-1-.448-1-1v-2c0-.552.447-1 1-1s1 .448 1 1v2z" />
					</svg>
				</summary>
				<ul className="dropdown-content menu z-10">
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
		</>
	);
}
