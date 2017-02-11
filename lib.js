class MiBandApi {

    constructor(server) {
        this.server = server;
    }

    vibrate() {
        return this._writeValue(0x1802, 0x2a06, Uint8Array.of(1));
    }

    _writeValue(service, characteristic, value) {
        return this.server.getPrimaryService(service)
            .then(service => service.getCharacteristic(characteristic))
            .then(characteristic => characteristic.writeValue(value))
    }
}


class MiBand {

    connect() {
        const options = {
            optionalServices: [0x1802],
            acceptAllDevices: true
        };

        return navigator.bluetooth.requestDevice(options)
            .then(device => {
                this.device = device;

                return device.gatt.connect();
            })
            .then((server) => {
                return new MiBandApi(server);
            })
    }

    disconnect() {
        if (this.device) {
            this.device.gatt.disconnect();
        }
    }

}
