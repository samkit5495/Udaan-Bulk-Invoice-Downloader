# Download Udaan Invoices in Bulk

## Installation

1. Install Packages

```
yarn install
```

2. Get Authorization Token

- Copy `.env.example` to `.env`
- Login to Udaan Web Application using https://udaan.com/
- Goto Inpect element and console tab
- And run below snippet and copy output
  ```
  JSON.parse(localStorage.getItem('auth:token:c')).accessToken
  ```
- Set this copied token as the value of `ACCESS_TOKEN` variable in `.env` file

3. Run below script to download invoices in bulk

```
node index.js <startDate> <endDate>
```
