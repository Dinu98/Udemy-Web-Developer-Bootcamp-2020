const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary')

module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.new = (req,res) => {
    res.render("campgrounds/new");
};

module.exports.show = async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    .populate({
        path: "reviews",
        populate: {
            path: "user"
        }
    })
    .populate("user");

    if(!campground){
        req.flash('error','Cannot find that campground');
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
};

module.exports.edit = async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error','Cannot find that campground');
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
};

module.exports.create = async (req,res) => {
    req.body.campground.user = req.user._id;
    req.body.campground.images = req.files.map( fl => ({url: fl.path, filename: fl.filename}));
    await new Campground(req.body.campground).save().
        then( (newCampground) => {
            console.log(newCampground);
            req.flash("success", "Successfully created a new campground");
            res.redirect(`/campgrounds/${newCampground._id}`);
        });
}

module.exports.patch = async (req,res) => {
    const campground = await Campground.findById(req.params.id);
    Object.assign(campground, req.body.campground);
    const images = req.files.map( fl => ({url: fl.path, filename: fl.filename}))
    campground.images.push(...images)
    if(req.body.deleteImages){
        for(let img of req.body.deleteImages){
            await cloudinary.uploader.destroy(img);
        }
        await campground.updateOne({ $pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    await campground.save();
    req.flash("success", "Successfully updated a campground");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.delete = async (req,res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted a campground");
    res.redirect("/campgrounds");
};