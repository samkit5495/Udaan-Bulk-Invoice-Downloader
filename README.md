# Download Udaan Invoices in Bulk

## Installation

1. Install Packages

```
yarn install
```

2. Get Authorization Token

   - Login to Udaan Web Application using https://udaan.com/
   - Goto Inpect element and console tab
   - And run below snippet and copy output
     ```
     JSON.parse(localStorage.getItem('auth:token:c')).accessToken
     ```

3. Run below script to download invoices in bulk

```
node index.js <startDate> <endDate> <token>
```
