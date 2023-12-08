'use strict';

const modal = document.querySelector('dialog');
modal.addEventListener('click', () => modal.close());

const apiUrl = 'https://sodexo-webscrape-r73sdlmfxa-lz.a.run.app/api/v1';
const positionOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const fetchData = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error ${response.status} occurred`);
  }
  return response.json();
};

const calculateDistance = (x1, y1, x2, y2) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const error = (err) => console.warn(`ERROR(${err.code}): ${err.message}`);

const success = async (pos) => {
  try {
    const crd = pos.coords;
    const restaurants = await fetchData(`${apiUrl}/restaurants`);
    console.log(restaurants);

    restaurants.sort((a, b) => {
      const [x1, y1] = [crd.latitude, crd.longitude];
      const [x2a, y2a] = a.location.coordinates;
      const distanceA = calculateDistance(x1, y1, x2a, y2a);
      const [x2b, y2b] = b.location.coordinates;
      const distanceB = calculateDistance(x1, y1, x2b, y2b);
      return distanceA - distanceB;
    });

    for (const restaurant of restaurants) {
      const tr = document.createElement('tr');
      const name = document.createElement('td');
      name.innerText = restaurant.name;
      const address = document.createElement('td');
      address.innerText = restaurant.address;
      tr.appendChild(name);
      tr.appendChild(address);
      document.querySelector('table').appendChild(tr);

      tr.addEventListener('click', async () => {
        try {
          // remove all highlights
          document.querySelectorAll('.highlight').forEach((high) => {
            high.classList.remove('highlight');
          });

          // add highlight
          tr.classList.add('highlight');

          // add restaurant data to modal
          modal.innerHTML = '';
          const html = `<h3>${restaurant.name}</h3>
            <p>${restaurant.company}</p>
            <p>${restaurant.address} ${restaurant.postalCode} ${restaurant.city}</p>
            <p>${restaurant.phone}</p>`;
          modal.insertAdjacentHTML('beforeend', html);

          // fetch menu
          const menu = await fetchData(
            `${apiUrl}/restaurants/daily/${restaurant._id}/fi`
          );
          console.log(menu);

          let menuHtml = `<table>
            <tr>
              <th>Course</th>
              <th>Diet</th>
              <th>Price</th>
            </tr>`;

          for (const course of menu.courses) {
            menuHtml += `<tr>
              <td>${course.name}</td>
              <td>${course.diets || ' - '}</td>
              <td>${course.price || ' - '}</td>
            </tr>`;
          }

          menuHtml += '</table>';
          modal.insertAdjacentHTML('beforeend', menuHtml);
          modal.showModal();
        } catch (error) {
          alert(error.message);
        }
      });
    }
  } catch (error) {
    alert(error.message);
  }
};

navigator.geolocation.getCurrentPosition(success, error, positionOptions);
