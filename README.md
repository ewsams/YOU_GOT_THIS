# You Got This AI: Interact with PDFs as a Chatbot

You Got This AI is a powerful application that allows users to upload PDFs, convert them into vector embeddings, and interact with the content through a chatbot interface. By leveraging advanced AI techniques, the application enables users to intuitively explore and engage with their PDF documents in a conversational manner.

## Features

- Upload PDF files and convert them into vector embeddings
- Interact with the PDF content through a chatbot interface
- Advanced AI techniques for intuitive exploration and engagement
- User-friendly interface for seamless interaction

## YouGotThisAiFe

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.1.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


The npm `deploy-frontend` command deploys the front end to the deployed AWS bucket.


### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Running the Node Express App

In the root directory of the project, you'll find a Node Express app that needs to be run locally during development. To run the app, follow these steps:

1. Navigate to the root directory in your terminal or command prompt.
2. Run `npm install` to install the required dependencies.
3. Run `node app.js` or `npm start` to start the Node Express app.

The app should now be running on the specified port, usually `http://localhost:8081`.

## Running the Python Flask App

There's also a Python Flask app in the root directory of the project, which needs to be run locally during development. To run the app, follow these steps:

1. Navigate to the root directory in your terminal or command prompt.
2. Create a virtual environment with `python -m venv venv` or `virtualenv venv`.
3. Activate the virtual environment with `source venv/bin/activate` (Mac/Linux) or `venv\Scripts\activate` (Windows).
4. Install the required dependencies with `pip3 install -r requirements.txt`.
5. Run the Flask app with `flask run` or `python3 app.py`.

The app should now be running on the specified port, usually `http://localhost:5000`.

## Important Setup Note

Before running the application, add the following line to the top of the `node_modules/pdfjs-dist/types/src/display/text_layer.d.ts` file:

```typescript
declare type OffscreenRenderingContext = any;
```

## Build and deploy the front end application
1. First run the `ng build` command 
2. Next after the app has built run the `npm run deploy-frontend` command

## Backend Node
The following command will initialize the node backend to the elastic-beanstalk instance 
`eb init -p "Node.js" app.js`

the following comand will deploy and rebuild the curren node application 
`eb deploy`

## Backend 
Both Ports for the Node and Python app need to be changed to 8081 
before deploying to Elastic Beanstalk

--update the .env files and the application.py file if not correct.