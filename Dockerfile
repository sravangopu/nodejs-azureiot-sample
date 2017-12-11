FROM node:9

ADD package.json package.json
ADD package-lock.json package-lock.json

RUN npm install

ADD . .

CMD [ "node", "createdevice.js" ]

EXPOSE 8080
