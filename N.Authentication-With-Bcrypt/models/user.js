const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:[true,"Your username cannot be empty"]
    },
    password:{
        type: String,
        required:[true,"Your password cannot be empty"]
    }
});

userSchema.statics.findAndVerify = async function(username, password){
    const user  = await this.findOne({username});
    const result = await bcrypt.compare(password,user.password);
    
    return result? user : false;
};

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,12);
    next();
});

module.exports = mongoose.model("User",userSchema);