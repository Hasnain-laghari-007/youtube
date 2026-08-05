import mongoose from "mongoose";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";

const toggleSubscribe = asyncHandler(async (req, res) => {
  const channelId = req.params?.id;
  const userId = req.user?._id;
  if (!channelId || !mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError("Invalid channel ID", 400);
  }

  if(userId.toString() === channelId.toString()){
        throw new ApiError("You cannot subscribe yourSelf",400)
    }
    
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    const isAlreadySubscribed = await Subscription.findOne({
      subscriber: userId,
      channel: channelId,
    }).session(session);

    if (isAlreadySubscribed) {
      await Subscription.findByIdAndDelete(isAlreadySubscribed?._id).session(
        session,
      );
      await User.findByIdAndUpdate(channelId, {
        $inc: {
          subscribers: -1,
        },
      }).session(session);

      await session.commitTransaction();
      return res
        .status(200)
        .json(new ApiResponse("Unsubscribed successfully", {}, 200));
    } else {
      await Subscription.create([{ subscriber: userId, channel: channelId }], {
        session,
      });
      await User.findByIdAndUpdate(channelId, {
        $inc: { subscribers: 1 },
      }).session(session);

      await session.commitTransaction();
      return res
        .status(200)
        .json(new ApiResponse("Subscribed successfully", {}, 200));
    }
  } catch (error) {
    await session.abortTransaction();
    throw new ApiError("Error occur while performing task", 500);
  } finally {
    await session.endSession();
  }
});

export { toggleSubscribe };
