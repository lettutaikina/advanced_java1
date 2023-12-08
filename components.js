// components.js

// Function to create a table row for a restaurant
const restaurantRow = (restaurant) => {
  // Destructuring to extract name and company properties
  const { name, company } = restaurant;

  // Creating a new table row element
  const tr = document.createElement('tr');

  // Setting innerHTML to create the table row content
  tr.innerHTML = `
    <td>${name}</td>
    <td>${company}</td>
  `;

  // Returning the created table row element
  return tr;
};

// Function to generate HTML content for the restaurant modal
const restaurantModal = (restaurant, menu) => {
  // Destructuring to extract various properties from the restaurant object
  const { name, address, postalCode, city, phone } = restaurant;

  // Extracting the courses array from the menu object
  const { courses } = menu;

  // Using forEach to iterate over the courses array and generate menu items HTML content
  let menuHtml = '';
  courses.forEach((course) => {
    menuHtml += `
      <tr>
        <td>${course.name}</td>
        <td>${course.diets || ' - '}</td>
        <td>${course.price || ' - '}</td>
      </tr>
    `;
  });

  // Concatenating extracted properties and generated menu items HTML
  const completeHtml = `
    <h3>${name}</h3>
    <p>${restaurant.company}</p>
    <p>${address} ${postalCode} ${city}</p>
    <p>${phone}</p>
    <table>
      <tr>
        <th>Course</th>
        <th>Diet</th>
        <th>Price</th>
      </tr>
      ${menuHtml}
    </table>
  `;

  // Returning the complete HTML content
  return completeHtml;
};

// Exporting the functions
export { restaurantRow, restaurantModal };
