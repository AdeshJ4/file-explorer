const useTraverseTree = () => {

    
    function insertNode(tree, itemId, itemName, isFolder) {

        console.log('useTraverseTree', tree, itemId, itemName, isFolder);
        
        if (tree.id === itemId && tree.isFolder) {
            tree.items.unshift({
                id: new Date().getTime(),
                name: itemName,
                isFolder,
                items: []
            });
        }

        console.log('here 1');
        
        const latestNode = tree.items.map((ob) => {
            return insertNode(ob, itemId, itemName, isFolder);
        });

        return { ...tree, items: latestNode };
    }


    
    function deleteNode(tree, nodeId) {
        // Filter out the node with the matching id
        const filteredItems = tree.items.filter((item) => item.id !== nodeId);

        const updatedItems = filteredItems.map((item) => {
            return deleteNode(item, nodeId);
        });

        return { ...tree, items: updatedItems };
    }

    function updateNode(tree, nodeId, newName) {
        if (tree.id === nodeId) {
            tree.name = newName;
            return tree;
        }

        const updatedItems = tree.items.map((item) => {
            return updateNode(item, nodeId, newName);
        });

        return { ...tree, items: updatedItems };
    }

    return { insertNode, deleteNode, updateNode };
};

export default useTraverseTree;



// depth-first-search algo
// can be optimize using dynamic programming