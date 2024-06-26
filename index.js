import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = "https://api.udaan.com";

const invoiceUrl = "/api/pharma/csv/v1/invoice/";

const token = process.env.ACCESS_TOKEN;

if (process.argv.length != 4) {
  console.error(`This file expects start and end date in args
  node index.js <start_date> <end_date>
  e.g. node index.js 2024-03-31 2023-08-01`);
  process.exit(0);
}

const [, , startDate, endDate] = process.argv;

console.log(`Downloading invoices from ${startDate} to ${endDate}`);

const headers = {
  Authorization: `Bearer ${token}`,
  "X-App-Id": "udaan-web",
};

let orders = [];
let nextOrder;
do {
  try {
    const { data } = await axios.get(
      nextOrder
        ? `${baseUrl}/api/order/v1/list?count=5&older-than=${nextOrder.createdAt}&&skip-order-ids=${nextOrder.sellerOrderId}&user-order-type=ALL&filter=ALL`
        : `${baseUrl}/api/order/v1/list?count=5&older-than=${new Date(
            endDate
          ).getTime()}&user-order-type=ALL&filter=ALL`,
      {
        headers,
      }
    );
    if (
      data.length === 0 ||
      new Date(nextOrder?.createdAt) <= new Date(startDate)
    ) {
      break;
    }
    console.log(data[0].createdAt, data[0].sellerOrderId);
    nextOrder = data[0];
    await Promise.allSettled(data.map((i) => download(i)));
    orders = orders.concat(data);
    const orderIds = orders.map(({ sellerOrderId }) => sellerOrderId);
    console.log(
      `pulled ${orders.length}, unique ${new Set(orderIds).size} entries`
    );
  } catch (e) {
    console.error(e);
    break;
  }
} while (true);

async function download({ sellerOrderId, createdAt }) {
  const date = new Date(createdAt);
  const filePath = `./downloads/${date.getFullYear()}/${date.getMonth() + 1}/`;
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }
  return axios
    .get(baseUrl + invoiceUrl + sellerOrderId, {
      responseType: "blob",
      headers,
    })
    .then((response) => {
      fs.writeFileSync(filePath + `${sellerOrderId}.csv`, response.data);
      return `${sellerOrderId}.csv`;
    });
}
