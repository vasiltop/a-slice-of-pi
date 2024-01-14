import { useEffect, useState } from 'react';

type CheckboxProps = {
	label: string;
	value: boolean;
	onChange: () => void;
};

export default function Checkbox({ label, value, onChange }: CheckboxProps) {
	const [checked, setChecked] = useState(true);

	useEffect(() => {
		setChecked(value);
	}, [value]);

	return (
		<label className="flex items-center gap-2 ">
			<input
				type="button"
				onClick={onChange}
				className={`btn ${checked ? 'bg-primary text-primary-content' : 'bg-base-100 text-base-content'} btn-ghost`}
				value={label}
			/>
		</label>
	);
}
