const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/asd', {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
    console.log("Successfully connected");
})
.catch( err => {
    console.log("Error while trying to connect");
    console.log(err);
});

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:String,
    age:Number
});

const tweetSchema = new Schema({
    text:String,
    likes:Number,
    user: {type: Schema.Types.ObjectId, ref:"User"}
});

const User = mongoose.model("User",userSchema);
const Tweet = mongoose.model("Tweet", tweetSchema);

const makeTweets = async () => {
    await User.deleteMany({});
    await Tweet.deleteMany({});
    const user = new User({name:"name", age:31});
    const tweet = new Tweet({text:"text", likes:4});
    tweet.user = user;
    await user.save();
    await tweet.save();
}

const findTweet = async () => {
    await makeTweets();
    const tweet = await Tweet.findOne({}).populate('user');
    console.log(tweet);

};

findTweet();
