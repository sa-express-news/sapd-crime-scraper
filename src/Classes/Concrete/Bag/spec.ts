import { Bag } from './index';
import * as chai from 'chai';
import 'mocha';

const assert = chai.assert;

describe('Bag', ()=>{
	describe('Methods', ()=>{
		describe('add', ()=>{
			it('should add one item to the bag', ()=>{
				const bag = new Bag<string>();
				bag.add('hello');
				const bagContents = [];

				for(let item of bag){
					bagContents.push(item);
				}

				assert.strictEqual(bagContents[0], 'hello');

			});
		});

		describe('isEmpty', ()=>{
			it('should return true if the bag is empty', ()=>{
				const bag = new Bag<number>();
				assert.isTrue(bag.isEmpty());
			});

			it('should return false if the bag has contents', ()=>{
				const bag = new Bag<object>();
				bag.add({foo: 'bar'});
				assert.isFalse(bag.isEmpty());
			});
		});

		describe('size', ()=>{
			it('should return the number of contents', ()=>{
				const bag = new Bag<string>();
				bag.add('hello');
				bag.add('goodbye');
				assert.strictEqual(bag.size(), 2);
			})
		});
	});
	describe('Iterator', ()=>{
		it('shold return contents in the order they were added', ()=>{
			const bag = new Bag<number>();
			bag.add(0);
			bag.add(1);
			bag.add(2);

			const array = [0,1,2];
			let counter = 0;

			for (let item of bag){
				assert.strictEqual(item, array[counter]);
				counter++;
			}
		})
	})
});