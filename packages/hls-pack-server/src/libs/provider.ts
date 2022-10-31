import * as fs from 'fs';

export function exists (filePath: string) {
	return new Promise<boolean>((resolve) => {
		resolve(fs.existsSync(filePath));
	});
}

export function getStream (filePath: string) {
	return new Promise<fs.ReadStream>((resolve) => {
		resolve(fs.createReadStream(filePath));
	});
}

// export function getManifestStream (filePath: string) {
// 	return new Promise((resolve, reject) => {
// 		resolve(fs.createReadStream(filePath));
// 	});
// }
