function updateImage() {
    console.log(222)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = templateOptions.width;
    canvas.height = templateOptions.height;

    createImage('https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/small/04-explode-tips/0055.jpg')
        .then(image => {
            ctx.drawImage(image.img, 0, 0);
        })
}

function createImage(src) {
    return new Promise((res, rej) => {
        const img = new Image();

        img.onload = function() {
            res(Object.assign(src, { img }));
        };

        img.onerror = function() {
            rej(`Could not load image at ${src}.`);
        };

        img.crossOrigin = templateOptions.crossOrigin;
        img.src = src;
    });
}