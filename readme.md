# WithDriverLicence HOC

WithDriverLicence is a react higher-order component (HOC) which enables a user to move with a component.

## Installation

Use the npmjs package manager [npmjs](https://npmjs.com) to install with-driver-licence.

Npm:
```bash
npm install with-driver-licence
```

Yarn:
```bash
yarn add with-driver-licence
```

## Usage

```javascript
// Importing withDriverLicence HOC from the package
import { withDriverLicence } from "with-driver-licence";

// Your component
const YourComponent = () => {
  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "yellow",
        fontWeight: "bold",
      }}
    >
      Your component
    </div>
  );
};

// Transforming your component to have driving abilities
const YourComponentWithDriverLicence = withDriverLicence(YourComponent);

// Using your transformed component in a page
export const Page = () => {
  return (
    <div>
      <YourComponentWithDriverLicence />
    </div>
  );
};
```

You can drive a component with arrow keys:

![Demo](https://drive.google.com/uc?id=1GEdz5rA42J8qqVAdnYGfzqz2-bQ_1YEm)

## License
[MIT](https://choosealicense.com/licenses/mit/)
