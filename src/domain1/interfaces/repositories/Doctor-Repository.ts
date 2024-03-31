import Doctor from "../../entities/Doctor";

export interface  IDoctorsRepository {
    findDoctorByEmail(email: string): Promise<Doctor | null>;
    findDoctorById(id: string): Promise<Doctor | null>;
    saveBasicInfo(doctor: Partial<Doctor>): Promise<string>;
    saveProfessionalInfo(doctor: Partial<Doctor>,email:string):Promise<void>;
    saveAdditionalInfo(doctor: Partial<Doctor>,email:string):Promise<void>;
    markAsVerified(email:string): Promise<void>; 
}

























// In a typical Doctor repository, you would want to implement methods for basic CRUD (Create, Read, Update, Delete) operations, as well as methods for specific queries or operations related to doctors. Here are some common methods you might want to include in a Doctor repository:

// ### CRUD Operations:
// 1. **Create Doctor**: Save a new doctor to the database.
// 2. **Find Doctor by ID**: Retrieve a doctor by their unique ID.
// 3. **Update Doctor**: Update an existing doctor's information.
// 4. **Delete Doctor**: Remove a doctor from the database.

// ### Query Operations:
// 5. **Find Doctors by Specialization**: Retrieve doctors based on their specialization.
// 6. **Find Doctors by Availability**: Find doctors available on a particular day and time.
// 7. **Find Doctors by Name**: Search for doctors by their first or last name.
// 8. **Find Doctors by Rating**: Get doctors sorted by their average rating.
// 9. **Find Doctors by Location**: Search for doctors within a certain distance from a given location.

// ### Additional Operations:
// 10. **Add Review to Doctor**: Add a new review for a specific doctor.
// 11. **Get Doctor's Reviews**: Retrieve all reviews for a particular doctor.
// 12. **Veriltation Schedule**: Retrieve a doctor's consultation schedule for a specific period.
// 14. **Update Doctor's Availability**: Modify a doctor's availability schedule.
// fy Doctor**: Mark a doctor as verified.
// 13. **Get Doctor's Consu
// ### Example User Repository and Use Cases:
// For the user repository and use cases, assuming users interact with the system by booking appointments, providing reviews, and searching for doctors, here are some methods you might want to include:

// #### UserRepository:
// 1. **Create User**: Save a new user to the database.
// 2. **Find User by ID**: Retrieve a user by their unique ID.
// 3. **Update User**: Update an existing user's information.
// 4. **Delete User**: Remove a user from the database.
// 5. **Authenticate User**: Verify user credentials for login.

// #### Use Cases:
// 1. **Book Appointment**: Reserve an appointment with a doctor for a user.
// 2. **Cancel Appointment**: Cancel a previously booked appointment.
// 3. **Add Review for Doctor**: Allow a user to provide feedback by adding a review for a doctor.
// 4. **Search Doctors**: Retrieve a list of doctors based on search criteria (e.g., specialization, location).
// 5. nable users to update their login credentials.
// 8. **View Doctor's Profile**: Retrieve detailed information about a specific doctor.
// 9. **View User Profile**: Fetch user details and activity history.
// **View Appointment History**: Fetch a user's past and upcoming appointments.
// 6. **Update User Preferences**: Allow users to update their preferences (e.g., notification settings, preferred language).
// 7. **Change Password**: E
// These methods and use cases will depend on the specific requirements of your application. You can adjust and expand them as needed to fulfill the functionality required by your Doctor consultation booking website.