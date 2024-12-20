const old = {
    id: "1",
    name: "root",
    isFolder: true,
    items: [
        {
            id: "3ce25928-28dc-4d3a-9517-c0e672e68525",
            name: "dist",
            isFolder: true,
            items: []
        },
        {
            id: "d01ca31f-b465-470d-9de0-4e079f29aaa9",
            name: "src",
            isFolder: true,
            items: []
        },
        {
            id: "ac9dc0db-0bf5-4492-8c5e-e8a2d019e91b",
            name: "public",
            isFolder: true,
            items: []
        },
        {
            id: "cdcde20a-c2d9-4f27-ac2b-bdf1e53cebbb",
            name: "package.json",
            isFolder: false,
            items: []
        }
    ]
};


const newData = {
    id: "3ce25928-28dc-4d3a-9517-c0e672e68525",
    name: "dist",
    isFolder: true,
    items: [
        {
            id: "d1dc7d37-275a-4f79-b2d1-8c3def3df411",
            name: "3pl",
            isFolder: true,
            items: []
        },
        {
            id: "21edd04e-5f11-4b60-ad57-8ea1ffee4eaf",
            name: "myNotes.txt",
            isFolder: false,
            items: []
        }
    ]
};


const newFile = old.items.map((obj) => {
    return obj.id === newData.id ? newData : obj;
})

old.items = newFile;

console.log(JSON.stringify(old))
