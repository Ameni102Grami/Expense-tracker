import axios from "axios";

// Function to fetch data from a given URL
export async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to update data at a given URL
export async function updateData(url, data) {
  console.log({ data });
  try {
    const response = await axios.put(url, data);
    return response.data;
  } catch (error) {
    console.error("Error updating data:", error);
  }
}

// Function to delete data at a given URL
export async function deleteData(url) {
  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
  }
}
