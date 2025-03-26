# CogniCarer Frontend Maintenance Guide
<img src="https://devweb2024.cis.strath.ac.uk/~fqb22133/static/documentation/Original on transparent.png" width="400">

[![StackShare](http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/andrewcrossan1/dementia-rehabilitation)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

## Table of Contents
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [Credits](#credits)

## Introduction
This document provides a guide to the maintenance of the CogniCarer frontend. 

CogniCarer is a mobile application created to support informal (unpaid) carers of people living with dementia.
The application provides a range of activities than can help to improve cognition and quality of life, including
spaced-retrieval memory games, reminiscence therapy and a section dedicated to providing mental health and wellbeing
support for carers.

The frontend of the application is built using React Native with Expo, which provides a cross-platform framework
full of beneficial and easy-to-use APIs.

The backend of the application is RESTful API built using Django and Django REST framework, with full API documentation
available at **https://devweb2024.cis.strath.ac.uk/fqb22133-python/api/schema/swagger-ui/**

The API endpoints can be accessed using the URL below:<br>
**https://devweb2024.cis.strath.ac.uk/fqb22133-python/**

## Prerequisites
Due to the beta nature of the application, it cannot be downloaded from the App Store or Google Play Store.
In order to run and use the application the following prerequisites are required:
> - Node.js - The JavaScript runtime that is used to run the React Native application.
> - Expo CLI - The command line interface for Expo, which is used to create, develop and publish the application.
> - Expo Go (iOS) or Expo Client (Android) - The Expo client application that is used to run the application on a mobile device.
> - A code editor (e.g. Visual Studio Code) - Used to view and edit the source code of the application.
> - A mobile device or emulator - Used to run the application.
> - A stable internet connection - Required to download the necessary dependencies and run the application.

## Installation
Before installing the application, create a file called `.env` in the root directory of the project.
Add the following environment variables to the `.env` file:
```
  EXPO_PUBLIC_API_URL=https://devweb2024.cis.strath.ac.uk/fqb22133-python/
```
To install the application, follow the steps below:
1. Clone the repository from gitlab.cis.strath.ac.uk using the following prompt in the command line:
   ```bash
      git clone https://gitlab.cis.strath.ac.uk/fqb22133/dementia-rehabilitation.git
      # You will be prompted to enter your GitLab username and password
  
      cd dementia-rehabilitation
  
      npm install
    
      npm start
   ```

2. Open the Expo Go or Expo Client application on your mobile device.
<br>You must be connected to the same network as the computer running the application.
<br>If you are using an emulator, you can alternatively run the following command in the terminal (Instead of `npm start`):
   ```bash
      # For Android
      npm run android
   ```
   ```bash
      # For iOS
      npm run ios
   ```

3. Scan the QR code displayed in the terminal or browser window similar to the one shown below:
<br><img src="https://devweb2024.cis.strath.ac.uk/~fqb22133/static/documentation/qr-code.png" width="400"> 

4. The application will now be running on your mobile device.
5. To stop the application, press `Ctrl + C` in the terminal window.

## Usage
The application is designed to be user-friendly and intuitive, with a range of features to support informal carers of people living with dementia.
The application is divided into three main sections:
1. **Spaced Retrieval Memory Games** - A matching game that helps to improve memory and cognitive function.
2. **Reminiscence Therapy** - A feature that allows carers to create and share photo albums with their loved ones.
3. **Carer Support** - A section dedicated to providing mental health and wellbeing support for carers.
4. **My Account** - A section that allows users to view and edit their account details.

The application is designed to be easy to navigate, with a bottom navigation bar that allows users to switch between the different sections of the application.

## Deployment
The application is currently in beta and is not available on the App Store or Google Play Store.
Deployment is not possible at this time, but the application can be run locally using the instructions provided in the [Installation](#installation) section.

## Development

The application has the following folder structure:<br>
``
    ├── assets
``
<br>
``
    ├── components
``
<br>
``
    ├── app
``
<br>
``
    ├── services
``
<br>
``
    ├── app.json
``
<br>
``
    ├── package.json
``
<br>
``
    ├── README.md
``

The `assets` folder contains images and other assets used in the application.

The `components` folder contains reusable components that are used throughout the application.

The `app` folder is the main entry point for the application.

The `services` folder contains services that are used to interact with the backend API, and Redux. 

The `app.json` file contains the configuration for the Expo application. 

The `package.json` file contains the dependencies and scripts for the application. 

The `README.md` file contains the documentation for the application.

Developing is simple, as the application is built using React Native with Expo, which provides a range of APIs and tools to make development easier.
Additionally, comprehensive documentation relevant to the application can be found from the following links:
- [React Native](https://reactnative.dev/docs/getting-started)
- [Expo](https://docs.expo.dev/)
- [Axios](https://axios-http.com/docs/intro)
- [Redux](https://redux.js.org/introduction/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Jest](https://jestjs.io/docs/getting-started)

## Testing
The application has been tested using a range of manual and automated testing techniques to ensure that it is robust and reliable.
The application has been tested on both iOS and Android devices, as well as emulators, to ensure that it works correctly on a range of devices.
The application has also been tested using a range of screen sizes and resolutions to ensure that it is responsive and accessible.

Running the following command in the terminal will run the automated Jest tests, while providing a coverage report:
```bash
  npm run test-with-coverage
```

## Contributing
During the duration of the dissertation project, the application is not open to contributions from external developers.
However, the application is open-source and contributions are welcome once the project has been completed.

## Credits
The CogniCarer application was developed by Andrew Crossan, a final year Computer Science student at the University of Strathclyde.
The application was developed as part of a dissertation project, supervised by Dr. Kieren Egan

The application was developed using a range of technologies, including React Native, Expo, Django and Django REST framework.
The application was developed using an agile methodology, with regular feedback from informal carers and healthcare professionals.