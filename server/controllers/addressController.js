import Address from "../models/Address.js"

//Add Address : /api/address/add
export const addAddress = async (req, res) => {
  try {
    const userId = req.userId; // ✅ from auth middleware
    const { address } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    await Address.create({ ...address, userId });
    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//Get Address : /api/address/get
export const getAddress = async (req, res) => {
  try {
    const userId = req.userId; // ✅ From middleware

    if (!userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const addresses = await Address.find({ userId });

    res.json({ success: true, addresses });
  } catch (error) {
    console.log("getAddress error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
