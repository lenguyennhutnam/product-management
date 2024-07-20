const getTree = (arr, parentId = "") => {
    const childArr = [];
    arr.forEach((item) => {
        if (item.parent_id == parentId) {
            const children = getTree(arr, item.id);
            if (children.length > 0) {
                item.children = children;
            }
            childArr.push(item);
        }
    });
    return childArr;
};

module.exports.createMultiMenu = getTree;
