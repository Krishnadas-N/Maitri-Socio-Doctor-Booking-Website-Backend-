"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSearchError = exports.PostCreationError = void 0;
var PostCreationError;
(function (PostCreationError) {
    PostCreationError["MissingDoctorId"] = "MissingDoctorId";
    PostCreationError["MissingTitle"] = "MissingTitle";
    PostCreationError["MissingContent"] = "MissingContent";
    PostCreationError["InvalidMedia"] = "InvalidMedia";
    PostCreationError["CreationFailed"] = "CreationFailed";
})(PostCreationError || (exports.PostCreationError = PostCreationError = {}));
var PostSearchError;
(function (PostSearchError) {
    PostSearchError["MissingQuery"] = "MissingQuery";
    PostSearchError["SearchFailed"] = "SearchFailed";
})(PostSearchError || (exports.PostSearchError = PostSearchError = {}));
