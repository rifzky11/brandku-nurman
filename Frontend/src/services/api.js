import axios from 'axios';

const API_URL = 'http://localhost:5001/api/items';

export const getItems = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};

export const fetchItems = getItems;

export const getItemById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching item with id ${id}:`, error);
        throw error;
    }
};

export const createItem = async (item) => {
    try {
        const response = await axios.post(API_URL, item);
        return response.data;
    } catch (error) {
        console.error('Error creating item:', error);
        throw error;
    }
};

export const updateItem = async (id, item) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, item);
        return response.data;
    } catch (error) {
        console.error(`Error updating item with id ${id}:`, error);
        throw error;
    }
};

export const deleteItem = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting item with id ${id}:`, error);
        throw error;
    }
};