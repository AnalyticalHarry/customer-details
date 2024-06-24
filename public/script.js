const form = document.getElementById("customerForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const dateOfBirth = document.getElementById("dateOfBirth").value;
  const streetAddress = document.getElementById("streetAddress").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const postalCode = document.getElementById("postalCode").value;
  const phoneType = document.getElementById("phoneType").value;
  const phoneNumber = document.getElementById("phoneNumber").value;

  const customer = {
    firstName: firstName,
    lastName: lastName,
    dateOfBirth: dateOfBirth,
    address: {
      streetAddress: streetAddress,
      city: city,
      state: state,
      postalCode: postalCode
    },
    phoneNumber: [{ type: phoneType, number: phoneNumber }]
  };

  // Send customer object to the server
  fetch("/saveCustomer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(customer)
  })
    .then((response) => {
      if (response.ok) {
        console.log("Customer data saved to server");
        form.reset(); // Reset form after successful submission
      } else {
        console.error("Error saving customer data to server");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
