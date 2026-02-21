import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export type { WithoutChildrenOrChild } from 'bits-ui';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type WithElementRef<T, E extends HTMLElement = HTMLElement> = T & {
	ref?: E | null;
};
