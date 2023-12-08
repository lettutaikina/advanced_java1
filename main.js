// main.js

// Importing variables and functions from modules
import { apiUrl } from './variables.js';
import { fetchData, calculateDistance, error, success } from './utils.js';
import { restaurantRow, restaurantModal } from './components.js';

// ...

async function success(pos) {
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
      const row = restaurantRow(restaurant);

      row.addEventListener('click', async () => {
        try {
          document.querySelectorAll('.highlight').forEach((high) => {
            high.classList.remove('highlight');
          });

          row.classList.add('highlight');
          modal.innerHTML = '';

          const menu = await fetchData(
            `${apiUrl}/restaurants/daily/${restaurant._id}/fi`
          );

          const modalHtml = restaurantModal(restaurant, menu);
          modal.innerHTML = modalHtml;
          modal.showModal();
        } catch (error) {
          alert(error.message);
        }
      });

      document.querySelector('table').appendChild(row);
    }
  } catch (error) {
    alert(error.message);
  }
}

// ...
