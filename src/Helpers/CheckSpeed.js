/* eslint-disable handle-callback-err */
/* eslint-disable prettier/prettier */
import RNFetchBlob from 'rn-fetch-blob';

const downloadSizeInBits = 12000000;
export const measureConnectionSpeed = (imageURIParam) => {
    const imageURI = imageURIParam
        ? imageURIParam
        : 'https://drive.google.com/open?id=1MBHJXeRxMLLwHFpqbgTdEPsFArMM0cz7';

    return new Promise((resolve, reject) => {
        const startTime = new Date().getTime();
        RNFetchBlob.config({
            fileCache: false,
        })
            .fetch('GET', imageURI, {})
            .then(
                res => {
                    const endTime = new Date().getTime();
                    const duration = (endTime - startTime) / 1000;
                    const speedKb = downloadSizeInBits / (1024 * duration);
                    const speedMb = downloadSizeInBits / (1024 * 1024 * duration);
                    resolve({ speedKb, speedMb });
                },
                err => {
                    resolve({ speedKb: 0 });
                },
            )
            .catch(reject);
    });
};
