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
		<input
			type="button"
			onClick={onChange}
			className={`btn ${checked ? 'bg-primary' : 'bg-base-100'} btn-ghost`}
			value={label}
		/>
	);
}
