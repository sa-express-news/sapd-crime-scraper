import { Iterator } from './Iterator';

export interface Iterable{
	[Symbol.iterator](): Iterator;
}