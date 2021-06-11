const Store = require('electron-store');
const store = new Store();
const uuid = require('uuid/v4');
const md5 = require('sha1');
const crypto = require('crypto');
if (!store.has('device_id')) store.set('device_id', uuid());
const {
    app,
    BrowserWindow
} = require('electron');
const path = require('path');
const req = require('request');
let window = null;
var check_restart = false;
function check_dark() {
    return new Promise((c, d) => {
        if (!store.has('dark_theme_enabler')) return c(false);
        return c(store.get('dark_theme_enabler'));
    });
}
function start_window() {
    window = new BrowserWindow({
        'icon': path.join(__dirname, 'img/favicon.png'),
        'title': 'Xyliase Generator Cracked',
        'width': 1200,
        'height': 800,
        'minWidth': 500,
        'minHeight': 650,
        'webPreferences': {
            'backgroundThrottling': false,
            'webSecurity': false,
            'allowRunningInsecureContent': true,
            'nativeWindowOpen': true,
            'nodeIntegration': true
        },
        'backgroundColor': '#7287D8',
        'show': false
    });
	window.openDevTools();
    if (store.has('last_data_window')) {
        var datawindow = store.get('last_data_window');
        window.setSize(datawindow.size[0], datawindow.size[1]);
        window.setPosition(datawindow.position[0], datawindow.position[1]);
    }
			
	store.set('user_token', 'cracked');
	store.set('device_id', 'cracked');
	store.set('data_a', 'cracked');
	store.set('language', 'en');
	
                            window.loadURL('file://' + __dirname + '/index.html?dark=true');
                            window.once('ready-to-show', () => {
                                window.show();
                            });
                            window.on('closed', function () {
                                window = null;
                            });
    
    window.on("close", function () {
        var o = window.getSize(),
            i = window.getPosition();
        store.set("last_data_window", {
            size: o,
            position: i
        })
    });
}
app.once('ready', () => {
    start_window();
});
app.on('window-all-closed', () => {
    if (!check_restart) app.quit();
});
function close_window() {
    window.close();
}
function check_token() {
    return new Promise((h, i) => {
        if (!store.has('user_token')) return h({
            'type': false
        });
        var j = {
            'method': 'GET',
            'headers': {
                'token': store.get('user_token')
            },
            'url': '' // https://onedash.net/app_reg/check
        };
        req(j, (k, l, m) => {
            if (!l || !m || m == '' || k || l.statusCode != 200) return h({
                'type': false
            });
            m = JSON.parse(m);
            if (!m.type) return h({
                'type': false
            });
            var n = m.version;
            var o = false;
            if (!store.has('app_version')) {
                store.set('app_version', n);
                o = true;
            } else if (store.get('app_version') != n) {
                o = true;
                store.set('app_version', n);
            }
            return h({
                'type': m.type,
                'v': {
                    'new': o,
                    'version': n
                }
            });
        });
    });
}
function get_update() {
    return new Promise((p, q) => {
        var r = {
            'method': 'GET',
            'headers': {
                'token': store.get('user_token'),
                'deviceid': store.get('device_id')
            },
            'url': '' // https://onedash.net/app_reg/get/update
        };
        req(r, function (s, t, u) {
            if (!t || !u || u == '' || s || t.statusCode != 200) return p({
                'type': false
            });
            var v = JSON.parse(u).data.content;
            var w = md5(store.get('user_token') + ':' + store.get('device_id'));
            store.set('data_a', v);
            return p({
                'type': true
            });
        });
    });
}