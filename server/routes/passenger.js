import express from "express";
import User from "../models/User.js";
import Ride from "../models/ride.js"
import bcrypt from "bcrypt";

const router = express.Router();

/* Add Coins to Available Coins */
router.post("/addcoins", async (req, res) => {
    try {
        const userId = req.body.userId;
        const coinsToAdd = req.body.coinsToAdd;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Add coins to availableCoins
        user.availableCoins += coinsToAdd;

        // Save the updated user
        const updatedUser = await user.save();

        res.status(200).json({ success: true, data: { availableCoins: updatedUser.availableCoins } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

/* Reduce Coins from Available Coins */
router.post("/reducecoins", async (req, res) => {
    try {
        const userId = req.body.userId;
        const coinsToReduce = req.body.coinsToReduce;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Check if there are enough coins to reduce
        if (user.availableCoins < coinsToReduce) {
            return res.status(400).json({ success: false, error: "Not enough coins available" });
        }

        // Reduce coins from availableCoins
        user.availableCoins -= coinsToReduce;

        // Save the updated user
        const updatedUser = await user.save();

        res.status(200).json({ success: true, data: { availableCoins: updatedUser.availableCoins } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Route to book a cab
router.post("/book", async (req, res) => {
    try {
        // Assuming userId and other required parameters are sent in the request body
        const { userId, origin, destination, plan, assignedTo } = req.body;

        // Check if the user exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Create a new cab booking entry
        const newBooking = await new Ride({
            user: userId,
            origin,
            destination,
            plan,
            assignedTo,
        });

        // Save the booking entry
        const savedBooking = await newBooking.save();

        const updatedDriver = await User.findByIdAndUpdate(assignedTo, { isAvailable: false }, { new: true });

        res.status(200).json({ success: true, data: savedBooking });
    } catch (error) {
        console.error('Error during cab booking:', error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Route to fetch the best-rated driver
router.get("/getdriver", async (req, res) => {
    try {
        // Fetch all drivers and sort them in descending order based on ratings
        const bestDriver = await User.findOne({ userType: "Driver", isAvailable: true })
            .sort({ ratings: -1 })
            .exec();

        if (!bestDriver) {
            // Handle case where no drivers are available
            res.status(404).json({ success: false, error: "No drivers available" });
            return;
        }

        res.status(200).json({ success: true, data: bestDriver });
    } catch (error) {
        console.error('Error fetching the best-rated driver:', error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Route to get and update user rating
router.post("/updaterating", async (req, res) => {
    try {
        const userId = req.body.userId;
        const newRating = req.body.newRating;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Get the current rating
        const currentRating = user.rating || 0;

        // Calculate the new average rating
        const updatedRating = (Number(currentRating) + Number(newRating)) / 2;

        // Update the user's rating
        user.rating = updatedRating;

        console.log(updatedRating, currentRating, newRating)

        // Save the updated user
        const updatedUser = await user.save();

        res.status(200).json({ success: true, data: { ratings: updatedUser.ratings } });
    } catch (error) {
        console.error('Error updating user rating:', error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

router.put('/completeride/:rideId', async (req, res) => {
  try {
    const rideId = req.params.rideId;

    // Update the Ride model
    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      { $set: { isProgress: false } },
      { new: true }
    );

    if (!updatedRide) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Update the User model
    const driverId = updatedRide.assignedTo;
    if (driverId) {
      await User.findByIdAndUpdate(
        driverId,
        { $set: { isAvailable: true } },
        { new: true }
      );
    }

    res.json({ message: 'Ride completed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/assignedride/:driverId", async (req, res) => {
    try {
        const driverId = req.params.driverId;

        // Find the last assigned ride for the driver
        const lastAssignedRide = await Ride.findOne({ assignedTo: driverId , isProgress:true}).sort({ createdAt: -1 }).populate({
            path: 'user',
            select: 'username gender mobile'
        });

        if (!lastAssignedRide) {
            return res.status(200).json({ success: true, data: null });
        }

        res.status(200).json({ success: true, data: lastAssignedRide });
    } catch (error) {
        console.error('Error fetching last assigned ride:', error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

export default router;
