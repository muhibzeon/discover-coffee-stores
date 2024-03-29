import {
  table,
  getMinifiedRecords,
  findRecordByFilter,
} from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, address, region, voting, imgUrl } = req.body;

    try {
      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          res.json(records);
        } else {
          //Create record
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  region,
                  voting,
                  imgUrl,
                },
              },
            ]);

            const records = getMinifiedRecords(createRecords);
            res.json({ records });
          } else {
            res.status(400);
            res.json({ message: "id or name is missing" });
          }
        }
      } else {
        res.status(400);
        res.json({ message: "id or name is missing" });
      }
    } catch (err) {
      console.error("Error creating or finding store", err);
      res.status(500);
      res.json("Error creating or finding Store", err);
    }
  }
};

export default createCoffeeStore;
