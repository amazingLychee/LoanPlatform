const axios = require('axios');

// Example API URLs

const service1URL = 'https://api.service1.com/data';

const service2URL = 'https://api.service2.com/data';

const service3URL = 'https://api.service3.com/data';

// Controller function to call all 3 services

const callServices = async (req, res) => {

    try {

        // Making all API calls in parallel using Promise.all

        const [response1, response2, response3] = await Promise.all([

            axios.get(service1URL),

            axios.get(service2URL),

            axios.get(service3URL),

        ]);

        // Combine the results

        const results = {

            service1: response1.data,

            service2: response2.data,

            service3: response3.data,

        };

        // Send the combined response back to the client

        res.status(200).json(results);

    } catch (error) {

        // Error handling

        console.error('Error making API calls:', error);

        res.status(500).json({ message: 'Error occurred while calling services' });

    }

};

module.exports = {

    callServices,

};

