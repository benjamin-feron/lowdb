import { deepStrictEqual as deepEqual, throws } from 'assert';
import fs from 'fs';
import tempy from 'tempy';
import { JSONFileSync } from './adapters/JSONFileSync.js';
import { LowSync } from './LowSync.js';
import { MissingAdapterError } from './MissingAdapterError.js';
function createJSONFile(obj) {
    const file = tempy.file();
    fs.writeFileSync(file, JSON.stringify(obj));
    return file;
}
export async function testNoAdapter() {
    // Ignoring TypeScript error and pass incorrect argument
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    throws(() => new LowSync(), MissingAdapterError);
}
export async function testLowSync() {
    // Create JSON file
    const obj = { a: 1 };
    const file = createJSONFile(obj);
    // Init
    const adapter = new JSONFileSync(file);
    const low = new LowSync(adapter);
    low.read();
    // Data should equal file content
    deepEqual(low.data, obj);
    // Write new data
    const newObj = { b: 2 };
    low.data = newObj;
    low.write();
    // File content should equal new data
    const data = fs.readFileSync(file).toString();
    deepEqual(JSON.parse(data), newObj);
}
