export const getCroppedImg = (imageSrc, crop) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            const ctx = canvas.getContext('2d');
            
            ctx.drawImage(
                image,
                crop.x,
                crop.y,
                crop.width,
                crop.height,
                0,
                0,
                canvas.width,
                canvas.height
            );
            
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject('Crop failed');
                    return;
                }
                resolve(URL.createObjectURL(blob));
            }, 'image/jpeg');
        };
    });
};
