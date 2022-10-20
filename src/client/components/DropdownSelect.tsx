import { title } from "case";
import classNames from "classnames";
import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";

type DropDownSelectOption = {
    text: string;
    value: any;
};

type DropdownSelectProps = {
    value?: any;
    placeholder?: string;
    options: DropDownSelectOption[];
    onSelected?: (event: any) => any;
};

const DropdownSelect = (props: DropdownSelectProps) => {
    const { value, placeholder, options, onSelected } =
        props;

    const [show, setShow] = useState(false);

    const [selected, setSelected]: [DropDownSelectOption | undefined, any] =
        useState({ value, text: value });

    const select = useCallback((option: DropDownSelectOption) => {
        setSelected(option);
        if (onSelected) {
            onSelected(option.value);
        }
        setShow(false)
    }, []);


    const toggle = useCallback(() => {
        setShow(!show)
    }, [show])

    return (
        <div className="relative w-full h-full">
            <button
                id="dropdownDefault"
                data-dropdown-toggle="dropdown"
                className="w-full h-full  bg-transparent border shadow hover:bg-gray-100  focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center justify-between"
                type="button"
                onClick={() => toggle()}
            >
                <div>
                    {title(selected ? selected.value : placeholder)}
                </div>
                <svg
                    className="ml-2 w-4 h-4"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                    ></path>
                </svg>
            </button>
            <div
                id="dropdown"
                className={classNames(
                    !show ? 'hidden' : '',
                    "absolute z-10 w-full h-[150px] overflow-y-auto bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700"
                )}
            >
                <ul
                    className="py-1 text-sm"
                    aria-labelledby="dropdownDefault"
                >
                    {options.sort((a,b) => a.value - b.value).map((option) => (
                        <li  key={option.value} onClick={() => select(option)}>
                            <div className="block py-2 px-4 hover:bg-gray-100">
                                {title(option.text)}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DropdownSelect;
