const loadData = () => {
  // checking file exist or not
  if (!fs.existsSync(DATA_FILE)) {
    return { id: '1', name: 'root', isFolder: true, items: [] };
  }
  return fs.readJsonSync(DATA_FILE);
};