// 暴力双循环
// function sum(nums, target) {
//     let result = [];

//     for (let i = 0; i < nums.length; i++) {
//         for (let j = 1; j < nums.length; j ++) {
//             const a = nums[i];
//             const b = nums[j];

//             if (a + b === target) {
//                 result = [i, j];
//             }
//         }
//     }

//     return result;
// };

// Map
function sum(nums, target) {
    let result = [];
    let targetArray = new Map();
    targetArray.set(nums[0], 0);

    for(let i = 1; i < nums.length; i++) {
        const num1 = nums[i];
        const num2 = (target - num1);
        const k = targetArray.get(num2);

        if (k !== undefined) {
    
            return result = [k, i]; 
        } else {
            targetArray.set(num1, i);
        }
    }
}

const result = sum([2,7,11,15], 9);

console.log(result);