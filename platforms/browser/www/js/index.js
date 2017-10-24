var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.initApp();
    },

    // Update DOM on a Received Event
    initApp: function() {
        hockeyapp.start(null, null, "7c9c05ad56cf42f3a7674f8f49543f9d");

        cordova.plugins.notification.local.registerPermission(function (granted) {
            // console.log('Permission has been granted: ' + granted);
        });

        this.startReceiving();
    },

    startReceiving: function () {
        var beaconRegions = [];

        var Beacons = [
            {
                "uuid": "B2BA44BA-0BC1-4EA8-9A00-AF6EB0399A00",
                "identifier": "BLE-1",
                "minor": "393",
                "major": "101"
            },
            {
                "uuid": "B0702880-A295-A8AB-F734-031A98A512DE",
                "identifier": "MAC",
                "minor": "1000",
                "major": "5"
            },
            {
                "uuid": "B2BA44BA-0BC1-4EA8-9A00-AF6EB0399A00",
                "identifier": "BLE-2",
                "minor": "390",
                "major": "101"
            },
            {
                "uuid": "B2BA44BA-0BC1-4EA8-9A00-AF6EB0399A00",
                "identifier": "BLE-3",
                "minor": "392",
                "major": "101"
            }
        ];

        for (var i in Beacons) {
            var b                      = Beacons[i];
            beaconRegions[b.identifier] = new cordova.plugins.locationManager.BeaconRegion(b.identifier, b.uuid, b.major, b.minor);
        }

        cordova.plugins.notification.local.schedule({
            title: "Welcome to Exterion ",
            message: "Hey hey, your're now enter the Exterion " +" Zone!",
            sound: "file://sounds/message.mp3",
            icon: "https://maxcdn.icons8.com/Share/icon/Logos//ibeacon1600.png"
        });

        var delegate = new cordova.plugins.locationManager.Delegate();

        delegate.didStartMonitoringForRegion = function (result) {};

        delegate.didEnterRegion = function (result) {
            cordova.plugins.notification.local.schedule({
                title: "Welcome to Exterion ",
                message: "Hey hey, your're now enter the Exterion Zone!",
                sound: "file://sounds/message.mp3",
                icon: "https://maxcdn.icons8.com/Share/icon/Logos//ibeacon1600.png"
            });

            cordova.plugins.notification.local.on("click", function(notification) {
                var ref = cordova.InAppBrowser.open('https://stud.hosted.hr.nl/0874349/exterion/coupon.html', '_blank', 'location=yes');
            });

            cordovaHTTP.post(postURL, {
                "beaconID": result.region.identifier,
                "contentID": "01",
                "timeStamp": new Date().toLocaleString(),
                "userDeviceID": deviceId
            }, {
                "Content-Type": "application/x-www-form-urlencoded"
            }, function (response) {
                cordova.plugins.locationManager.appendToDeviceLog(">>>|| HTTPREQUEST ||<<<", JSON.stringify(response));
                console.log(">>>|| HTTPREQUEST ||<<<", JSON.stringify(response));
            }, function (fail) {
                cordova.plugins.locationManager.appendToDeviceLog(">>>|| HTTPREQUESTFAIL ||<<<", JSON.stringify(fail));
                console.log(">>>|| HTTPREQUESTFAIL ||<<<", JSON.stringify(fail));
            });
        };

        delegate.didExitRegion = function (result) {
            //SEND DATA
        };

        cordova.plugins.locationManager.setDelegate(delegate);

        cordova.plugins.locationManager.requestAlwaysAuthorization();

        // Loop BeaconRegions to setup region monitoring.
        for (var y in beaconRegions) {
            var br = beaconRegions[y];
            if (br == undefined) continue;
            cordova.plugins.locationManager.startMonitoringForRegion(br);
        }
    }
};

app.initialize();