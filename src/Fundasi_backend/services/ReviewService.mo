import User "../models/User";
import Result "mo:base/Result";

// Service Review
module {
    public func postReview(userPrincipal : Principal, user : User.User, comment : Text) : Result.Result<Review, Text> {
        let review = {
            id = Principal.toText(userPrincipal) # "_review";
            user = user;
            comment = comment;
        };
        #ok(review);
    };
};