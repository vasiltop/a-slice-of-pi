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
		console.log(value);
	}, [value]);

	return (
		<label className="flex items-center gap-2 text-black">
			<input
				type="button"
				checked={checked}
				onClick={onChange}
				className={`btn ${checked ? 'bg-primary' : 'bg-base-100'} btn-ghost`}
				value={label}
			/>
		</label>
	);
}
