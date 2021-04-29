var preorderTraversal = function(root) {
    if (!root.length) {
        return;
    }

    let arr = [];

    for (let i = 0; i < root.length; i++) {
        const v = root[i];
        
        arr.push(v);

        leftKey = i * 2 + 1;
        rightKey = i * 2 + 2;
        leftValue = root[leftKey];
        rightValue = root[rightKey];

        console.log('key:', i, leftKey, rightKey);
        console.log('value:', v, leftValue, rightValue);

        if (leftKey < root.length && leftValue) {
            arr.push(leftValue);
        }

        if (rightKey < root.length && rightValue) {
            arr.push(rightKey);
        }
    }

    return arr;
};

preorderTraversal([1,null,2,3]);