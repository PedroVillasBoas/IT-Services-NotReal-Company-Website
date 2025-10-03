# IT Services (NotReal) Company Website
**Course:** Front-end Development - CESAR School

<div align="center">

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Status](https://img.shields.io/badge/status-released-green.svg)
![Contributors](https://img.shields.io/badge/contributors-1-orange.svg)

</div>

This project is a static front-end implementation for a fictional IT Services company, built to fulfill the requirements specified in the projeto_av1.pdf document. It consists of five HTML pages, styled with CSS, and includes client-side form validation and interaction using JavaScript.

## Project Structure
The project is organized into the following folders and files:

```
/
|-- assets/              # Contains all static assets like images and logos
|-- css/
|   |-- styles.css       # Global styles for layout, header, footer, etc.
|   |-- forms.css        # Specific styles for all form elements
|-- js/
|   |-- main.js          # Main script for event handling and page initialization
|   |-- validation.js    # All data validation functions (email, CPF, password, etc.)
|   |-- utils.js         # Helper/utility functions (input masks, age calculation)
|-- index.html           # Main company presentation page
|-- login.html           # Client login page
|-- change_password.html # Change password page
|-- register.html        # New client registration page
|-- cart.html            # Service requests (shopping cart) page
|-- README.md            # This file
|-- LICENSE              # MIT License
```

## How to Run and Test
As this is a static website with no backend dependencies, you can run it directly in your web browser.

- **Clone or Download**: Get all the project files onto your local machine.
- **Open in Browser**: Navigate to the project directory and open the index.html file in any modern web browser (e.g., Chrome, Firefox, Edge).

## Developer Assumptions & Choices
- **Language**: All visible text content is in Brazilian Portuguese.
- **Currency**** &** **Dates**: Currency on the cart page is formatted as Brazilian Reais (R$) and dates are formatted as DD/MM/YYYY, which is standard for Brazil.
- **Login** **Simulation**: The login process is simulated using *sessionStorage*. A successful login sets a flag (*isLoggedIn*) which is used to show the "Service Requests" link in the header. User email is also stored to be displayed on the cart page. This data is cleared when the browser tab is closed.

## Customization & Asset Replacement
- **Logo**: To replace the generic logo, update the assets/logo.png file. An SVG is highly recommended.
- **Gallery Images**: Replace assets/gallery1.jpg through gallery4.jpg. For best results, use images with a consistent aspect ratio (e.g., 4:3) and a recommended size of 1600x900 pixels.
- **Payment Icons**: Replace assets/payment_*.png. SVGs are preferred.
- **YouTube Video**: The embedded video URL can be changed in index.html. Find the <iframe> tag and replace the URL in the src attribute. 
    - (***Currently it has the trailer for one of my games.***)

# Made by
| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/47667167?v=4" width=115><br><sub>Pedro Villas Boas</sub>](https://github.com/PedroVillasBoas) |  [<img loading="lazy" src="https://avatars.githubusercontent.com/u/116602650?v=4" width=115><br><sub>Gislaine Reis</sub>](https://github.com/lainereis2002) |
| :---: | :---: |