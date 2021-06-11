const showDevTools = function showDevTools() {
 try {
	 
	 require('electron').remote.getCurrentWindow().openDevTools();
	 console.log('Crack -- Loaded developer tools');
	 
 } catch(error) {
	 console.error('Crack -- Unable to load developer tools.');
 }
};