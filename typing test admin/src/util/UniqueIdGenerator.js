// import { v4 as uuidv4 } from "uuid";

// function generateUniqueId() {
//     // Generate a UUID and hash it to a 6-digit unique ID
//     const uuid = uuidv4(); // Example: 'e4c2f9d2-4e5d-11e8-96c9-ff573dfc1099'
//     const hash = Math.abs(uuid?.split("-")[0]?.hashCode()); // Use the first part of the UUID and hash it
//     const uniqueId = hash.toString()?.slice(0, 6); // Ensure it's 6 digits
//     return uniqueId;
// }

function generateUniqueId() {
    // Generate a random 6-digit number
    const id = Math.floor(100000 + Math.random() * 900000); // Ensures a 6-digit number
    return id.toString(); // Return as a string for flexibility
  }

export {generateUniqueId}