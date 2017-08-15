import { Queue } from './index';
import * as chai from 'chai';
import 'mocha';
const assert = chai.assert;

describe('Queue', ()=>{
	describe('Methods', ()=>{
		describe('enqueue', ()=>{
			it('should add an item to the queue', ()=>{
				const queue = new Queue<string>();
				queue.enqueue('hello');

				for (let item of queue){
					assert.strictEqual(item, 'hello');
				}
			});

			it('should add items to the back of the queue', ()=>{
				const queue = new Queue<number>();
				queue.enqueue(0);
				queue.enqueue(1);

				let array = [];

				for (let item of queue){
					array.push(item);
				}

				assert.strictEqual(array[1], 1);
			});
		});
		describe('dequeue', ()=>{
			it('should return the first item in the queue', ()=>{
				const queue = new Queue<string>();
				queue.enqueue('a');
				queue.enqueue('b');

				assert.strictEqual(queue.dequeue(), 'a');
			});
			it('should remove the dequeued item from the queue', ()=>{
				const queue = new Queue<number>();
				queue.enqueue(0);
				queue.enqueue(1);

				const blah = queue.dequeue();

				assert.strictEqual(queue.size(), 1);
			});
		});
		describe('isEmpty', ()=>{
			it('should return true if the queue is empty', ()=>{
				const queue = new Queue<number>();
				assert.isTrue(queue.isEmpty());
			});

			it('should return false if the bag has contents', ()=>{
				const queue = new Queue<object>();
				queue.enqueue({foo: 'bar'});
				assert.isFalse(queue.isEmpty());
			});
		});
		describe('size', ()=>{
			it('should return the number of contents', ()=>{
				const queue = new Queue<string>();
				queue.enqueue('hello');
				queue.enqueue('goodbye');
				assert.strictEqual(queue.size(), 2);
			})
		});
	});
	describe('Iterator', ()=>{
		it('should return items from front to back', ()=>{
			const queue = new Queue<number>();
			queue.enqueue(0);
			queue.enqueue(1);
			queue.enqueue(2);

			const array = [0,1,2];
			let counter = 0;

			for (let item of queue){
				assert.strictEqual(item, array[counter]);
				counter++;
			}
		});
	});
});