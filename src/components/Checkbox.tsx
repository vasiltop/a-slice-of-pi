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
		<label>
			<input
				type="checkbox"
				checked={checked}
				onChange={onChange}
				className="checkbox checkbox-md"
			/>
			{label}
		</label>
	);
}
