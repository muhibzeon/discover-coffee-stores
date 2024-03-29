const Airtable = require("airtable");
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_KEY);

const table = base("coffee-stores");

const getMinifiedRecord = (record) => {
  return {
    recordId: record.id,
    ...record.fields,
  };
};

const getMinifiedRecords = (records) => {
  return records.map((record) => {
    return getMinifiedRecord(record);
  });
};

const findRecordByFilter = async (id) => {
  const findCoffeeStorerecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getMinifiedRecords(findCoffeeStorerecords);
};

export { table, getMinifiedRecords, findRecordByFilter };
