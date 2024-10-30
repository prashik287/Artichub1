const Ebuyer = require('../models/Ebuyer');

async function updateuser(userData) {
    console.log(userData);
    try{
          const { email, firstName, lastName, dob, mobileno, address, city, state, zip, country } = userData;

    // Create an array to hold missing fields
    const missingFields = [];

    // Check for missing fields
    if (!email) missingFields.push('email');
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
    if (!dob) missingFields.push('dob');
    if (!mobileno) missingFields.push('mobileno');
    if (!address) missingFields.push('address');
    if (!city) missingFields.push('city');
    if (!state) missingFields.push('state');
    if (!zip) missingFields.push('zip');
    if (!country) missingFields.push('country');

    // If there are missing fields, throw an error with details
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Proceed to update the user if all fields are present
    let existingUser = await Ebuyer.updateOne(
        { email: email },
        {
            firstName: firstName,
            lastName: lastName,
            dob: dob,
            mobileno: mobileno,
            address: address,
            city: city,
            state: state,
            zip: zip,
            country: country,
        }
    );
    if (!existingUser){
        throw new Error("No user Found")
    }

    return existingUser;
    }catch(error){
        console.error("Error : ",error)
        throw new Error("Error Occured")
    }
}

module.exports = {
    updateuser
};
