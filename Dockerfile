#Use NodeJS 16
FROM node:16

#Set Working Directory
WORKDIR  /app

#Get the latest NPM (for some reason, npm@latest doesn't work)
RUN npm install -g npm@8.8.0

#Install Dependencies
COPY package*.json ./

#Install the dependencies
RUN npm install

#Copy the Source code
COPY . .

#Expose
CMD ["npm", "start"]