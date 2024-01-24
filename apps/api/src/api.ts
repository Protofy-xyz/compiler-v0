import { app, getMQTTClient } from 'protolib/api'
import * as path from 'path';
import * as fs from 'fs';
import BundleAPI from 'app/bundles/apis'
import { logger } from './logger';
import httpLogger from "pino-http";

const modulesDir = path.join(__dirname, 'modules');

const mqtt = getMQTTClient(logger)

const topicSub = (topic, cb) => {
    mqtt.subscribe(topic)
    mqtt.on("message", (topic, message) => {
        const parsedMessage = message.toString();
        cb(parsedMessage, topic)
    });
};

const topicPub = (topic, data) => {
    mqtt.publish(topic, data)
}

const deviceSub = (deviceName, component, componentName, cb) => {
    return topicSub(deviceName + '/' + component + '/' + componentName + '/state', cb)
}

const devicePub = async (deviceName, component, componentName, command) => {
    if (typeof command == "string") {
        topicPub(deviceName + '/' + component + '/' + componentName + '/command', command)
    } else {
        topicPub(deviceName + '/' + component + '/' + componentName + '/command', JSON.stringify(command))
    }
}

fs.readdir(modulesDir, (error, files) => {

    if (error) {
        logger.error('Error reading modules directory: ' + error);
        return
    }

    files.forEach((file) => {
        if (path.extname(file) === '.ts') {
            require(path.join(modulesDir, file));
            logger.debug(`API Module loaded: ${file.substr(0, file.length - 3)}`);
        }
    })
})


export const logRequest = httpLogger({
    serializers: {
        req: (req) => {
          if (process.env.NODE_ENV === "development") {
            return {
              method: req.method,
              url: req.url,
            };
          } else {
            return req;
          }
        },
        res: (res) => {
            if (process.env.NODE_ENV === "development") {
              return {
                code: res.statusCode,
              };
            } else {
              return res;
            }
        },
    },
    level: "info",
    transport: {
        target: 'pino-pretty'
    }
});

app.use(logRequest);

BundleAPI(app, { mqtt, devicePub, deviceSub })

export default app