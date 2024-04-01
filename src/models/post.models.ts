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