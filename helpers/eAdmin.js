module.exports = {
    eAdmin : function(req,res,next){
        if(res.isAuthenticated()&& req.user.eAdmin ==1){
                return next()
            }
   req.flash("error_msg", "apenas admin")
   res.redirect("/")
 }


}