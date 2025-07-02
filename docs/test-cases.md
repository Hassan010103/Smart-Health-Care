# Test Cases for Smart Health Care

| Test Case                | Steps                                                      | Expected Result                |
|--------------------------|------------------------------------------------------------|--------------------------------|
| Register User            | Fill registration form and submit                          | User account created           |
| Login User               | Enter credentials and submit                               | JWT token received, dashboard  |
| Search Doctor            | Enter specialty/location, click search                     | List of matching doctors shown |
| View Doctor Details      | Click on a doctor card                                     | Doctor profile page loads      |
| Search Treatment         | Select category or search, view treatments                 | List of treatments shown       |
| View Treatment Details   | Click on a treatment card                                  | Treatment detail page loads    |
| Book Appointment         | Select doctor, slot, confirm booking                       | Appointment created            |
| Pay for Appointment      | Click Pay Now, complete Razorpay test payment              | Payment marked complete        |
| Join Video Call          | Click Join Call on upcoming appointment                    | Video call page loads          |
| Chat with Doctor         | Send a message in chat box                                 | Message appears in chat        |
| Leave Review             | Submit review after completed appointment                  | Review appears on doctor page  |
| Admin Login              | Enter admin credentials, submit                            | Access to admin panel granted  |
| Add Doctor (Admin)       | Fill form, submit in admin panel                           | Doctor appears in list         |
| Edit Doctor (Admin)      | Edit doctor details, save                                  | Changes reflected in UI        |
| Delete Doctor (Admin)    | Click delete, confirm                                      | Doctor removed from list       |
| Add Treatment (Admin)    | Fill form, submit in admin panel                           | Treatment appears in list      |
| View Payments (Admin)    | Go to payments tab in admin panel                          | List of payments shown         | 