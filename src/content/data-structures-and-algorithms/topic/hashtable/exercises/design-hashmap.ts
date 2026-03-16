/**
 * 706. Design HashMap
 * Design a HashMap without using any built-in hash table libraries.
 *
 * Implement the MyHashMap class:
 *
 * MyHashMap() initializes the object with an empty map.
 * void put(int key, int value) inserts a (key, value) pair into the HashMap. If the key already exists in the map, update the corresponding value.
 * int get(int key) returns the value to which the specified key is mapped, or -1 if this map contains no mapping for the key.
 * void remove(key) removes the key and its corresponding value if the map contains the mapping for the key.
 * 
 *
 * Example 1:
 *
 * Input
 * ["MyHashMap", "put", "put", "get", "get", "put", "get", "remove", "get"]
 * [[], [1, 1], [2, 2], [1], [3], [2, 1], [2], [2], [2]]
 * Output
 * [null, null, null, 1, -1, null, 1, null, -1]
 *
 * Explanation
 * MyHashMap myHashMap = new MyHashMap();
 * myHashMap.put(1, 1); // The map is now [[1,1]]
 * myHashMap.put(2, 2); // The map is now [[1,1], [2,2]]
 * myHashMap.get(1);    // return 1, The map is now [[1,1], [2,2]]
 * myHashMap.get(3);    // return -1 (i.e., not found), The map is now [[1,1], [2,2]]
 * myHashMap.put(2, 1); // The map is now [[1,1], [2,1]] (i.e., update the existing value)
 * myHashMap.get(2);    // return 1, The map is now [[1,1], [2,1]]
 * myHashMap.remove(2); // remove the mapping for 2, The map is now [[1,1]]
 * myHashMap.get(2);    // return -1 (i.e., not found), The map is now [[1,1]]
 * 
 *
 * Constraints:
 *
 * 0 <= key, value <= 106
 * At most 104 calls will be made to put, get, and remove.
 */

class MyHashMap {
    private buckets: [number, number][][]
    private resizeFactor: number
    private size: number
    private occupiedBuckets: number

    constructor() {
        this.size = 32
        this.buckets =  Array.from({ length: this.size }, () => [])
        this.resizeFactor = 0.75
        this.occupiedBuckets = 0
    }

    put(key: number, value: number): void {
        if (this.occupiedBuckets / this.size > this.resizeFactor) {
            this.resize()
        }

        let hashedKey = this.hash(key, this.size)
        let bucket = this.buckets[hashedKey]

        for (let pair of bucket) {
            if (pair[0] === key) {
                pair[1] = value;
                return;
            }
        }

        bucket.push([key, value]);
        this.occupiedBuckets++;
    }

    get(key: number): number {
        let hashedKey = this.hash(key, this.size)
        let bucket = this.buckets[hashedKey]

        for (const [currentKey, currentValue] of bucket) {
            if (key === currentKey) {
                return currentValue
            }
        }

        return -1
    }

    remove(key: number): void {
        let hashedKey = this.hash(key, this.size)
        let bucket = this.buckets[hashedKey]
        
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket.splice(i, 1);
                this.occupiedBuckets--;
            }
        }
    }

    private resize() {
        const newSize = this.size * 2;
        const newBuckets: [number, number][][] = Array.from({ length: newSize }, () => []);
        
        for (const bucket of this.buckets) {
            for (const [key, value] of bucket) {
                const index = this.hash(key, newSize);
                newBuckets[index].push([key, value]);
            }
        }

        this.size = newSize;
        this.buckets = newBuckets;
    }

    private hash(key: number, size: number): number {
        return key % size;
    }
}
