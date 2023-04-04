import {
  table,
  getMinifiedRecords,
  findRecordByFilter,
} from "../../lib/airtable";

const getCoffeeStorebyId = async (req, res) => {
  const { id } = req.query;

  try {
    if (id) {
      const records = await findRecordByFilter(id);

      if (records.length !== 0) {
        res.json(records);
      } else {
        res.json({ message: `id could not be found` });
      }
    } else {
      res.status(400);
      res.json({ message: "id is missing" });
    }
  } catch (err) {
    console.error("Something went wrong", err);
    res.json({ messsage: "Somethig went wrong" });
  }
};

export default getCoffeeStorebyId;
