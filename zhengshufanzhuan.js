// 返回值在[−231,  231 − 1]范围之外 ，就返回 0。
function reverse(x) {
    let arr = x.toString().split('');

    if (x < 0) {
        arr = arr.slice(1);
    }

    let newArr = arr.reverse().join('');

    if (x < 0) {
        newArr = -newArr;
    }

    if (newArr < (Math.pow(2, 31) * -1) || newArr > (Math.pow(2, 31) - 1)) {
        return 0;
    }

    return newArr;
};

// const a = reverse(1534236469);
// console.log(a);
