import { Post } from "../domain/entities/POST";

export enum PostCreationError {
    MissingDoctorId = 'MissingDoctorId',
    MissingTitle = 'MissingTitle',
    MissingContent = 'MissingContent',
    InvalidMedia = 'InvalidMedia',
    CreationFailed = 'CreationFailed'
}

export enum PostSearchError {
    MissingQuery = 'MissingQuery',
    SearchFailed = 'SearchFailed'
}

export interface postsReponseModel{
    post:Post;
    isLikedUser:boolean,
    isPermissionToCrud:boolean
}