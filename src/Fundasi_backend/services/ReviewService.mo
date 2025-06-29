import User "../models/User";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Review "../models/Review";

// Service Review
module {

    public func getAllReviews(reviews : Review.Reviews) : [Review.Review] {
        Iter.toArray(reviews.vals());
    };

    public func postReview(userPrincipal : Principal, user : User.User, comment : Text) : Result.Result<Review.Review, Text> {
        let review = {
            id = Principal.toText(userPrincipal) # "_review";
            user = user;
            comment = comment;
        };
        #ok(review);
    };

    public func deleteReview(reviews : Review.Reviews, userId  : Principal) : Result.Result<Review.Review, Text> {
    switch (reviews.get(userId)) {
        case (?rev) {
            let _ = reviews.remove(userId);
            #ok(rev);
        };
        case (null) {
            #err("Review tidak ditemukan");
        };
    };
    };
};